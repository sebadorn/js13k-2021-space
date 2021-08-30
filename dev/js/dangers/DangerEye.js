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

		this.angle = 0;
		this.sp = 1;

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
		const center = this.getCenter( true );

		// Rotate so it faces the player.
		ctx.translate( center.x, center.y );
		ctx.rotate( this.angle );
		ctx.translate( -center.x, -center.y );

		ctx.drawImage( DangerEye.sprite[frame], Math.round( this.x ), Math.round( this.y ) );
		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
	}


	/**
	 *
	 * @param {number} dt
	 * @param {object} dir
	 * @param {number} dir.x
	 * @param {number} dir.y
	 */
	update( dt, dir ) {
		// Track player.

		const hb = this.level.player.getHitbox();
		const playerCenterX = hb[0] + hb[2] * 0.5;
		const playerCenterY = hb[1] + hb[3] * 0.5;

		const center = this.getCenter();
		const diffX = center.x - playerCenterX;
		const diffY = center.y - playerCenterY;

		let moveX = 0;
		let moveY = 0;

		if( diffX > 0 ) {
			moveX -= dt * this.sp;
		}
		else if( diffX < 0 ) {
			moveX += dt * this.sp;
		}

		if( diffY > 0 ) {
			moveY -= dt * this.sp;
		}
		else if( diffY < 0 ) {
			moveY += dt * this.sp;
		}

		this.x += moveX;
		this.y += moveY;


		// Calculate angle.
		// What has been shortened:
		//
		// const vec1 = [0, -1];
		// Math.atan2( vec1[1], vec1[0] );
		// -> -1.5707963267948966

		const vec2 = [
			playerCenterX - center.x,
			playerCenterY - center.y
		];
		const vec2Len = js13k.vecLength( vec2 );
		vec2[0] /= vec2Len;
		vec2[1] /= vec2Len;

		this.angle = Math.atan2( vec2[1], vec2[0] ) + 1.5707963267948966;
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
