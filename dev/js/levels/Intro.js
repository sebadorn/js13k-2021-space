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

		this.player.draw( ctx );

		this.drawOption( ctx, 0, 'being watched', 60 );
		this.drawOption( ctx, 1, 'being eaten', 130 );
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
