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

		this.sp = 6;
		this.targetX = x;
		this.targetY = y;

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
		if( !this.started || this.ended ) {
			return;
		}

		const frame = this.level.timer % 20 < 10 ? 0 : 1;
		const center = this.getCenter( true );

		// Rotate so it faces the player.
		ctx.translate( center.x, center.y );
		ctx.rotate( this.angle );
		ctx.translate( -center.x, -center.y );

		ctx.drawImage( DangerEye.sprite[frame], Math.round( this.x ), Math.round( this.y ) );

		// Laser attack.
		if( this.attackStarted ) {
			const progress = Math.min( ( this.level.timer - this.started ) / 140, 1 );
			const alpha = progress * progress;
			const x = this.x + this.w / 2;

			ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
			ctx.lineWidth = Math.round( progress * this.w );

			ctx.beginPath();
			ctx.moveTo( x, this.y );
			ctx.lineTo( x, -js13k.Renderer.res * 1.5 );
			ctx.stroke();
		}

		ctx.setTransform( js13k.Renderer.scale, 0, 0, js13k.Renderer.scale, 0, 0 );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		if( !this.started ) {
			return;
		}

		if( this.attackStarted ) {
			this.ended = ( this.level.timer - this.started ) > 180;
			return;
		}

		this.attackStarted = ( this.level.timer - this.started ) > 30;

		// Move to target position.
		const center = this.getCenter();
		const diffX = center.x - this.targetX;
		const diffY = center.y - this.targetY;

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


		// Look in direction of player.
		// Calculate angle.
		//
		// What has been shortened:
		// ------------------------
		// const vec1 = [0, -1];
		// Math.atan2( vec1[1], vec1[0] );
		// -> -1.5707963267948966

		const playerCenter = this.level.player.getCenter();

		const vec2 = js13k.normalize([
			playerCenter.x - center.x,
			playerCenter.y - center.y
		]);

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
