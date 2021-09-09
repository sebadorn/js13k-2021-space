'use strict';


{

class Level_Intro extends js13k.Level {


	/**
	 * Intro.
	 * @constructor
	 */
	constructor() {
		super();

		this.player = new js13k.Player( this );
	}


	/**
	 *
	 * @private
	 */
	_loadLevel() {
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
		const centerX = js13k.Renderer.center;

		ctx.font = 'bold 36px ' + js13k.FONT;
		ctx.textAlign = 'center';

		ctx.fillStyle = '#444';
		ctx.fillText( 'CHOOSE YOUR DEMISE!', centerX, 195 );
		ctx.fillText( 'CHOOSE YOUR DEMISE!', centerX, 205 );
		ctx.fillText( 'WHICH FEAR SHALL DEVOUR YOU?', centerX, 135 );
		ctx.fillText( 'WHICH FEAR SHALL DEVOUR YOU?', centerX, 145 );

		ctx.fillStyle = '#ddd';
		ctx.fillText( 'CHOOSE YOUR DEMISE!', centerX, 200 );
		ctx.fillText( 'WHICH FEAR SHALL DEVOUR YOU?', centerX, 140 );

		this.player.draw( ctx );
		this.drawOption( ctx, 0, 'being watched', 100 );
		this.drawOption( ctx, 1, 'being eaten', 170 );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;

		this.player.x = js13k.Renderer.center - this.player.w * 0.5;
		this.player.y = js13k.Renderer.center - this.player.h * 0.5;

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
