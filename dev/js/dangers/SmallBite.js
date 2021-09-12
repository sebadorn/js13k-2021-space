'use strict';


{

class SmallBite extends js13k.LevelObject {


	/**
	 *
	 * @constructor
	 * @param {js13k.Level} level
	 */
	constructor( level ) {
		super( level, { w: 64, h: 32 } ); // height varies

		// Mode.
		// 0: Normal, just an attack.
		// 1: Short vulnerability phase at end of attack.
		this.mode = 0;

		this.cooldown = 30;
		this.show = true;
		this._tEnd = -1;

		if( !SmallBite.sprite ) {
			SmallBite.sprite = [
				SmallBite.preRender( this.w, this.h, 0, 0 ),
				SmallBite.preRender( this.w, this.h, 1, 0 ),
				SmallBite.preRender( this.w, this.h, 0, 1 ),
				SmallBite.preRender( this.w, this.h, 1, 1 )
			];
		}
	}


	/**
	 *
	 * @param {object}  target
	 * @param {number}  target.x
	 * @param {number}  target.y
	 * @param {number}  target.w
	 * @param {number}  target.h
	 * @param {number} [dir = 0]
	 */
	attack( target, dir = 0 ) {
		if( this.canAttack() ) {
			this.dir = dir;

			this._sound = null;
			this._t = target;
			this._tEnd = this.level.timer + 100;

			this.x = this._t.x - this.w * 0.5;
			this.y = this._t.y - this.h * 0.5;

			this.progress = -0.7;
		}
	}


	/**
	 *
	 * @return {boolean}
	 */
	canAttack() {
		return !this._t && this.level.timer - this._tEnd >= this.cooldown;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		if( !this._t || this.wasHit ) {
			return;
		}

		const pc = Math.max( this.progress, 0 );
		const offset = ( 1 - pc * pc * pc * pc ) * 100;

		const s = js13k.Renderer.scale;
		const x = this.x + this.w * 0.5;
		const y = this.y;

		if( this.dir === 0 ) {
			// Scale by 1.5.
			ctx.setTransform( 1.5 * s, 0, 0, 1.5 * s, x * s * -0.5, y * s * -0.5 );
		}
		else if( this.dir === 1 ) {
			// Scale by 1.5 and rotate sideways.
			ctx.translate( x, y );
			ctx.scale( 1.5, 1.5 );
			ctx.rotate( Math.PI * 0.5 );
			ctx.translate( -x, -y );
		}
		else if( this.dir === 2 ) {
			// Scale by 1.5 and rotate diagonally.
			ctx.translate( x, y );
			ctx.scale( 1.5, 1.5 );
			ctx.rotate( Math.PI * 0.25 );
			ctx.translate( -x, -y );
		}
		else if( this.dir === 3 ) {
			// Scale by 1.5 and rotate diagonally.
			ctx.translate( x, y );
			ctx.scale( 1.5, 1.5 );
			ctx.rotate( Math.PI * 0.75 );
			ctx.translate( -x, -y );
		}

		const indexOffset = ( this.mode && pc >= 1 ) ? 2 : 0;

		ctx.drawImage( SmallBite.sprite[0 + indexOffset], this.x, this.y - offset );
		ctx.drawImage( SmallBite.sprite[1 + indexOffset], this.x, this.y + offset );

		ctx.setTransform( s, 0, 0, s, 0, 0 );
	}


	/**
	 *
	 * @return {boolean}
	 */
	isVulnerable() {
		return (
			this.mode &&
			this._t &&
			!this.wasHit &&
			this.progress >= 1
		);
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		if( !this._t ) {
			return;
		}

		if( !this._sound && this._tEnd < this.level.timer + 65 ) {
			this._sound = js13k.Audio.playFreq( 65.41, 0.1 );
		}

		if( this._tEnd < this.level.timer ) {
			this._t = null;
		}
		else {
			this.progress = Math.min( this.progress + dt * 0.05, 1 );
		}
	}


}


/**
 *
 * @param  {number} w
 * @param  {number} h
 * @param  {number} pos  - 0: top row, 1: bottom row
 * @param  {number} mode
 * @return {HTMLCanvasElement}
 */
SmallBite.preRender = function( w, h, pos, mode ) {
	const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( w, h );
	const [scaleY, transY] = pos === 1 ? [-1, h] : [1, 0];
	const key = mode ? 'vuln_bite_small' : 'bite_small';

	// left
	ctx.setTransform( -1, 0, 0, scaleY, w / 2, transY );
	ctx.drawImage(
		js13k.Renderer.sprites[key],
		0, 0, w / 2, h,
		0, 0, w / 2, h
	);

	// right
	ctx.setTransform( 1, 0, 0, scaleY, 0, transY );
	ctx.drawImage(
		js13k.Renderer.sprites[key],
		0,     0, w / 2, h,
		w / 2, 0, w / 2, h
	);

	ctx.setTransform( 1, 0, 0, 1, 0, 0 );

	return canvas;
};


js13k.LevelObject.SmallBite = SmallBite;

}
