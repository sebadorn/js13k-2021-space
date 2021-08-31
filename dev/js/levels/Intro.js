'use strict';


{

class Level_Intro extends js13k.Level {


	/**
	 * Intro.
	 * @constructor
	 */
	constructor() {
		super();

		this._selected = 0;

		this.player = new js13k.Player( this );
	}


	/**
	 *
	 * @private
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   index
	 * @param {string}                   text
	 * @param {number}                   offsetY
	 */
	_drawOption( ctx, index, text, offsetY ) {
		const centerX = js13k.Renderer.centerX;
		const centerY = js13k.Renderer.centerY;
		const width = 180;
		const height = 40;

		const x = Math.round( centerX - width * 0.5 ) + 0.5;
		const y = Math.round( centerY + offsetY ) + 0.5;

		ctx.fillStyle = 'rgba(0,0,0,0.3)';
		ctx.fillRect( x, y, width, height );

		if( index === this._selected ) {
			ctx.strokeStyle = 'orange';
		}
		else {
			ctx.strokeStyle = '#FFF';
		}

		ctx.lineWidth = 3;
		ctx.strokeRect( x, y, width, height );

		ctx.font = 'normal 20px monospace';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = '#FFF';
		ctx.fillText( text, centerX, y + 12 );
	}


	/**
	 *
	 * @private
	 */
	_loadLevel() {
		// TODO:
		if( this._selected === 0 ) {
			js13k.Renderer.level = new js13k.Level.Eyes();
		}
		else if( this._selected === 1 ) {
			js13k.Renderer.level = new js13k.Level.Teeth();
		}
	}


	/**
	 *
	 */
	draw() {
		const ctx = js13k.Renderer.ctx;

		this.player.draw( ctx );

		this._drawOption( ctx, 0, 'being watched', 60 );
		this._drawOption( ctx, 1, 'being eaten', 130 );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;

		this.player.x = js13k.Renderer.centerX - this.player.w * 0.5;
		this.player.y = js13k.Renderer.centerY - this.player.h * 0.5;

		const Input = js13k.Input;

		if( Input.isPressed( Input.ACTION.DOWN, true ) ) {
			this._selected = ( this._selected + 1 ) % NUM_OPTIONS;
		}
		else if( Input.isPressed( Input.ACTION.UP, true ) ) {
			this._selected--;
		}
		else if( Input.isPressed( Input.ACTION.DO, true ) ) {
			this._loadLevel();
		}

		if( this._selected < 0 ) {
			this._selected = NUM_OPTIONS - 1;
		}
	}


}


const NUM_OPTIONS = 2;


js13k.Level.Intro = Level_Intro;

}
