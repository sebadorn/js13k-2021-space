'use strict';


{

class TurretEye extends js13k.LevelObject {


	/**
	 *
	 * @constructor
	 * @param {js13k.Level} level
	 * @param {number}      x
	 * @param {number}      y
	 */
	constructor( level, x, y ) {
		super( level, { x, y, w: TurretEye.W, h: TurretEye.H } );

		this.x -= this.w * 0.5;
		this.y -= this.h * 0.5;
		this.show = false;
		this._tEnd = -1;
	}


	/**
	 *
	 * @param {object} target
	 * @param {number} target.x
	 * @param {number} target.y
	 * @param {number} target.w
	 * @param {number} target.h
	 */
	attack( target ) {
		if( this.show && !this.ended && !this._t && !this.isVulnerable() ) {
			this._t = target;
			this._tEnd = this.level.timer + 200;
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		if( !this.show || this.ended ) {
			return;
		}

		ctx.globalAlpha = ( this._t || this.isVulnerable() ) ? 1 : 0.4;

		let x = this.x;
		let y = this.y;

		const sprites = js13k.Renderer.sprites;
		const imgBall = this.isVulnerable() ? sprites.vuln_ball : sprites.bg_eye_ball;
		const imgBlood = this.isVulnerable() ? sprites.vuln_blood : sprites.bg_eye_blood;
		const imgIris = this.isVulnerable() ? sprites.vuln_iris : sprites.bg_eye_iris;

		ctx.drawImage( imgBall, x, y );
		ctx.drawImage( imgBlood, x, y );

		let targetCenter = null;

		// Have the eye look in the direction of the player or target.
		if( this._t ) {
			targetCenter = {
				x: this._t.x + this._t.w * 0.5,
				y: this._t.y + this._t.h * 0.5
			};
		}
		else {
			targetCenter = this.level.player.getCenter();
		}

		const [diff, _length] = js13k.normalize([
			x - targetCenter.x,
			y - targetCenter.y
		]);

		x += this.w * 0.5 - 10 + Math.sin( -diff[0] ) * 12;
		y += this.h * 0.5 - 25 + Math.sin( -diff[1] ) * 9;

		ctx.drawImage( imgIris, x, y );

		ctx.globalAlpha = 1;

		if( this._t && this._tEnd - 160 < this.level.timer ) {
			x += 10;
			y += 25;

			ctx.lineCap = 'round';
			ctx.lineWidth = 20;
			ctx.fillStyle = '#FFF';
			ctx.strokeStyle = '#FFF';

			const [vec, _length] = js13k.normalize( [
				targetCenter.x - x,
				targetCenter.y - y
			] );

			ctx.beginPath();
			ctx.moveTo( x, y );
			ctx.lineTo( x + vec[0] * 1000, y + vec[1] * 1000 );
			ctx.stroke();

			if( !this._sound ) {
				this._sound = js13k.Audio.play( js13k.Audio.SOUND.NOISE, 0.3, 0.5 );
			}
		}
	}


	/**
	 *
	 * @return {boolean}
	 */
	isVulnerable() {
		return (
			this._tEnd > 0 &&
			this._tEnd <= this.level.timer &&
			this._tEnd + 200 >= this.level.timer
		);
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		if( this._tEnd <= this.level.timer ) {
			this._t = null;
			this._sound = null;
		}
	}


}


TurretEye.W = 89;
TurretEye.H = 90;


js13k.LevelObject.TurretEye = TurretEye;

}
