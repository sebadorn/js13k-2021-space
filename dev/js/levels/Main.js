'use strict';


{

class Level_Main extends js13k.Level {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		super();

		this.player = new js13k.Player( this, 400, 400 );

		this.dangers.push(
			new js13k.LevelObject.DangerEye( this, 100, 100 )
		);

		[this.cnvHit, this.ctxHit] = js13k.Renderer.getOffscreenCanvas( this.player.w, this.player.h );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2d} ctx
	 */
	draw( ctx ) {
		super.draw( ctx );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		super.update( dt );
	}


}


js13k.Level.Main = Level_Main;

}
