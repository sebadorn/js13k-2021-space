'use strict';


{

class Level_Teeth extends js13k.Level {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		super();

		const res = js13k.Renderer.res;

		this.player = new js13k.Player( this );
		this.player.x = ( res - this.player.w ) * 0.5;
		this.player.y = ( res - this.player.h ) * 0.5;

		this.dangers.push(
			new js13k.LevelObject.SmallBite( this, 400, 100 )
		);

		[this.cnvHit, this.ctxHit] = js13k.Renderer.getOffscreenCanvas( this.player.w, this.player.h );


		// Border image decorations.
		const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( 90, js13k.Renderer.res + 114 );
		this._cnvBorder = canvas;

		let y = 0;

		while( y < js13k.Renderer.res ) {
			ctx.drawImage( js13k.Renderer.sprites.br_tooth, 0, y, 60, 32 );
			y += 38;
			ctx.drawImage( js13k.Renderer.sprites.br_tooth, 0, y, 30, 16 );
			y += 22;
			ctx.drawImage( js13k.Renderer.sprites.br_tooth, 0, y, 90, 48 );
			y += 54;
		}
	}


	/**
	 *
	 */
	draw() {
		super.draw();
	}


	/**
	 *
	 * @param  {CanvasRenderingContext2D} ctx
	 * @return {number}
	 */
	drawBorder( ctx ) {
		const border = super.drawBorder( ctx );
		const offsetX = Math.round( border + Math.sin( this.timer / 20 ) * 2 ) - 2.5;
		const s = js13k.Renderer.scale;

		// Left side.
		ctx.drawImage( this._cnvBorder, offsetX, -48 );

		// Right side.
		let x = js13k.Renderer.res - offsetX;

		// scale (global res) x +translate x scale (flip) x -translate
		ctx.setTransform( -s, 0, 0, s, 2 * s * x, 0 );
		ctx.drawImage( this._cnvBorder, js13k.Renderer.res - offsetX, 0 );

		// Bottom side.
		let sin = Math.sin( -Math.PI * 0.5 );
		let cos = Math.cos( -Math.PI * 0.5 );
		x = border;
		let y = js13k.Renderer.res - offsetX;

		// scale (global res) x +translate x rotate x -translate
		ctx.setTransform(
			s * cos, s * sin,
			-s * sin, s * cos,
			s * ( x + y * sin - x * cos ), s * ( y - y * cos - x * sin )
		);
		ctx.drawImage( this._cnvBorder, x, y );

		// Top side.
		sin = Math.sin( Math.PI * 0.5 );
		cos = Math.cos( Math.PI * 0.5 );
		x = js13k.Renderer.res - border;
		y = offsetX;

		// scale (global res) x +translate x rotate x -translate
		ctx.setTransform(
			s * cos, s * sin,
			-s * sin, s * cos,
			s * ( x + y * sin - x * cos ), s * ( y - y * cos - x * sin )
		);
		ctx.drawImage( this._cnvBorder, js13k.Renderer.res - border, offsetX );

		// reset
		ctx.setTransform( s, 0, 0, s, 0, 0 );

		return border;
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		super.update( dt );
	}


}


js13k.Level.Teeth = Level_Teeth;

}
