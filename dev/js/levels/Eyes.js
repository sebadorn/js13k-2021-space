'use strict';


{

class Level_Eyes extends js13k.Level {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		super();

		this.player = new js13k.Player( this, 400, 400 );

		this.dangers.push(
			new js13k.LevelObject.DangerEye( this, 100, 100 ),
			new js13k.LevelObject.SmallBite( this, 400, 100 )
		);

		[this.cnvHit, this.ctxHit] = js13k.Renderer.getOffscreenCanvas( this.player.w, this.player.h );
	}


	/**
	 *
	 */
	draw() {
		super.draw();
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		super.update( dt );
	}


}


js13k.Level.Eyes = Level_Eyes;

}
