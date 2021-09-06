'use strict';


/**
 * @namespace js13k.Renderer
 */
js13k.Renderer = {


	// No need to set these attributes right now.
	// Leaving them as comment to know they (will) exist.
	// --------------------------------------------------
	//
	// centerX: 0,
	// centerY: 0,
	// cont: null,
	// last: 0,
	// level: null,
	//
	// // Canvas for background, player
	// cnv: null,
	// ctx: null,
	//
	// // Canvas for everything that could harm the player.
	// // Separate from the main canvas to do some pixel-based collision detection.
	// cnvDanger: null,
	// ctxDanger: null,
	//
	// cnvUI: null,
	// ctxUI: null,

	// Target resolution which would mean a scaling factor of 1.0.
	res: 1000,
	// Scaling factor. Updated in resize().
	scale: 1,

	// Loaded sprites.
	sprites: {},


	/**
	 * Clear the canvas.
	 */
	clear() {
		const width = this.cnv.width / this.scale;
		const height = this.cnv.height / this.scale;

		this.ctx.clearRect( 0, 0, width, height );
		this.ctxDanger.clearRect( 0, 0, width, height );
		this.ctxUI.clearRect( 0, 0, width, height );
	},


	/**
	 * Draw to the canvas.
	 */
	draw() {
		this.clear();
		this.level && this.level.draw();
	},


	/**
	 * Draw the pause screen.
	 */
	drawPause() {
		const width = this.cnvUI.width / this.scale;
		const height = this.cnvUI.height / this.scale;

		this.ctxUI.setTransform( this.scale, 0, 0, this.scale, 0, 0 );
		this.ctxUI.clearRect( 0, 0, width, height );

		this.ctxUI.fillStyle = 'rgba(0,0,0,0.4)';
		this.ctxUI.fillRect( 0, 0, width, height );

		this.ctxUI.fillStyle = '#FFF';
		this.ctxUI.font = 'normal 56px ' + js13k.FONT;
		this.ctxUI.textAlign = 'center';
		this.ctxUI.textBaseline = 'top';
		this.ctxUI.fillText( 'PAUSED', this.centerX, 20 );
	},


	/**
	 * Get an offset canvas and its context.
	 * @param  {number} w
	 * @param  {number} h
	 * @return {array} [HTMLCanvasElement, CanvasRenderingContext2D]
	 */
	getOffscreenCanvas( w, h ) {
		const canvas = document.createElement( 'canvas' );
		canvas.width = w;
		canvas.height = h;

		const ctx = canvas.getContext( '2d', { alpha: true } );
		ctx.imageSmoothingEnabled = false;

		return [canvas, ctx];
	},


	/**
	 * Initialize the renderer.
	 * @param {function} cb
	 */
	init( cb ) {
		this.cont = document.getElementById( 'm');

		this.cnv = document.getElementById( 'c' );
		this.ctx = this.cnv.getContext( '2d', { alpha: true } );
		this.ctx.imageSmoothingEnabled = false;

		this.cnvDanger = document.getElementById( 'd' );
		this.ctxDanger = this.cnvDanger.getContext( '2d', { alpha: true } );
		this.ctxDanger.imageSmoothingEnabled = false;

		this.cnvUI = document.getElementById( 'ui' );
		this.ctxUI = this.cnvUI.getContext( '2d', { alpha: true } );
		this.ctxUI.imageSmoothingEnabled = false;

		this.registerEvents();
		this.loadSprites( cb );
	},


	/**
	 * Load images for use on the canvas.
	 * @param {function} cb
	 */
	loadSprites( cb ) {
		const keys = Object.keys( js13k.Assets.sprites );

		const render = i => {
			if( i == keys.length ) {
				cb();
				return;
			}

			const key = keys[i];
			const sprite = js13k.Assets.sprites[key];

			const cnv = document.createElement( 'canvas' );
			cnv.width = sprite.s[0];
			cnv.height = sprite.s[1];

			const ctx = cnv.getContext( '2d', { alpha: true } );
			const imageData = ctx.createImageData( cnv.width, cnv.height );

			for( let j = 0; j < sprite.data.length; j++ ) {
				const d = sprite.data[j];
				const color = sprite.c[d];

				let r = 0;
				let g = 0;
				let b = 0;
				let a = 0;

				if( color ) {
					[r, g, b, a] = color;
				}

				imageData.data[j * 4 + 0] = r;
				imageData.data[j * 4 + 1] = g;
				imageData.data[j * 4 + 2] = b;
				imageData.data[j * 4 + 3] = a;
			}

			ctx.putImageData( imageData, 0, 0 );

			this.sprites[key] = cnv;

			setTimeout( () => render( i + 1 ), 1 );
		};

		render( 0 );
	},


	/**
	 * Start the main loop. Update logic, render to the canvas.
	 * @param {number} [timestamp = 0]
	 */
	mainLoop( timestamp = 0 ) {
		js13k.Input.update();

		if( timestamp && this.last ) {
			const timeElapsed = timestamp - this.last; // Time that passed between frames. [ms]

			// Target speed of 60 FPS (=> 1000 / 60 ~= 16.667 [ms]).
			const dt = timeElapsed / ( 1000 / js13k.TARGET_FPS );

			this.ctx.imageSmoothingEnabled = false;
			this.ctxDanger.imageSmoothingEnabled = false;
			this.ctxUI.imageSmoothingEnabled = false;

			this.ctx.lineWidth = 1;
			this.ctx.textBaseline = 'alphabetic';

			this.ctx.setTransform( this.scale, 0, 0, this.scale, 0, 0 );
			this.ctxDanger.setTransform( this.scale, 0, 0, this.scale, 0, 0 );
			this.ctxUI.setTransform( this.scale, 0, 0, this.scale, 0, 0 );

			if( this.isPaused ) {
				this.drawPause();
				return; // Stop the loop.
			}
			else {
				this.level && this.level.update( dt );
				this.draw( dt );
			}

			// Draw FPS info
			if( js13k.DEBUG ) {
				this.ctxUI.fillStyle = '#000';
				this.ctxUI.fillRect( 10, this.res - 45, 90, 29 );

				this.ctxUI.fillStyle = '#FFF';
				this.ctxUI.font = 'bold 16px ' + js13k.FONT;
				this.ctxUI.textAlign = 'left';
				this.ctxUI.textBaseline = 'bottom';
				this.ctxUI.fillText( ~~( js13k.TARGET_FPS / dt ) + ' FPS', 20, this.res - 22 );
			}
		}

		this.last = timestamp;

		requestAnimationFrame( t => this.mainLoop( t ) );
	},


	/**
	 *
	 */
	pause() {
		this.isPaused = true;
	},


	/**
	 *
	 */
	registerEvents() {
		window.addEventListener( 'resize', _ev => this.resize() );
		this.resize();

		const keys = js13k.Input.getKeysForAction( js13k.Input.ACTION.PAUSE );

		setInterval(
			() => {
				// Inputs are not updated if main loop is not running.
				if( this.isPaused ) {
					js13k.Input.update();
				}

				keys.gamepad.forEach( key => {
					if( js13k.Input.isPressedGamepad( key, true ) ) {
						this.togglePause();
					}
				} );
			},
			100
		);

		const cbPause = () => this.togglePause();
		keys.keyboard.forEach( key => js13k.Input.onKeyUp( key, cbPause ) );

		js13k.Input.on( 'gp_disconnect', () => this.pause() );
	},


	/**
	 *
	 */
	reloadLevel() {
		this.level = new this.level.constructor();
	},


	/**
	 * Resize the canvas.
	 */
	resize() {
		const w = Math.min( window.innerWidth, window.innerHeight );
		const h = w;

		this.cnv.height = h;
		this.cnv.width = w;

		this.cnvDanger.height = h;
		this.cnvDanger.width = w;

		this.cnvUI.height = h;
		this.cnvUI.width = w;

		this.centerX = Math.round( this.res / 2 );
		this.centerY = this.centerX;

		this.scale = w / this.res;

		if( this.isPaused ) {
			clearTimeout( this._timeoutDrawPause );
			this._timeoutDrawPause = setTimeout( () => this.drawPause(), 100 );
		}
	},


	/**
	 *
	 */
	togglePause() {
		if( this.isPaused ) {
			this.unpause();
		}
		else {
			this.pause();
		}
	},


	/**
	 *
	 */
	unpause() {
		if( this.isPaused ) {
			this.isPaused = false;
			this.mainLoop();
		}
	}


};
