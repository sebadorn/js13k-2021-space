'use strict';


{

class DangerEye extends js13k.LevelObject {


	/**
	 *
	 * @constructor
	 * @param {js13k.Level} level
	 * @param {number}      x
	 * @param {number}      y
	 */
	constructor( level, x, y ) {
		super( level, { x, y, w: 61, h: 127 } );

		if( !DangerEye.sprite ) {
			DangerEye.sprite = [
				DangerEye.preRender( this.w, this.h, 0 ),
				DangerEye.preRender( this.w, this.h, this.w )
			];
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		const frame = this.level.timer % 20 < 10 ? 0 : 1;
		ctx.drawImage( DangerEye.sprite[frame], this.x, this.y );
	}


	/**
	 *
	 * @param {number} dt
	 * @param {object} dir
	 * @param {number} dir.x
	 * @param {number} dir.y
	 */
	update( dt, dir ) {
		// TODO:
	}


}


/**
 *
 * @param  {number} w
 * @param  {number} h
 * @param  {number} offsetX
 * @return {HTMLCanvasElement}
 */
DangerEye.preRender = function( w, h, offsetX ) {
	const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( w, h );

	ctx.drawImage(
		js13k.Renderer.sprites.eye,
		offsetX, 0, w, h,
		0, 0, w, h
	);

	return canvas;
};


js13k.LevelObject.DangerEye = DangerEye;

}
