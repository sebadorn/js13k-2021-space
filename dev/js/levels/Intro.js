'use strict';


{

class Level_Intro extends js13k.Level {


	/**
	 * Intro.
	 * @constructor
	 */
	constructor() {
		super();

		this.border = -18;
		this.phase = 0;
		this.player = new js13k.Player( this );
		this.progress = 0;

		this.texts = [
			'WANTED TO SLEEP?\nOH, SORRY ABOUT THAT.',
			"I'M YOUR FEARS.\nBIG FAN OF YOURS.",
			'YOUR MENTAL SPACE LOOKED\nKIND OF COZY LATELY.',
			"DON'T MIND ME.",
			'WHAT, YOU DO MIND ME?!',
			"THEN IT'S ON!"
		];
	}


	/**
	 *
	 */
	draw() {
		const ctx = js13k.Renderer.ctx;
		const res = js13k.Renderer.res;
		const center = js13k.Renderer.center;

		this.drawBackground( ctx );
		this.drawBorder( ctx );
		this.player.draw( ctx );

		const f = this.timer * 0.01;
		const alpha = 1 - Math.min( f * f, 1 );

		if( alpha > 0 ) {
			ctx.fillStyle = `rgba(0,0,0,${alpha})`;
			ctx.fillRect( 0, 0, res, res );

			return;
		}

		if( this.text ) {
			ctx.textAlign = 'center';
			ctx.font = 'bold 36px ' + js13k.FONT;

			const lines = this.text.split( '\n' );
			let y = center - 104 - lines.length * 36;

			lines.forEach( line => {
				ctx.fillStyle = '#DDD';
				ctx.fillText( line, center, y - 2 );
				ctx.fillStyle = '#3C7793';
				ctx.fillText( line, center, y );

				y += 36;
			} );

			ctx.fillStyle = '#AAA';
			ctx.font = 'bold 18px ' + js13k.FONT;
			ctx.globalAlpha = js13k.getTextAlpha( this.timer );
			ctx.fillText( 'Press [space] to continue', center, center - 90 );
			ctx.globalAlpha = 1;

			ctx.fillStyle = '#FFC800';

			if( this.phase === 1 || this.phase === 2 ) {
				ctx.fillText( '<- you', center + 60, center + 10 );
			}
			else if( this.phase === 4 ) {
				ctx.fillText( '!', center + 14, center - 4 );
			}
		}

		if( this.phase >= this.texts.length ) {
			ctx.fillStyle = '#3C7793';
			ctx.fillRect( 0, 0, res, res * Math.min( this.progress * this.progress, 1 ) );

			if( this.progress >= 1 && this.progress <= 4 ) {
				const progress = ( this.progress - 1 ) / 3;

				ctx.font = 'bold 64px ' + js13k.FONT;
				ctx.fillStyle = '#000';
				ctx.globalAlpha = 1 - progress;
				ctx.fillText( 'NESTLING FEARS', center, center - 32 );
				ctx.globalAlpha = 1;
			}
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
		let y = center - 45 - 290;
		ctx.drawImage( sprites.bg_eye_ball, x, y );

		if( !this.isBlinking ) {
			ctx.drawImage( sprites.bg_eye_blood, x, y );

			x = center - 10;
			y = center - 12 - 290;

			if( this.phase === 1 || this.phase === 4 ) {
				y -= 10;
			}

			ctx.drawImage( sprites.bg_eye_iris, x, y );
		}
		else {
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#FFF';

			ctx.beginPath();
			ctx.moveTo( center - 40, center + 2 - 290 );
			ctx.lineTo( center + 40, center + 2 - 290 );
			ctx.stroke();
		}

		ctx.globalAlpha = 1;
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;
		this.isBlinking = ( this.timer + 100 ) % 400 < 5;

		this.player.x = js13k.Renderer.center - this.player.w * 0.5;
		this.player.y = js13k.Renderer.center - this.player.h * 0.5;

		if( this.timer * 0.01 >= 1 && this.phase < this.texts.length ) {
			this.border = Math.min( this.border + dt * 0.02, 0 );

			if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
				this.phase++;
			}

			this.text = this.texts[this.phase] || null;
		}
		else if( this.phase >= this.texts.length ) {
			this.progress += dt * 0.015;

			if( this.progress > 4 ) {
				js13k.Renderer.level = new js13k.Level.Eyes();
			}
		}
	}


}


js13k.Level.Intro = Level_Intro;

}
