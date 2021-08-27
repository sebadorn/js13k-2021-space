'use strict';


{

class Player extends js13k.LevelObject {


	/**
	 *
	 * @constructor
	 * @param {js13k.Level} level
	 * @param {number}      x
	 * @param {number}      y
	 */
	constructor( level, x, y ) {
		super( level, { x, y, w: 32, h: 32 } );

		this.isHit = false;
		this.sp = 6; // movement speed

		if( !Player.sprite ) {
			Player.sprite = [
				Player.preRender( this.w, this.h, 0 ),
				Player.preRender( this.w, this.h, this.w )
			];
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		// Light circle
		const hitbox = this.getHitbox();
		const centerX = Math.round( hitbox[0] + hitbox[2] * 0.5 );
		const centerY = Math.round( hitbox[1] + hitbox[3] * 0.5 );

		let [alpha, r1, r2] = this.flicker ? [0.007, 110, 45] : [0.01, 120, 55];
		ctx.fillStyle = `rgba(255,255,196,${alpha})`;

		ctx.beginPath();
		ctx.ellipse( centerX, centerY, r1, r1, 0, 0, 360 );
		ctx.fill();

		ctx.beginPath();
		ctx.ellipse( centerX, centerY, r2, r2, 0, 0, 360 );
		ctx.fill();

		// Sprite
		const frame = this.level.timer % 20 < 10 ? 0 : 1;
		ctx.drawImage( Player.sprite[frame], this.x, this.y );

		if( js13k.DEBUG ) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = this.isHit ? 'blue' : 'red';
			ctx.strokeRect( ...this.getHitbox() );
		}
	}


	/**
	 *
	 * @return {number[]} global x, global y, width, height
	 */
	getHitbox() {
		return [this.x + 9, this.y + 15, 12, 12];
	}


	/**
	 *
	 * @param {number} dt
	 * @param {object} dir
	 * @param {number} dir.x
	 * @param {number} dir.y
	 */
	update( dt, dir ) {
		this.x += Math.round( dt * dir.x * this.sp );
		this.y += Math.round( dt * dir.y * this.sp );

		if( this.flicker > 0 ) {
			this.flicker -= dt;
		}
		else if( this.flicker < 0 ) {
			this.flicker = 0;
		}
		else if( Math.random() < 0.008 ) {
			this.flicker = dt * 16;
		}
	}


}


/**
 *
 * @param  {number} w
 * @param  {number} h
 * @param  {number} offsetX
 * @return {HTMLCanvasElement}
 */
Player.preRender = function( w, h, offsetX ) {
	const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( w, h );

	ctx.drawImage(
		js13k.Renderer.sprites.player,
		offsetX, 0, w, h,
		0, 0, w, h
	);

	return canvas;
};


js13k.Player = Player;

}
