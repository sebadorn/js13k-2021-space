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

		this.died = 0;
		this.f = 0; // frame timer
		this.sp = 6; // movement speed
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		const offsetX = this.f < 10 ? 0 : 32;

		ctx.drawImage(
			js13k.Renderer.sprites.player.cnv, offsetX, 0, 32, 32,
			~~this.x, ~~this.y, this.w, this.h
		);

		if( js13k.DEBUG ) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'red';
			ctx.strokeRect( ...this.getHitbox() );
		}
	}


	/**
	 *
	 * @return {number[]} global x, global y, width, height
	 */
	getHitbox() {
		return [this.x + 8, this.y + 12, 16, 16];
	}


	/**
	 *
	 * @param {number} dt
	 * @param {object} dir
	 * @param {number} dir.x
	 * @param {number} dir.y
	 */
	update( dt, dir ) {
		this.f = ( this.f + dt ) % 20;
		this.x += dt * dir.x * this.sp;
		this.y += dt * dir.y * this.sp;
	}


}


js13k.Player = Player;

}
