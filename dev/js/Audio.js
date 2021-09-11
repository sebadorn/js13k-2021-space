'use strict';


/**
 * @namespace js13k.Audio
 */
js13k.Audio = {


	_cache: {},
	_muteVol: 0.2,

	// No need to set these attributes right now.
	// Leaving them as comment to know they (will) exist.
	// --------------------------------------------------
	//
	// ctx: null,
	// gain: null,


	// Functions to create sounds. Pass to play() in order to use.
	SOUND: {

		// Source: https://xem.github.io/MiniSoundEditor/
		// Example "glitch1" by Anders Kaare.
		GLITCH1: ( i, data0, data1 ) => {
			const length = 50000;
			const done = i > length;

			if( !done ) {
				let value = ( Math.pow( i + Math.sin( i * 0.01 ) * 1000, 0.8 ) & 200 ) ? 0.5 : -0.5;
				value *= ( length - i ) / length;

				data0[i] = value;
				data1[i] = value;
			}

			return done;
		},

		NOISE: ( i, data0, data1 ) => {
			data0[i] = Math.random() * 2 - 1;
			data1[i] = Math.random() * 2 - 1;

			return false;
		},

		// Source: https://xem.github.io/MiniSoundEditor/
		// Example "rumbl" by Anders Kaare.
		RUMBL: ( i, data0, data1 ) => {
			const length = 40000;
			const done = i > length;

			if( !done ) {
				let value = Math.sin( i / 1000 - Math.sin( i / 100 ) * Math.sin( i / 61 ) );
				value *= ( length - i ) / length;

				data0[i] = value;
				data1[i] = value;
			}

			return done;
		},

		// Source: https://xem.github.io/MiniSoundEditor/
		// Example "rumb2" by Anders Kaare.
		RUMBL2: ( i, data0, data1 ) => {
			const length = 40000;
			const done = i > length;

			if( !done ) {
				let value = Math.sin( i / 2000 - Math.sin( i / 331 ) * Math.sin( i / 61 ) );
				value *= ( length - i ) / length;

				data0[i] = value;
				data1[i] = value;
			}

			return done;
		}

	},


	/**
	 *
	 */
	init() {
		this.ctx = new window.AudioContext();

		this.gain = this.ctx.createGain();
		this.gain.connect( this.ctx.destination );

		// Default volume is too loud. Go with something
		// really low, it will still be loud enough.
		this.volume( 0.2 );

		// Cache all sounds as AudioBuffers.
		for( const name in this.SOUND ) {
			const frameCount = this.ctx.sampleRate * 2;
			const buffer = this.ctx.createBuffer( 2, frameCount, this.ctx.sampleRate );

			// Two channels for stereo.
			const channelData0 = buffer.getChannelData( 0 );
			const channelData1 = buffer.getChannelData( 1 );

			for( let i = 0; i < frameCount; i++ ) {
				if( this.SOUND[name]( i, channelData0, channelData1 ) ) {
					break;
				}
			}

			this._cache[name] = buffer;
		}
	},


	/**
	 * Mute.
	 */
	mute() {
		if( this.gain.gain.value !== 0 ) {
			this._muteVol = this.gain.gain.value;
			this.gain.gain.value = 0;
		}
	},


	/**
	 *
	 * @param  {function} audioFunction
	 * @param  {?number}  duration
	 * @return {?AudioBufferSourceNode}
	 */
	play( audioFunction, duration ) {
		const buffer = this._cache[audioFunction.name];
		const source = this.ctx.createBufferSource();
		source.buffer = buffer;
		source.connect( this.gain );
		source.start( 0, 0, duration );

		// In case stop() should be called at some point.
		return source;
	},


	/**
	 *
	 * @param  {number}   freq
	 * @param  {number}   duration
	 * @param  {?string} [type = "sine"] - "sine", "square", "sawtooth", "triangle"
	 * @return {OscillatorNode}
	 */
	playFreq( freq, duration, type = 'sine' ) {
		const osc = this.ctx.createOscillator();
		osc.type = type;
		osc.frequency.setValueAtTime( freq, this.ctx.currentTime );
		osc.connect( this.gain );
		osc.start();
		osc.stop( this.ctx.currentTime + duration );

		return osc;
	},


	/**
	 * Unmute.
	 */
	unmute() {
		this.gain.gain.value = this._muteVol;
	},


	/**
	 *
	 * @param {number} value - Value between [0.0, 1.0].
	 */
	volume( value ) {
		this.gain.gain.value = Math.min( 1, Math.max( 0, value ) );
	}


};
