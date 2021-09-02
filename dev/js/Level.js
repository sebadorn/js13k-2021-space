'use strict';


{

class Level {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this._selected = 0;
		this.border = 0;
		this.dangers = [];
		this.isGameOver = false;
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
		if( this.isGameOver ) {
			this.drawGameOver( js13k.Renderer.ctx );
			return;
		}

		this.drawBackground( js13k.Renderer.ctx );
		this.drawBorder( js13k.Renderer.ctxDanger );

		this.dangers.forEach( danger => danger.draw( js13k.Renderer.ctxDanger ) );

		if( this.player ) {
			this.player.draw( js13k.Renderer.ctx );
		}
	}


	/**
	 *
	 */
	drawBackground() {}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	drawBorder( ctx ) {
		const lw = Math.round( 10 + this.border );
		const offset = lw * 0.5;

		ctx.lineWidth = lw;
		ctx.strokeStyle = '#97387F';
		ctx.strokeRect( offset, offset, js13k.Renderer.cnv.width - lw, js13k.Renderer.cnv.height - lw );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D}
	 */
	drawGameOver( ctx ) {
		ctx.fillStyle = '#FFF';
		ctx.textAlign = 'center';
		ctx.fillText( 'DEVOURED BY FEAR', js13k.Renderer.centerX, js13k.Renderer.centerY );

		this.drawOption( ctx, 0, 'try again', 60 );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   index
	 * @param {string}                   text
	 * @param {number}                   offsetY
	 */
	drawOption( ctx, index, text, offsetY ) {
		const centerX = js13k.Renderer.centerX;
		const centerY = js13k.Renderer.centerY;
		const width = 180;
		const height = 40;

		const x = Math.round( centerX - width * 0.5 ) + 0.5;
		const y = Math.round( centerY + offsetY ) + 0.5;

		ctx.fillStyle = 'rgba(0,0,0,0.3)';
		ctx.fillRect( x, y, width, height );

		ctx.strokeStyle = index === this._selected ? 'orange' : '#FFF';
		ctx.lineWidth = 3;
		ctx.strokeRect( x, y, width, height );

		ctx.font = 'bold 20px "Courier New", monospace';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = '#FFF';
		ctx.fillText( text, centerX, y + 12 );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;

		if( this.isGameOver ) {
			if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
				if( this._selected === 0 ) {
					js13k.Renderer.reloadLevel();
				}
			}
		}
		else {
			this.dangers.forEach( danger => danger.update( dt ) );

			if( this.player ) {
				this.border += dt * 0.03;

				const dir = js13k.Input.getDirections();
				this.player.update( dt, dir );

				if( this.player.hit <= this.timer && this.checkHit() ) {
					this.player.hp--;

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
