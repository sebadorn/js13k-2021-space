'use strict';


{

class Player extends js13k.LevelObject {


	/**
	 *
	 * @constructor
	 * @param {js13k.Level} level
	 * @param {number}      x
	 * @param {number}      y
	 */
	constructor( level, x, y ) {
		super( level, { x, y, w: 32, h: 32 } );

		this._attStart = 0;
		this.attDur = 100;
		this.canAttack = false;
		this.hit = 0;
		this.hp = 3; // hit points
		this.r = 0; // current attack radius
		this.rFull = 55;
		this.sp = 6; // movement speed

		if( !Player.sprite ) {
			Player.sprite = [
				Player.preRender( this.w, this.h, 0 ),
				Player.preRender( this.w, this.h, this.w )
			];
		}
	}


	/**
	 * Trigger an attack.
	 */
	attack() {
		if( !this.onCooldown() ) {
			this._attStart = this.level.timer;
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		if( this.rFull === js13k.Renderer.res ) {
			ctx = js13k.Renderer.ctxUI;
		}

		// Light circle
		const hitbox = this.getHitbox();
		const centerX = Math.round( hitbox[0] + hitbox[2] * 0.5 );
		const centerY = Math.round( hitbox[1] + hitbox[3] * 0.5 );

		const [alpha, r1, r2] = this.flicker ? [0.007, 110, 45] : [0.01, 120, 55];
		ctx.fillStyle = `rgba(255,255,196,${alpha})`;

		ctx.beginPath();
		ctx.ellipse( centerX, centerY, r1, r1, 0, 0, 360 );
		ctx.fill();

		ctx.beginPath();
		ctx.ellipse( centerX, centerY, r2, r2, 0, 0, 360 );
		ctx.fill();

		if( this.canAttack ) {
			if( this.rFull === js13k.Renderer.res ) {
				ctx.fillStyle = '#FFC800';
			}
			else {
				ctx.fillStyle = '#FFC8003F';
			}

			ctx.lineWidth = 1;
			ctx.strokeStyle = '#FFC8003F';
			ctx.beginPath();

			// Show current attack.
			if( this.onCooldown() ) {
				this.r = this.rFull * Math.min( 20 * ( this.level.timer - this._attStart ) / this.attDur, 1 );
				ctx.ellipse( centerX, centerY, this.r, this.r, 0, 0, 360 );
				ctx.fill();
			}
			// Show possible attack area.
			else {
				ctx.ellipse( centerX, centerY, this.rFull, this.rFull, 0, 0, 360 );
				ctx.stroke();
			}
		}

		// Flicker if hit
		if(
			this.hit - this.level.timer <= 0 ||
			this.level.timer % 30 < 15
		) {
			// Sprite
			const frame = this.level.timer % 20 < 10 ? 0 : 1;
			ctx.drawImage( Player.sprite[frame], this.x, this.y );
		}
	}


	/**
	 *
	 * @param  {boolean} [round = false]
	 * @return {object}
	 */
	getCenter( round ) {
		const hb = this.getHitbox();
		let x = hb[0] + hb[2] * 0.5;
		let y = hb[1] + hb[3] * 0.5;

		if( round ) {
			x = Math.round( x );
			y = Math.round( y );
		}

		return { x, y };
	}


	/**
	 *
	 * @return {number[]} global x, global y, width, height
	 */
	getHitbox() {
		return [this.x + 9, this.y + 15, 12, 12];
	}


	/**
	 *
	 * @return {boolean}
	 */
	isAttacking() {
		return this._attStart > 0 && this.onCooldown();
	}


	/**
	 *
	 * @return {boolean}
	 */
	onCooldown() {
		return this.level.timer - this._attStart <= 40;
	}


	/**
	 *
	 * @param {number} dt
	 * @param {object} dir
	 * @param {number} dir.x
	 * @param {number} dir.y
	 */
	update( dt, dir ) {
		if( !this.isAttacking() ) {
			this.x += Math.round( dt * dir.x * this.sp );
			this.y += Math.round( dt * dir.y * this.sp );
		}

		// Confine to area.
		this.x = Math.min( js13k.Renderer.res - this.w, Math.max( 0, this.x ) );
		this.y = Math.min( js13k.Renderer.res - this.h, Math.max( 0, this.y ) );

		if( this.flicker > 0 ) {
			this.flicker -= dt;
		}
		else if( this.flicker < 0 ) {
			this.flicker = 0;
		}
		else if( Math.random() < 0.008 ) {
			this.flicker = dt * 16;
		}
	}


}


/**
 *
 * @param  {number} w
 * @param  {number} h
 * @param  {number} offsetX
 * @return {HTMLCanvasElement}
 */
Player.preRender = function( w, h, offsetX ) {
	const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( w, h );

	ctx.drawImage(
		js13k.Renderer.sprites.player,
		offsetX, 0, w, h,
		0, 0, w, h
	);

	return canvas;
};


js13k.Player = Player;

}
