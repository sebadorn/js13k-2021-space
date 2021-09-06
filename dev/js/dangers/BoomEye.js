'use strict';


{

class BoomEye extends js13k.LevelObject {


	/**
	 *
	 * @constructor
	 * @param {js13k.Level} level
	 * @param {number}      x
	 * @param {number}      y
	 * @param {number}     [targetX = 0]
	 * @param {number}     [targetY = 0]
	 */
	constructor( level, x, y, targetX = 0, targetY = 0 ) {
		super( level, { x, y, w: BoomEye.W, h: BoomEye.H } );

		this.sp = 0;
		this.targetX = targetX;
		this.targetY = targetY;

		if( !BoomEye.sprite ) {
			BoomEye.sprite = [
				BoomEye.preRender( this.w, this.h ),
				BoomEye.preRender( this.w, this.h )
			];
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		const frame = this.level.timer % 20 < 10 ? 0 : 1;
		ctx.drawImage( BoomEye.sprite[frame], Math.round( this.x ), Math.round( this.y ) );

		// TODO:
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		// TODO:
	}


}


BoomEye.W = 32;
BoomEye.H = 32;


/**
 *
 * @param  {number} w
 * @param  {number} h
 * @param  {number} offsetX
 * @return {HTMLCanvasElement}
 */
BoomEye.preRender = function( w, h, offsetX ) {
	const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( w, h );

	// TODO: Draw BoomEye. Probably a circle within a bigger circle or something like that.
	// Or a slit inside a circle. Can probably also omit creating a preRender of it.

	return canvas;
};


js13k.LevelObject.BoomEye = BoomEye;

}
