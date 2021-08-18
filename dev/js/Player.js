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
		this.frame = 0;
		this.speed = 6;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		ctx.drawImage(
			js13k.Renderer.sprite, 0, 0, 32, 32,
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
		this.x += dt * dir.x * this.speed;
		this.y += dt * dir.y * this.speed;
	}


}


js13k.Player = Player;

}
