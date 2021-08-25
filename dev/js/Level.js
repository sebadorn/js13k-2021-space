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
	 * Check if player is hit.
	 * @return {boolean}
	 */
	checkHit() {
		// TODO: First check hitboxes, then imageData of LevelObject canvas ctx.
		// Checking the big canvas is veeery slow.
		// Might as well remove the cnvDanger and ctxDanger.

		const hitbox = this.player.getHitbox();
		const imageData = js13k.Renderer.ctxDanger.getImageData( ...hitbox );

		for( let i = 0; i < imageData.data.length; i += 4 ) {
			const r = imageData.data[i + 0];
			const g = imageData.data[i + 1];
			const b = imageData.data[i + 2];
			const a = imageData.data[i + 3];

			if( r >= 254 && g >= 254 && b >= 254 && a >= 254 ) {
				return true;
			}
		}

		return false;
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
			this.player.hit = this.checkHit();
		}
	}


}


js13k.Level = Level;

}
