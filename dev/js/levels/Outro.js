'use strict';


{

class Level_Outro extends js13k.Level {


	/**
	 * Outro.
	 * @constructor
	 */
	constructor() {
		super();

		this.border = 360;
		this.progress = 0;
		this.progressBorder = 0;


		// Border image decorations.
		const res = js13k.Renderer.res;
		const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( 90, res + 114 );
		this._cnvBorder = canvas;

		let y = 0;

		while( y < res ) {
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

		const center = js13k.Renderer.center;
		const res = js13k.Renderer.res;
		const ctx = js13k.Renderer.ctx;

		ctx.font = 'bold 28px ' + js13k.FONT;
		ctx.textAlign = 'center';

		ctx.fillStyle = '#DDD';
		ctx.fillText( 'WELL, YOU WON TODAY.', center, center - 180 );
		ctx.fillText( 'THE HEADSPACE IS ALL YOURS.', center, center - 140 );
		ctx.fillText( 'SLEEP TIGHT THEN...', center, center - 100 );

		ctx.font = 'bold 20px ' + js13k.FONT;
		ctx.fillStyle = '#AAA';
		ctx.fillText( 'AND SEE YOU AGAIN.', center, res - 50 );

		if( this.progress <= 1 ) {
			js13k.Renderer.ctxUI.fillStyle = '#FFC800';
			js13k.Renderer.ctxUI.fillRect( 0, 0, res, res * ( 1 - Math.min( this.progress * this.progress, 1 ) ) );
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	drawBackground( ctx ) {
		ctx.globalAlpha = 0.3;

		const sprites = js13k.Renderer.sprites;
		const center = js13k.Renderer.center;

		let x = center - 45;
		let y = center - 45;
		ctx.drawImage( sprites.bg_eye_ball, x, y );

		if( !this.isBlinking ) {
			ctx.drawImage( sprites.bg_eye_blood, x, y );

			x = center - 10;
			y = center - 25;
			ctx.drawImage( sprites.bg_eye_iris, x, y );
		}
		else {
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#FFF';

			ctx.beginPath();
			ctx.moveTo( center - 40, center + 2 );
			ctx.lineTo( center + 40, center + 2 );
			ctx.stroke();
		}

		ctx.globalAlpha = 1;
	}


	/**
	 *
	 * @param  {CanvasRenderingContext2D} ctx
	 * @return {number}
	 */
	drawBorder( ctx ) {
		const res = js13k.Renderer.res;
		const s = js13k.Renderer.scale;
		const border = super.drawBorder( ctx );

		const offsetX = Math.round( border + Math.sin( this.timer / 20 ) * 2 ) - 2.5 - this.progressBorder * 50;
		let x = res - offsetX;

		// Left side.
		ctx.drawImage( this._cnvBorder, offsetX, -48 );

		// Right side.
		// scale (global res) x +translate x scale (flip) x -translate
		ctx.setTransform( -s, 0, 0, s, 2 * s * x, 0 );
		ctx.drawImage( this._cnvBorder, res - offsetX, 0 );

		// Bottom side.
		let sin = Math.sin( -Math.PI * 0.5 );
		let cos = Math.cos( -Math.PI * 0.5 );
		x = border;
		let y = res - offsetX;

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
		x = res - border;
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
		this.timer += dt;
		this.progress += dt * 0.015;

		if( this.progress >= 1 ) {
			this.border -= dt * 0.4;
			this.border = Math.max( this.border, -22 );

			if( this.border === -22 ) {
				this.progressBorder += dt * 0.02;
			}
		}

		this.isBlinking = ( this.timer + 100 ) % 400 < 5;
	}


}


js13k.Level.Outro = Level_Outro;

}
