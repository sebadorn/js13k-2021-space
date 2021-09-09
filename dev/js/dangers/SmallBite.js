'use strict';


{

class SmallBite extends js13k.LevelObject {


	/**
	 *
	 * @constructor
	 * @param {js13k.Level} level
	 * @param {number}      x
	 * @param {number}      y
	 */
	constructor( level, x, y ) {
		super( level, { x, y, w: 64, h: 32 } ); // height varies

		if( !SmallBite.sprite ) {
			SmallBite.sprite = [
				SmallBite.preRender( this.w, this.h, 0 ),
				SmallBite.preRender( this.w, this.h, 1 )
			];
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		const margin = ( Math.sin( this.level.timer * 0.1 ) + 1 ) * 20;
		const fh = this.h * 0.2;

		ctx.drawImage( SmallBite.sprite[0], this.x, this.y - fh - margin );
		ctx.drawImage( SmallBite.sprite[1], this.x, this.y + fh + margin );
	}


	/**
	 *
	 * @param {number} dt
	 * @param {object} dir
	 * @param {number} dir.x
	 * @param {number} dir.y
	 */
	update( dt, dir ) {
		//
	}


}


/**
 *
 * @param  {number} w
 * @param  {number} h
 * @param  {number} pos - 0: top row, 1: bottom row
 * @return {HTMLCanvasElement}
 */
SmallBite.preRender = function( w, h, pos ) {
	const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( w, h );
	const [scaleY, transY] = pos === 1 ? [-1, h] : [1, 0];

	// left
	ctx.setTransform( -1, 0, 0, scaleY, w / 2, transY );
	ctx.drawImage(
		js13k.Renderer.sprites.bite_small,
		0, 0, w / 2, h,
		0, 0, w / 2, h
	);

	// right
	ctx.setTransform( 1, 0, 0, scaleY, 0, transY );
	ctx.drawImage(
		js13k.Renderer.sprites.bite_small,
		0,     0, w / 2, h,
		w / 2, 0, w / 2, h
	);

	ctx.setTransform( 1, 0, 0, 1, 0, 0 );

	return canvas;
};


js13k.LevelObject.SmallBite = SmallBite;

}
