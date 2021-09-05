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

		this.dangers.push(
			new js13k.LevelObject.DangerEye( this, 0, 0 ),
			new js13k.LevelObject.DangerEye( this, width, 0 ),
			new js13k.LevelObject.DangerEye( this, width, height ),
			new js13k.LevelObject.DangerEye( this, 0, height )
		);

		const de = this.dangers[0];
		this.dangers[0].x -= de.w;
		this.dangers[3].x -= de.w;
		this.dangers[2].y -= de.h;
		this.dangers[3].y -= de.h;

		[this.cnvHit, this.ctxHit] = js13k.Renderer.getOffscreenCanvas( this.player.w, this.player.h );
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

		if( !this.started && this.timer > dt * 120 ) {
			this.dangers.forEach( danger => danger.start() );
			this.started = true;
		}
	}


}


js13k.Level.Eyes = Level_Eyes;

}
