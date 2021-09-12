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

		NOISE: ( i, data0, data1 ) => {
			data0[i] = Math.random() * 2 - 1;
			data1[i] = Math.random() * 2 - 1;

			return false;
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
		this.volume( 0.1 );

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
	 * @param  {function}  audioFunction
	 * @param  {?number}   duration
	 * @param  {?number}  [gain = 1]
	 * @param  {?string}  [gainDirection = "dec"] - "dec", "inc"
	 * @return {?AudioBufferSourceNode}
	 */
	play( audioFunction, duration, gain = 1, gainDirection = 'dec' ) {
		// Gradually become quiter towards the end.
		//
		// NOTE: The gainNode value has to be set with setValueAtTime(),
		// otherwise linearRampToValueAtTime() does not work in Firefox.
		// @see https://bugzilla.mozilla.org/show_bug.cgi?id=1171438

		const gainNode = this.ctx.createGain();
		gainNode.connect( this.gain );

		if( gainDirection === 'inc' ) {
			gainNode.gain.setValueAtTime( 0, this.ctx.currentTime );
			gainNode.gain.linearRampToValueAtTime( gain, this.ctx.currentTime + duration - 0.01 );
		}
		else {
			gainNode.gain.setValueAtTime( gain, this.ctx.currentTime );
			gainNode.gain.linearRampToValueAtTime( 0, this.ctx.currentTime + duration - 0.01 );
		}

		const buffer = this._cache[audioFunction.name];
		const source = this.ctx.createBufferSource();
		source.buffer = buffer;
		source.connect( gainNode );
		source.start( 0, 0, duration );

		// In case stop() should be called at some point.
		return source;
	},


	/**
	 *
	 * @param  {number}   freq
	 * @param  {number}   duration
	 * @param  {?string} [type = "sine"]         - "sine", "square", "sawtooth", "triangle"
	 * @param  {?string} [gainDirection = "dec"] - "dec", "inc"
	 * @return {OscillatorNode}
	 */
	playFreq( freq, duration, type = 'sine', gainDirection = 'dec' ) {
		// Gradually become quiter towards the end.
		//
		// NOTE: The gainNode value has to be set with setValueAtTime(),
		// otherwise linearRampToValueAtTime() does not work in Firefox.
		// @see https://bugzilla.mozilla.org/show_bug.cgi?id=1171438

		const gainNode = this.ctx.createGain();
		gainNode.connect( this.gain );

		if( gainDirection === 'inc' ) {
			gainNode.gain.setValueAtTime( 0, this.ctx.currentTime );
			gainNode.gain.linearRampToValueAtTime( 1, this.ctx.currentTime + duration - 0.01 );
		}
		else {
			gainNode.gain.setValueAtTime( 1, this.ctx.currentTime );
			gainNode.gain.linearRampToValueAtTime( 0, this.ctx.currentTime + duration - 0.01 );
		}

		const osc = this.ctx.createOscillator();
		osc.type = type;
		osc.frequency.setValueAtTime( freq, this.ctx.currentTime );
		osc.connect( gainNode );
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
