'use strict';


/**
 * @namespace js13k.Audio
 */
js13k.Audio = {


	_cache: {},

	// No need to set these attributes right now.
	// Leaving them as comment to know they (will) exist.
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
		RUMB2: ( i, data0, data1 ) => {
			const length = 40000;
			const done = i > length;

			if( !done ) {
				let value = Math.sin( i / 2000 - Math.sin( i / 331 ) * Math.sin( i / 61 ) );
				value *= ( length - i ) / length;

				data0[i] = value;
				data1[i] = value;
			}

			return done;
		},

		// Source: https://xem.github.io/MiniSoundEditor/
		// Example "rumb3" by Anders Kaare.
		RUMB3: ( i, data0, data1 ) => {
			const length = 30000;
			const done = i > length;

			if( !done ) {
				let value = Math.sin( i / 2000 - Math.sin( i / 331 ) * Math.sin( i / 61 ) + Math.sin( Math.sin( i / 59 ) / 39 ) * 33 );
				value *= ( length - i ) / length;

				data0[i] = value;
				data1[i] = value;
			}

			return done;
		},

		// Source: https://xem.github.io/MiniSoundEditor/
		// Example "what9" by Anders Kaare.
		WHAT9: ( i, data0, data1 ) => {
			const length = 20000;
			const done = i > length;

			if( !done ) {
				const j = i * 0.04;

				let value = Math.sin( -j * 0.03 * Math.sin( 0.09 * j + Math.sin( j / 200 ) ) + Math.sin( j / 100 ) );
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
	},


	/**
	 *
	 * @param  {function} audioFunction
	 * @param  {?number}  duration
	 * @return {AudioBufferSourceNode}
	 */
	play( audioFunction, duration ) {
		let buffer = this._cache[audioFunction.name];

		if( !buffer ) {
			const frameCount = this.ctx.sampleRate * 2;
			buffer = this.ctx.createBuffer( 2, frameCount, this.ctx.sampleRate );

			// Two channels for stereo.
			const channelData0 = buffer.getChannelData( 0 );
			const channelData1 = buffer.getChannelData( 1 );

			for( let i = 0; i < frameCount; i++ ) {
				if( audioFunction( i, channelData0, channelData1 ) ) {
					break;
				}
			}

			this._cache[audioFunction.name] = buffer;
		}

		const source = this.ctx.createBufferSource();
		source.buffer = buffer;
		source.connect( this.gain );
		source.start( 0, 0, duration );

		// In case stop() should be called at some point.
		return source;
	},


	/**
	 *
	 * @param {number} value - Value between [0.0, 1.0].
	 */
	volume( value ) {
		this.gain.gain.value = Math.min( 1, Math.max( 0, value ) );
	}


};
