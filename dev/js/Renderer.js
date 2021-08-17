'use strict';


/**
 * @namespace js13k.Renderer
 */
js13k.Renderer = {


	// Canvas for background, player, UI.
	cnv: null,
	ctx: null,

	// Canvas for everything that could harm the player.
	// Separate from the main canvas to do some pixel-based collision detection.
	cnvDanger: null,
	ctxDanger: null,

	last: 0,
	level: null,


	/**
	 * Clear the canvas.
	 */
	clear() {
		this.ctx.fillStyle = '#202020';
		this.ctx.fillRect( 0, 0, this.cnv.width, this.cnv.height );

		this.ctxDanger.clearRect( 0, 0, this.cnvDanger.width, this.cnvDanger.height );
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
		// TODO:

		// this.ctx.fillStyle = '#111';
		// this.ctx.fillRect( 0, 0, this.cnv.width, this.cnv.height );

		// this.ctx.fillStyle = '#a2a2a2';
		// this.ctx.font = 'bold 128px Arial, sans-serif';
		// this.ctx.textAlign = 'center';
		// this.ctx.fillText( 'PAUSED', this.centerX, this.centerY );

		// this.ctx.fillStyle = '#808080';
		// this.ctx.font = '48px Arial, sans-serif';
		// this.ctx.fillText( 'Press [Esc] to continue.', this.centerX, this.centerY + 80 );
	},


	/**
	 * Initialize the renderer.
	 * @param {function} cb
	 */
	init( cb ) {
		this.cnv = document.getElementById( 'c' );
		this.ctx = this.cnv.getContext( '2d', { alpha: false } );
		this.ctx.imageSmoothingEnabled = false;

		this.cnvDanger = document.getElementById( 'd' );
		this.ctxDanger = this.cnvDanger.getContext( '2d', { alpha: true } );
		this.ctxDanger.imageSmoothingEnabled = false;

		this.registerEvents();
		this.loadImages( cb );
	},


	/**
	 * Load images for use on the canvas.
	 * @param {function} cb
	 */
	loadImages( cb ) {
		let loaded = 0;

		// TODO: load images

		// const img_m = new Image();
		// img_m.onload = () => {
		// 	this.sprite_m = img_m;
		// 	( ++loaded === 2 ) && cb();
		// };
		// img_m.src = 'm.gif';

		// const img_s = new Image();
		// img_s.onload = () => {
		// 	this.sprite_s = img_s;
		// 	( ++loaded === 2 ) && cb();
		// };
		// img_s.src = 's.gif';

		cb();
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
			this.ctx.lineWidth = 1;
			this.ctx.textBaseline = 'alphabetic';
			this.ctx.setTransform( 1, 0, 0, 1, 0, 0 );

			if( this.isPaused ) {
				this.drawPause();
				return; // Stop the loop.
			}
			else {
				this.level && this.level.update( dt );
				this.draw( dt );
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
	 * Resize the canvas.
	 * @param {?number} w
	 * @param {?number} h
	 */
	resize( w = Infinity, h = Infinity ) {
		this.cnv.height = Math.min( window.innerHeight, h );
		this.cnv.width = Math.min( window.innerWidth, w );

		this.cnvDanger.height = this.cnv.height;
		this.cnvDanger.width = this.cnv.width;

		this.centerX = Math.round( this.cnv.width / 2 );
		this.centerY = Math.round( this.cnv.height / 2 );

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
	 * Render an object to an offset canvas.
	 * @param  {js13k.LevelObject} o
	 * @param  {?number}           h
	 * @param  {?number}           w
	 * @return {HTMLCanvasElement}
	 */
	toOffscreenCanvas( o, h, w ) {
		const canvas = document.createElement( 'canvas' );
		canvas.width = w || o.w;
		canvas.height = h || o.h;

		const ctx = canvas.getContext( '2d' );
		ctx.imageSmoothingEnabled = false;
		o.draw( ctx );

		return canvas;
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
