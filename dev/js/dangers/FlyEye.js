'use strict';


{

class FlyEye extends js13k.LevelObject {


	/**
	 *
	 * @constructor
	 * @param {js13k.Level} level
	 * @param {number}      x
	 * @param {number}      y
	 * @param {number}     [moveX = 0]
	 * @param {number}     [moveY = 1.5]
	 */
	constructor( level, x, y, moveX = 0, moveY = 1.5 ) {
		super( level, { x, y, w: FlyEye.W, h: FlyEye.H } );

		this.moveX = moveX;
		this.moveY = moveY;

		const center = js13k.Renderer.center;

		// Try to prevent the FlyEye from
		// not crossing the main area.
		if(
			this.x < center && this.moveX < 0 ||
			this.x > center && this.moveX > 0
		) {
			this.moveX *= -1;
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		if( this.ended || this._start > this.level.timer ) {
			return;
		}

		if( !this.isInDrawArea() ) {
			return;
		}

		ctx.drawImage(
			js13k.Renderer.sprites.flyeye,
			Math.round( this.x - this.w * 0.5 ),
			Math.round( this.y - this.h * 0.5 )
		);

		const offsetX = Math.sin( this.level.timer / 25 ) * 3;
		const x = Math.round( this.x + offsetX );
		const y = Math.round( this.y );

		ctx.lineCap = 'round';
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#FFF';
		ctx.beginPath();
		ctx.moveTo( x, y - 2 );
		ctx.lineTo( x, y + 6 );
		ctx.stroke();
	}


	/**
	 *
	 * @return {boolean}
	 */
	isInDrawArea() {
		const res = js13k.Renderer.res;
		const wHalf = this.w * 0.5;
		const hHalf = this.h * 0.5;

		return (
			this.x < res &&
			this.x + wHalf > 0 &&
			this.y < res &&
			this.y + hHalf > 0
		);
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		if( this.ended || this._start > this.level.timer ) {
			return;
		}

		if( !this.canMove ) {
			return;
		}

		this.x += this.moveX * dt;
		this.y += this.moveY * dt;
	}


}


FlyEye.W = 24;
FlyEye.H = 24;


js13k.LevelObject.FlyEye = FlyEye;

}
