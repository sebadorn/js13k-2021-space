'use strict';


{

class Level_Eyes extends js13k.Level {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		super();

		const width = js13k.Renderer.res;
		const height = js13k.Renderer.res;

		this.player = new js13k.Player( this );
		this.player.x = ( width - this.player.w ) / 2;
		this.player.y = ( height - this.player.h ) / 2;

		const DangerEye = js13k.LevelObject.DangerEye;

		this.phase1 = [
			new DangerEye( this, -DangerEye.W, 0 ),
			new DangerEye( this, width / 2 - DangerEye.W, 0 ),
			new DangerEye( this, width, 0 ),
			new DangerEye( this, width, height / 2 - DangerEye.H ),
			new DangerEye( this, width, height - DangerEye.H ),
			new DangerEye( this, width / 2 - DangerEye.W, height - DangerEye.H ),
			new DangerEye( this, -DangerEye.W, height - DangerEye.H ),
			new DangerEye( this, -DangerEye.W, height / 2 - DangerEye.H ),
			new DangerEye( this, -DangerEye.W, 0 ),
			new DangerEye( this, width / 2 - DangerEye.W, 0 ),
			new DangerEye( this, width, 0 ),
			new DangerEye( this, width, height / 2 - DangerEye.H ),
			new DangerEye( this, width, height - DangerEye.H ),
			new DangerEye( this, width / 2 - DangerEye.W, height - DangerEye.H ),
			new DangerEye( this, -DangerEye.W, height - DangerEye.H ),
			new DangerEye( this, -DangerEye.W, height / 2 - DangerEye.H )
		];

		this.phase2 = [
			// TODO:
		];

		[this.cnvHit, this.ctxHit] = js13k.Renderer.getOffscreenCanvas( this.player.w, this.player.h );
	}


	/**
	 *
	 */
	draw() {
		super.draw();

		if( !this.phase ) {
			const center = js13k.Renderer.centerX;
			const ctx = js13k.Renderer.ctx;
			ctx.fillStyle = '#FFF';
			ctx.textAlign = 'center';
			ctx.fillText( 'Avoid all attacks.', center, center - 100 );
			ctx.fillText( 'Press [SPACE] to continue.', center, center - 60 );
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	drawBackground( ctx ) {
		const centerX = js13k.Renderer.centerX;
		const centerY = js13k.Renderer.centerY;

		let x = centerX - 90;
		let y = centerY - 90;

		ctx.translate( x, y );
		ctx.scale( 2, 2 );
		ctx.translate( -x, -y );

		ctx.drawImage( js13k.Renderer.sprites.bg_eye_ball, x, y - 10 );

		ctx.setTransform(
			js13k.Renderer.scale, 0, 0,
			js13k.Renderer.scale, 0, 0
		);

		x = centerX - 15;
		y = centerY - 50;

		ctx.translate( x, y );
		ctx.scale( 2, 2 );
		ctx.translate( -x, -y );

		// Have the eye look in the direction of the player.
		const playerCenter = this.player.getCenter();

		const diff = js13k.normalize([
			centerX - playerCenter.x,
			centerY - playerCenter.y
		]);

		x += Math.sin( -diff[0] ) * 14;
		y += Math.sin( -diff[1] ) * 14 - 10;
		ctx.drawImage( js13k.Renderer.sprites.bg_eye_iris, x, y );

		ctx.setTransform(
			js13k.Renderer.scale, 0, 0,
			js13k.Renderer.scale, 0, 0
		);
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		super.update( dt );

		// Intro.
		if( !this.phase ) {
			if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
				this.phase = 1;
			}
		}
		// Next main phase.
		else if( this.phase === 1 ) {
			this.dangers = this.phase1.slice();
			js13k.shuffle( this.dangers );

			this.dangers.forEach( ( danger, i ) => {
				danger.targetX = js13k.Renderer.centerX + Math.random() * 200;
				danger.targetY = js13k.Renderer.centerY + Math.random() * 200;
				danger.start( i * 33 );
			} );

			this.phase = 2;
			this._end = this.timer + this.dangers.length * 33 + 100;
		}
		// Next main phase.
		else if( this.phase === 2 && this.timer > this._end ) {
			// TODO:
			this.phase = 3;
			this._end = this.timer + 200;
		}
		// Next main phase.
		else if( this.phase === 3 && this.timer > this._end ) {
			// TODO:
			this.phase = 4;
		}
	}


}


js13k.Level.Eyes = Level_Eyes;

}