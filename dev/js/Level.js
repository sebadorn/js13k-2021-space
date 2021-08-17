'use strict';


{

class Level {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this.effects = [];
		this.dangers = [];

		this.timer = 0;
	}


	/**
	 *
	 */
	draw() {
		const width = js13k.Renderer.cnv.width;
		const height = js13k.Renderer.cnv.height;

		this.drawBackground( height, width );

		this.effects.forEach( effect => effect.draw( js13k.Renderer.ctx ) );
		this.dangers.forEach( danger => danger.draw( js13k.Renderer.ctxDanger ) );

		if( this.player ) {
			this.player.draw( js13k.Renderer.ctx );
		}
	}


	/**
	 *
	 * @param {number} cnvHeight
	 * @param {number} cnvWidth
	 */
	drawBackground( cnvHeight, cnvWidth ) {
		// TODO:
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;

		this.effects.forEach( effect => effect.update( dt ) );
		this.dangers.forEach( danger => danger.update( dt ) );

		if( this.player ) {
			const dir = js13k.Input.getDirections();
			this.player.update( dt, dir );
		}
	}


}


js13k.Level = Level;

}
