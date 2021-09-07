'use strict';


{

class DangerEye extends js13k.LevelObject {


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
		super( level, { x, y, w: DangerEye.W, h: DangerEye.H } );

		// 0: none, can be set from outside
		// 1: player
		// 2: targetX/Y values
		this.angleTarget = 0;

		// 0: After set time
		// 1: After reaching target
		this.attackStart = 0;

		// 0: No end
		// 1: After set time
		this.attackEnd = 1;

		this.sp = 3;
		this.targetX = targetX;
		this.targetY = targetY;

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
		if( this.attackEnd && ( this._start > this.level.timer || this.ended ) ) {
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
			const progress = Math.min( ( this.level.timer - this._start ) / 100, 1 );
			const alpha = progress * progress;
			const x = this.x + this.w * 0.5;

			ctx.fillStyle = `rgba(255,255,255,${alpha})`;
			ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
			ctx.lineWidth = Math.round( progress * progress * 30 );

			ctx.beginPath();
			ctx.moveTo( x, this.y );
			ctx.lineTo( x, this.y - js13k.Renderer.res * 0.7 );
			ctx.stroke();

			const r = ctx.lineWidth * 1.1;
			ctx.beginPath();
			ctx.ellipse( x, this.y - js13k.Renderer.res * 0.7, r, r, 0, 0, 360 );
			ctx.fill();
		}

		ctx.setTransform( js13k.Renderer.scale, 0, 0, js13k.Renderer.scale, 0, 0 );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		if( this._start > this.level.timer ) {
			return;
		}

		if( this.attackEnd === 1 && this.attackStarted ) {
			this.ended = ( this.level.timer - this._start ) > 180;
			return;
		}

		if( this.attackStart === 0 ) {
			this.attackStarted = ( this.level.timer - this._start ) > 30;
		}

		const center = this.getCenter();

		if( this.canMove ) {
			// Move to target position.
			const diffX = center.x - this.targetX;
			const diffY = center.y - this.targetY;

			if( this.attackStart === 1 ) {
				if(
					Math.abs( diffX ) < 1 &&
					Math.abs( diffY ) < 1
				) {
					this.attackStarted = true;
					return;
				}
			}

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
		}

		if( this.angleTarget === 1 ) {
			// Look in direction of player.
			// Calculate angle.
			//
			// What has been shortened:
			// ------------------------
			// const vec1 = [0, -1];
			// Math.atan2( vec1[1], vec1[0] );
			// -> -1.5707963267948966

			const playerCenter = this.level.player.getCenter();

			const [vec2, length] = js13k.normalize([
				playerCenter.x - center.x,
				playerCenter.y - center.y
			]);

			if( length > 4 ) {
				this.angle = Math.atan2( vec2[1], vec2[0] ) + 1.5707963267948966;
			}
		}
		else if( this.angleTarget === 2 ) {
			const [vec2, length] = js13k.normalize([
				this.targetX - center.x,
				this.targetY - center.y
			]);

			if( length > 4 ) {
				this.angle = Math.atan2( vec2[1], vec2[0] ) + 1.5707963267948966;
			}
		}
	}


}


DangerEye.W = 61;
DangerEye.H = 127;


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
