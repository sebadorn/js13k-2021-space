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
		const center = js13k.Renderer.centerX;

		this.player = new js13k.Player( this );
		this.player.x = ( width - this.player.w ) * 0.5;
		this.player.y = ( height - this.player.h ) * 0.5;

		const FlyEye = js13k.LevelObject.FlyEye;
		const LaserEye = js13k.LevelObject.LaserEye;


		// Phase 1

		this.phase1 = [];

		for( let i = 0; i < 15; i++ ) {
			const isEven = i % 2;
			const x = isEven ? -LaserEye.H : width;
			const y = Math.round( i * LaserEye.W );
			const tx = isEven ? 0 : width;

			const d = new LaserEye( this, x, y, tx, y + Math.round( LaserEye.H * 0.5 ) );
			d.angle = isEven ? Math.PI * 0.5 : Math.PI * 1.5;

			this.phase1.push( d );
		}


		// Phase 2

		// From the left
		const d1 = new LaserEye( this, 0, center - LaserEye.H * 0.5, center + 30, center );
		d1.angle = Math.PI * 0.5;

		// From the top
		const d2 = new LaserEye( this, center - LaserEye.W * 0.5, 0, center, center + 30 );
		d2.angle = Math.PI;

		// From the right
		const d3 = new LaserEye( this, width, center - LaserEye.H * 0.5, center - 30, center );
		d3.angle = Math.PI * 1.5;

		// From the bottom
		const d4 = new LaserEye( this, center - LaserEye.W * 0.5, height, center, center - 30 );

		this.phase2 = [d1, d2, d3, d4];
		this.phase2.forEach( d => {
			d.attackEnd = 0;
			d.attackStart = 1;
		} );
		this.phase2.push(
			new FlyEye( this, center - 240, -32, center - 240, height + 32 ),
			new FlyEye( this, center - 100, -300, center - 100, height + 32 ),
			new FlyEye( this, center + 160, -100, center + 160, height + 32 ),
			new FlyEye( this, center + 240, -400, center + 240, height + 32 )
		);


		// Phase 3

		this.phase3 = [
			// TODO:
		];


		[this.cnvHit, this.ctxHit] = js13k.Renderer.getOffscreenCanvas( this.player.w, this.player.h );


		// Border image decorations.
		const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( 48, js13k.Renderer.res + 192 );
		this._cnvBorder = canvas;

		let y = 0;

		while( y < js13k.Renderer.res ) {
			ctx.drawImage( js13k.Renderer.sprites.br_eye, 0, y, 32, 64 );
			y += 64;
			ctx.drawImage( js13k.Renderer.sprites.br_eye, 0, y, 16, 32 );
			y += 32;
			ctx.drawImage( js13k.Renderer.sprites.br_eye, 0, y, 48, 96 );
			y += 96;
		}
	}


	/**
	 *
	 */
	draw() {
		super.draw();

		if( this.isGameOver ) {
			return;
		}

		const center = js13k.Renderer.centerX;
		const ctx = js13k.Renderer.ctx;
		ctx.font = 'bold 20px ' + js13k.FONT;
		ctx.fillStyle = '#FFF';
		ctx.textAlign = 'center';

		if( !this.phase ) {
			ctx.fillText( 'Avoid all attacks.', center, center - 100 );
			ctx.fillText( 'Press [SPACE] to continue.', center, center - 60 );
		}
		// TODO: text
		else if( this.phase === 3 ) {
			ctx.fillText( 'Text ID 3', center, center - 100 );
			ctx.fillText( 'Press [SPACE] to continue.', center, center - 60 );
		}
		// TODO: text
		else if( this.phase === 5 ) {
			ctx.fillText( 'Text ID 5', center, center - 100 );
			ctx.fillText( 'Press [SPACE] to continue.', center, center - 60 );
		}
		// TODO: text
		else if( this.phase === 7 ) {
			ctx.fillText( 'Text ID 7', center, center - 100 );
			ctx.fillText( 'Press [SPACE] to continue.', center, center - 60 );
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	drawBackground( ctx ) {
		const center = js13k.Renderer.centerX;
		const s = js13k.Renderer.scale;

		let x = center - 90;
		let y = center - 90;

		// scale (global res) x +translate x scale x -translate
		ctx.setTransform( 2 * s, 0, 0, 2 * s, -x * s, -y * s );
		ctx.drawImage( js13k.Renderer.sprites.bg_eye_ball, x, y - 10 );

		// Have the eye look in the direction of the player.
		const playerCenter = this.player.getCenter();

		const [diff, _length] = js13k.normalize([
			center - playerCenter.x,
			center - playerCenter.y
		]);

		x = center - 15 + Math.sin( -diff[0] ) * 14;
		y = center - 60 + Math.sin( -diff[1] ) * 14;

		ctx.setTransform( 2 * s, 0, 0, 2 * s, -x * s, -y * s );
		ctx.drawImage( js13k.Renderer.sprites.bg_eye_iris, x, y );

		ctx.setTransform( s, 0, 0, s, 0, 0 );
	}


	/**
	 *
	 * @param  {CanvasRenderingContext2D} ctx
	 * @return {number}
	 */
	drawBorder( ctx ) {
		const border = super.drawBorder( ctx );
		const offsetX = Math.round( border + Math.sin( this.timer / 20 ) * 4 ) - 4.2;
		const s = js13k.Renderer.scale;

		// Left side.
		ctx.drawImage( this._cnvBorder, offsetX, -96 );

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

		// Intro.
		if( !this.phase ) {
			if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
				// this.phase = 1;
				this.phase = 3; // TODO: remove
			}
		}
		// Next main phase.
		else if( this.phase === 1 ) {
			this.dangers = this.phase1;
			this.dangers.forEach( ( danger, i ) => danger.start( i * 33 ) );

			this.phase = 2;
			this._end = this.timer + this.dangers.length * 33 + 100;
		}
		// Some text to confirm between main phases.
		else if( this.phase === 2 && this.timer > this._end ) {
			this.dangers = [];
			this.phase = 3;
		}
		// Next main phase.
		else if( this.phase === 3 ) {
			if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
				this.dangers = this.phase2;
				this.dangers.forEach( ( danger, i ) => {
					// LaserEyes
					if( i < 4 ) {
						danger.start();
					}
					// FlyEyes
					else {
						danger.sf = 1;
						danger.start( 500 );
					}
				} );

				this.phase = 4;
				this._end = this.timer + 1000;
			}
		}
		// Eyes have reached the center. Start rotating.
		else if( this.phase === 4 && this.timer > this._end - 700 && this.timer <= this._end ) {
			const LaserEye = js13k.LevelObject.LaserEye;
			const center = js13k.Renderer.centerX;
			const adjust = [
				[-LaserEye.W * 0.5, -LaserEye.W * 0.5],
				[0, -LaserEye.H * 0.5],
				[LaserEye.W * 0.5, -LaserEye.W * 0.5],
				[0, 0]
			];

			// Switch direction after some time, but slower
			// then to make it not feel to unfair.
			const speed = ( this.timer / this._end ) < 0.7 ? 0.01 : -0.0075;

			this.dangers.forEach( ( danger, i ) => {
				// Rotate the LaserEyes.
				if( i < 4 ) {
					if( danger.canMove ) {
						danger._c = danger.getCenter();
					}

					danger.canMove = false;
					danger.angle = ( danger.angle + dt * speed ) % ( Math.PI * 2 );

					const cos = Math.cos( danger.angle );
					const sin = Math.sin( danger.angle );

					const dc = {
						x: danger._c.x + adjust[i][0],
						y: danger._c.y + adjust[i][1]
					};

					const newX = dc.x * cos - dc.y * sin + center * ( 1 + sin - cos );
					const newY = dc.x * sin + dc.y * cos + center * ( 1 - sin - cos );

					danger.x = newX - LaserEye.W * 0.5;
					danger.y = newY - LaserEye.H * 0.5;
				}
			} );
		}
		// Some text to confirm between main phases.
		else if( this.phase === 4 && this.timer > this._end ) {
			this.dangers = [];
			this.phase = 5;
		}
		// Next main phase.
		else if( this.phase === 5 ) {
			if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
				this.dangers = this.phase3;
				this.phase = 6;
				this._end = this.timer + 200;
			}
		}
		// Outro.
		else if( this.phase === 6 && this.timer > this._end ) {
			this.dangers = [];
			this.phase = 7;
		}

		// Border update.
		switch( this.phase ) {
			case 2:
				this.border += dt * 0.2;
				this.border = Math.min( this.border, 80 );
				break;

			case 4:
				this.border += dt * 0.2;
				this.border = Math.min( this.border, 200 );
				break;
		}
	}


}


js13k.Level.Eyes = Level_Eyes;

}
