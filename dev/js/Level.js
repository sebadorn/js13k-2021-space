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

		this.border = 0;
		this.timer = 0;
	}


	/**
	 * Check if player is hit.
	 * @return {boolean}
	 */
	checkHit() {
		const hitbox = this.player.getHitbox();

		// Pixel-perfect collision detection with the player.
		//
		// Draw the canvas with all dangers onto a small canvas
		// the size of the player hitbox. Only draw the area
		// the player hitbox is currently at. Then read the pixels
		// of that small canvas and check for certain colors.
		this.ctxHit.clearRect( 0, 0, hitbox[2], hitbox[3] );
		this.ctxHit.drawImage(
			js13k.Renderer.cnvDanger, ...hitbox,
			0, 0, hitbox[2], hitbox[3]
		);

		const imageData = this.ctxHit.getImageData( 0, 0, hitbox[2], hitbox[3] );

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
		this.drawBackground();
		this.drawBorder( js13k.Renderer.ctxDanger );

		this.effects.forEach( effect => effect.draw( js13k.Renderer.ctx ) );
		this.dangers.forEach( danger => danger.draw( js13k.Renderer.ctxDanger ) );

		if( this.player ) {
			this.player.draw( js13k.Renderer.ctx );
		}
	}


	/**
	 *
	 */
	drawBackground() {
		// TODO:
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	drawBorder( ctx ) {
		const lw = 40 + this.border;
		const offset = lw * 0.5;

		ctx.lineWidth = lw;
		ctx.strokeStyle = '#97387F';
		ctx.strokeRect( offset, offset, js13k.Renderer.cnv.width - lw, js13k.Renderer.cnv.height - lw );
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
			// Border
			this.border += dt * 0.01;

			// Player
			const dir = js13k.Input.getDirections();
			this.player.update( dt, dir );

			if( this.player.hit <= this.timer && this.checkHit() ) {
				this.player.hp--;

				if( this.player.hp <= 0 ) {
					// TODO: game over
				}

				// How long the "has been hit" state stays.
				this.player.hit = this.timer + dt * 240;
			}
		}
	}


}


js13k.Level = Level;

}
