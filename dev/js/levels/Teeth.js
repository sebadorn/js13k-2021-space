'use strict';


{

class Level_Teeth extends js13k.Level {


	/**
	 *
	 * @constructor
	 */
	constructor( playerHP ) {
		super();

		this._start = 0;
		this._end = Infinity;

		this.bossHits = 0;

		const res = js13k.Renderer.res;

		this.player = new js13k.Player( this );
		this.player.hp = playerHP || this.player.hp;
		this.player.x = ( res - this.player.w ) * 0.5;
		this.player.y = ( res - this.player.h ) * 0.5;


		this.phase1 = [
			new js13k.LevelObject.SmallBite( this ),
			new js13k.LevelObject.FangBoss( this )
		];


		[this.cnvHit, this.ctxHit] = js13k.Renderer.getOffscreenCanvas( this.player.w, this.player.h );


		// Border image decorations.
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
		if( this.isGameOver ) {
			this.drawGameOver( js13k.Renderer.ctx );
			return;
		}

		this.drawBackground( js13k.Renderer.ctx );
		this.dangers.forEach( danger => danger.draw( js13k.Renderer.ctxDanger ) );
		this.drawBorder( js13k.Renderer.ctxDanger );

		if( this.player ) {
			this.player.draw( js13k.Renderer.ctx );
			this.drawHP( js13k.Renderer.ctxUI );
		}

		const center = js13k.Renderer.center;
		const ctx = js13k.Renderer.ctx;
		ctx.font = 'bold 20px ' + js13k.FONT;
		ctx.fillStyle = '#FFF';
		ctx.textAlign = 'center';

		if( !this.phase ) {
			ctx.fillText( 'Avoid all attacks.', center, center - 100 );
			ctx.fillText( 'Press [SPACE] to continue.', center, center - 60 );
		}
		else if( this.phase === 2 && this._end <= this.timer ) {
			ctx.fillText( 'Avoid all attacks.', center, center - 100 );
			ctx.fillText( 'Press [SPACE] to continue.', center, center - 60 );
		}
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

		let x = js13k.Renderer.res - offsetX;

		// Left side.
		ctx.drawImage( this._cnvBorder, offsetX, -48 );

		// Right side.
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
				this.phase = 1;
				this.phase = 2; // TODO: remove
				this._end = -1; // TODO: remove
				this.dangers = this.phase1;
				this._start = this.timer;
			}
		}
		// Wait.
		else if( this.phase === 1 && this._start + 100 < this.timer ) {
			this.phase = 2;
			this._end = this.timer + 1000;
		}
		// Next main phase.
		else if( this.phase === 2 && this._end > this.timer ) {
			if( this.dangers[0].canAttack() ) {
				const pc = this.player.getCenter();
				const dirs = js13k.shuffle( [0, 1, 2, 3] );

				this.dangers[0].attack( pc, dirs[0] );
			}
		}
		// Confirm to start next phase.
		else if( this.phase === 2 ) {
			if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
				this.phase = 3;
				this._start = this.timer;

				this.player.canAttack = true;

				this.dangers[0].cooldown = 200;
				this.dangers[0].mode = 1;

				this.dangers[1].show = true;
			}
		}
		// Next main phase / boss fight.
		else if( this.phase === 3 ) {
			if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
				this.player.attack();
			}

			// Check if player hits a target.
			if( this.player.isAttacking() ) {
				const playerCircle = this.player.getCenter();
				playerCircle.r = this.player.r;

				const danger = this.dangers[0];
				const dangerCenter = danger.getCenter();
				dangerCenter.r = danger.w * 0.5;

				if(
					danger.isVulnerable() &&
					js13k.circleOverlap( playerCircle, dangerCenter )
				) {
					danger.wasHit = true;
					this.bossHits++;

					js13k.Renderer.shake( 10, 2 );

					if( this.bossHits >= 3 ) {
						this.phase = 4;
						this._end = this.timer + 300;
					}
				}
			}

			if(
				this.phase === 3 &&
				this.dangers[0].canAttack() &&
				this._start + 140 < this.timer // Wait a bit with first attack.
			) {
				this.dangers[0].wasHit = false;

				const pc = this.player.getCenter();
				this.dangers[0].attack( pc, 0 );
			}
		}
		// Outro.
		else if( this.phase === 4 && this._end > this.timer ) {
			this.dangers = [];

			// Really hacky way to do a longer fullscreen attack radius.
			this.player.vuln = false;
			this.player.attDur = 800;
			this.player.rFull = js13k.Renderer.res;
			this.player.attack();
			this.player.onCooldown = () => true;
		}
		// Next.
		else if( this.phase === 4 ) {
			js13k.Renderer.level = new js13k.Level.Outro( this.border );
		}

		// Border update.
		switch( this.phase ) {
			case 1:
			case 2:
				this.border += dt * 0.15;
				this.border = Math.min( this.border, 120 );
				break;

			case 3:
			case 4:
				this.border += dt * 0.2;
				this.border = Math.max( Math.min( this.border, 220 ), 120 );
				break;
		}
	}


}


js13k.Level.Teeth = Level_Teeth;

}
