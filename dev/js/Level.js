'use strict';


{

class Level {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this.border = 0;
		this.dangers = [];
		this.goProgress = 0;
		this.isGameOver = false;
		this.timer = 0;
	}


	/**
	 * Check if player is hit.
	 * @return {boolean}
	 */
	checkHit() {
		if( !this.player || !this.player.vuln ) {
			return false;
		}

		const hitbox = this.player.getHitbox();
		const scale = js13k.Renderer.scale;

		// Pixel-perfect collision detection with the player.
		//
		// Draw the canvas with all dangers onto a small canvas
		// the size of the player hitbox. Only draw the area
		// the player hitbox is currently at. Then read the pixels
		// of that small canvas and check for certain colors.
		this.ctxHit.clearRect( 0, 0, hitbox[2], hitbox[3] );
		this.ctxHit.drawImage(
			js13k.Renderer.cnvDanger,
			scale * hitbox[0], scale * hitbox[1], scale * hitbox[2], scale * hitbox[3],
			0, 0, hitbox[2], hitbox[3]
		);

		const imageData = this.ctxHit.getImageData( 0, 0, hitbox[2], hitbox[3] );

		for( let i = 0; i < imageData.data.length; i += 4 ) {
			const r = imageData.data[i + 0];
			const g = imageData.data[i + 1];
			const b = imageData.data[i + 2];
			const a = imageData.data[i + 3];

			// White, e.g. eye laser.
			if(
				r >= 254 &&
				g >= 254 &&
				b >= 254 &&
				a >= 159
			) {
				return true;
			}

			// Border (blue).
			// Being a bit paranoid here about color precision. Better
			// check for a small interval instead of a precise value.
			// Browser extensions like CanvasBlocker will tamper with
			// the read pixel image data (and also cause bad performance).
			if(
				r >= 59 && r <= 61 &&
				g >= 118 && g <= 120 &&
				b >= 146 && b <= 148 &&
				a >= 254
			) {
				return true;
			}
		}

		return false;
	}


	/**
	 *
	 */
	draw() {
		if( this.isGameOver ) {
			this.drawGameOver( js13k.Renderer.ctx );
			return;
		}

		this.drawBackground( js13k.Renderer.ctx );
		this.drawBorder( js13k.Renderer.ctxDanger );

		this.dangers.forEach( danger => danger.draw( js13k.Renderer.ctxDanger ) );

		if( this.player ) {
			this.player.draw( js13k.Renderer.ctx );
			this.drawHP( js13k.Renderer.ctxUI );
		}
	}


	/**
	 *
	 */
	drawBackground() {}


	/**
	 *
	 * @param  {CanvasRenderingContext2D} ctx
	 * @return {number} Current border width.
	 */
	drawBorder( ctx ) {
		const lw = Math.round( 20 + this.border );
		const offset = lw * 0.5;

		ctx.lineWidth = lw;
		ctx.strokeStyle = '#3C7793';
		ctx.strokeRect( offset, offset, js13k.Renderer.res - lw, js13k.Renderer.res - lw );

		return lw;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D}
	 */
	drawGameOver( ctx ) {
		const res = js13k.Renderer.res;
		const center = js13k.Renderer.center;

		ctx.font = 'bold 36px ' + js13k.FONT;
		ctx.textAlign = 'center';

		ctx.fillStyle = '#DDD';
		ctx.fillText( 'JUST GIVE UP!', center, center - 138 );
		ctx.fillText( 'LEAVE IT ALL TO ME.', center, center - 102 );

		ctx.fillStyle = '#3C7793';
		ctx.fillText( 'JUST GIVE UP!', center, center - 136 );
		ctx.fillText( 'LEAVE IT ALL TO ME.', center, center - 100 );

		ctx.font = 'bold 18px ' + js13k.FONT;
		ctx.fillStyle = '#AAA';
		ctx.globalAlpha = js13k.getTextAlpha( this.timer );
		ctx.fillText( 'Or press [space] to try again', center, center - 60 );
		ctx.globalAlpha = 1;

		if( this.goProgress <= 1 ) {
			ctx.fillStyle = '#3C7793';
			ctx.fillRect( 0, 0, res, res * ( 1 - Math.min( this.goProgress * this.goProgress, 1 ) ) );
		}
	}


	/**
	 * Draw a health indicator for the player.
	 * @param {CanvasRenderingContext2D} ctx
	 */
	drawHP( ctx ) {
		const center = js13k.Renderer.center;
		const res = js13k.Renderer.res;

		for( let i = 0; i < 3; i++ ) {
			ctx.globalAlpha = this.player.hp > i ? 1 : 0.3;
			ctx.drawImage( js13k.Player.sprite[0], center - 60 + i * 40, res - 42 );
		}

		ctx.globalAlpha = 1;
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;

		if( this.isGameOver ) {
			this.goProgress += dt * 0.015;

			if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
				js13k.Renderer.reloadLevel();
			}
		}
		else {
			this.dangers.forEach( danger => danger.update( dt ) );

			if( this.player ) {
				const dir = js13k.Input.getDirections();
				this.player.update( dt, dir );

				if( this.player.hit <= this.timer && this.checkHit() ) {
					this.player.hp--;
					js13k.Renderer.shake();
					js13k.Audio.playFreq( 29.14, 0.4, 'sawtooth' );

					if( this.player.hp > 0 ) {
						// How long the "has been hit" state stays.
						this.player.hit = this.timer + dt * 240;
					}
					else {
						this.isGameOver = true;
					}
				}
			}
		}
	}


}


js13k.Level = Level;

}
