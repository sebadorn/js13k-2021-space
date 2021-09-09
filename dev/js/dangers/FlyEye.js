'use strict';


{

class FlyEye extends js13k.LevelObject {


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
		super( level, { x, y, w: FlyEye.W, h: FlyEye.H } );

		// Direction of movement.
		//  0: none
		//  1: up
		// -1: down
		this.dir = 0;

		this.sf = 0; // size factor
		this.sp = 3;
		this.targetX = targetX;
		this.targetY = targetY;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		if( this.ended || this._start > this.level.timer || this.sf === 0 ) {
			return;
		}

		const r = this.w * 0.5;

		ctx.lineWidth = 2;
		ctx.strokeStyle = '#FFF';

		if( this.sf !== 1 ) {
			ctx.translate( this.x, this.y );
			ctx.scale( this.sf, this.sf );
			ctx.translate( -this.x, -this.y );
		}

		const offsetX = Math.sin( this.level.timer / 20 ) * 4;
		const offsetY = 2 * this.dir;

		ctx.beginPath();
		ctx.ellipse( this.x, this.y, r, r, 0, 0, 360 );
		ctx.moveTo( this.x + offsetX, this.y - 5 + offsetY );
		ctx.lineTo( this.x + offsetX, this.y + 5 + offsetY );
		ctx.stroke();

		ctx.setTransform( js13k.Renderer.scale, 0, 0, js13k.Renderer.scale, 0, 0 );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		if( this.ended || this._start > this.level.timer ) {
			return;
		}

		if( this.sf < 1 ) {
			this.sf = Math.min( this.sf + dt * 0.05, 1 );
		}

		if( !this.canMove ) {
			return;
		}

		// Move to target position.
		const diffX = this.x - this.targetX;
		const diffY = this.y - this.targetY;

		this.dir = 0;

		if(
			Math.abs( diffX ) < 1 &&
			Math.abs( diffY ) < 1
		) {
			this.ended = true;
			return;
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

		this.dir = moveY > 0 ? 1 : -1;
		this.x += moveX;
		this.y += moveY;
	}


}


FlyEye.W = 24;
FlyEye.H = 24;


js13k.LevelObject.FlyEye = FlyEye;

}
