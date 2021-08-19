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

	centerX: 0,
	centerY: 0,

	last: 0,

	// No need to set these attributes right now.
	// Leaving them as comment to know they (will) exist.
	//
	// level: null,
	// sprite: null,


	/**
	 * Clear the canvas.
	 */
	clear() {
		this.ctx.fillStyle = '#171717';
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
		this.ctx.fillStyle = '#FFF';
		this.ctx.font = 'normal 64px monospace';
		this.ctx.textAlign = 'left';
		this.ctx.textBaseline = 'top';
		this.ctx.fillText( 'PAUSED', 20, 20 );
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
		this.loadSprite( cb );
	},


	/**
	 * Load images for use on the canvas.
	 * @param {function} cb
	 */
	loadSprite( cb ) {
		const img = new Image();
		img.onload = () => {
			this.sprite = img;
			cb();
		};
		img.src = 's.gif';
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

			// Draw FPS info
			if( js13k.DEBUG ) {
				this.ctx.fillStyle = '#FFF';
				this.ctx.font = 'normal 16px monospace';
				this.ctx.textAlign = 'right';
				this.ctx.textBaseline = 'top';
				this.ctx.fillText( ~~( js13k.TARGET_FPS / dt ) + ' FPS', this.cnv.width - 20, 20 );
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
	 */
	resize() {
		this.cnv.height = window.innerHeight;
		this.cnv.width = window.innerWidth;

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
	 * @return {HTMLCanvasElement}
	 */
	toOffscreenCanvas( o ) {
		const canvas = document.createElement( 'canvas' );
		canvas.width = o.w;
		canvas.height = o.h;

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
