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

		this.f = 0; // frame timer
		this.hit = false;
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
		const frame = this.f < 10 ? 0 : 1;
		ctx.drawImage( Player.sprite[frame], this.x, this.y );

		if( js13k.DEBUG ) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = this.hit ? 'blue' : 'red';
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
		this.f = ( this.f + dt ) % 20;
		this.x += Math.round( dt * dir.x * this.sp );
		this.y += Math.round( dt * dir.y * this.sp );
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
