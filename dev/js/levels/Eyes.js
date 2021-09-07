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

		const DangerEye = js13k.LevelObject.DangerEye;


		// Phase 1

		this.phase1 = [];

		for( let i = 0; i < 15; i++ ) {
			const isEven = i % 2;
			const x = isEven ? -DangerEye.H : width;
			const y = Math.round( i * DangerEye.W );
			const tx = isEven ? 0 : width;

			const d = new DangerEye( this, x, y, tx, y + Math.round( DangerEye.H * 0.5 ) );
			d.angle = isEven ? Math.PI * 0.5 : Math.PI * 1.5;

			this.phase1.push( d );
		}


		// Phase 2

		// From the left
		const d1 = new DangerEye( this, 0, center - DangerEye.H * 0.5, center + 30, center );
		d1.angle = Math.PI * 0.5;

		// From the top
		const d2 = new DangerEye( this, center - DangerEye.W * 0.5, 0, center, center + 30 );
		d2.angle = Math.PI;

		// From the right
		const d3 = new DangerEye( this, width, center - DangerEye.H * 0.5, center - 30, center );
		d3.angle = Math.PI * 1.5;

		// From the bottom
		const d4 = new DangerEye( this, center - DangerEye.W * 0.5, height, center, center - 30 );

		this.phase2 = [d1, d2, d3, d4];
		this.phase2.forEach( d => {
			d.attackEnd = 0;
			d.attackStart = 1;
		} );


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
		const offsetX = Math.round( border + Math.sin( this.timer / 20 ) * 4 ) - 4;

		// Left side.
		ctx.drawImage( this._cnvBorder, offsetX, -96 );

		// Right side.
		const x = js13k.Renderer.res - offsetX;
		const s = js13k.Renderer.scale;

		// scale (global res) x +translate x scale (flip) x -translate
		ctx.setTransform( -s, 0, 0, s, 2 * s * x, 0 );
		ctx.drawImage( this._cnvBorder, js13k.Renderer.res - offsetX, 0 );
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
				this.dangers.forEach( danger => danger.start() );

				this.phase = 4;
				this._end = this.timer + 800;
			}
		}
		// Eyes have reached the center. Start rotating.
		else if( this.phase === 4 && this.timer > this._end - 540 && this.timer <= this._end ) {
			// const DangerEye = js13k.LevelObject.DangerEye;

			this.dangers.forEach( danger => {
				danger.canMove = false;
				// TODO: rotation not working as intented
				// danger.x = danger.targetX - DangerEye.W * 0.5 + Math.sin( this.timer / 30 ) * 10;
				// danger.y = danger.targetY - DangerEye.H * 0.5 + Math.cos( this.timer / 30 ) * 10;
				danger.angle += dt * 0.01;
				danger.angle = danger.angle % ( Math.PI * 2 );
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
	}


}


js13k.Level.Eyes = Level_Eyes;

}
