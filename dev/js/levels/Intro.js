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
			'WHAT, YOU DO MIND ME?',
			"THEN IT'S ON!"
		];
	}


	/**
	 *
	 */
	draw() {
		const ctx = js13k.Renderer.ctx;
		const res = js13k.Renderer.res;

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
			const center = js13k.Renderer.center;

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
			ctx.fillText( 'Press [space] to continue', center, center - 90 );

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
		}
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;

		this.player.x = js13k.Renderer.center - this.player.w * 0.5;
		this.player.y = js13k.Renderer.center - this.player.h * 0.5;

		if( this.timer * 0.01 >= 1 && this.phase < this.texts.length ) {
			this.border = Math.min( this.border + dt * 0.015, 0 );

			if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
				this.phase++;
			}

			this.text = this.texts[this.phase] || null;
		}
		else if( this.phase >= this.texts.length ) {
			this.progress += dt * 0.015;

			if( this.progress > 2 ) {
				js13k.Renderer.level = new js13k.Level.Eyes();
			}
		}
	}


}


js13k.Level.Intro = Level_Intro;

}
