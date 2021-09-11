'use strict';


{

class Level_Eyes extends js13k.Level {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		super();

		this.progress = 0;
		this._won = false;

		const res = js13k.Renderer.res;
		const center = js13k.Renderer.center;

		this.player = new js13k.Player( this );
		this.player.x = ( res - this.player.w ) * 0.5;
		this.player.y = ( res - this.player.h ) * 0.5;

		const FlyEye = js13k.LevelObject.FlyEye;
		const LaserEye = js13k.LevelObject.LaserEye;
		const TurretEye = js13k.LevelObject.TurretEye;


		// Phase 1

		this.phase1 = [];

		for( let i = 0; i < 15; i++ ) {
			const isEven = i % 2;
			const x = isEven ? -LaserEye.H : res + LaserEye.H * 0.5;
			const y = Math.round( i * LaserEye.W );
			const tx = isEven ? 20 : res - 20;

			const d = new LaserEye( this, x, y, tx, y + Math.round( LaserEye.H * 0.5 ) );
			d.angle = isEven ? Math.PI * 0.5 : Math.PI * 1.5;
			d.endTargetX = isEven ? res + 100 : -100;
			d.endTargetY = d.targetY;

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
		const d3 = new LaserEye( this, res, center - LaserEye.H * 0.5, center - 30, center );
		d3.angle = Math.PI * 1.5;

		// From the bottom
		const d4 = new LaserEye( this, center - LaserEye.W * 0.5, res, center, center - 30 );

		this.phase2 = [d1, d2, d3, d4];
		this.phase2.forEach( d => {
			d.attackEnd = 0;
			d.attackStart = 1;
		} );

		const getRndX = () => 200 + Math.random() * ( res - 400 );
		const getRndMoveX = () => ( Math.random() * 2 - 1 ) * 0.7;
		let y = -32;

		this.phase2.push(
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),

			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),

			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),

			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() ),
			new FlyEye( this, getRndX(), y, getRndMoveX() )
		);


		// Phase 3

		this.phase3 = [
			new TurretEye( this, center - 180, center - 180 ),
			new TurretEye( this, center + 180, center - 180 ),
			new TurretEye( this, center + 180, center + 180 ),
			new TurretEye( this, center - 180, center + 180 )
		];


		[this.cnvHit, this.ctxHit] = js13k.Renderer.getOffscreenCanvas( this.player.w, this.player.h );


		// Border image decorations.
		const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( 48, js13k.Renderer.res + 192 );
		this._cnvBorder = canvas;

		y = 0;

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

		const center = js13k.Renderer.center;
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

		if( !this.phase ) {
			const res = js13k.Renderer.res;

			ctx.fillStyle = '#3C7793';
			ctx.fillRect( 0, 0, res, res * ( 1 - Math.min( this.progress * this.progress, 1 ) ) );
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	drawBackground( ctx ) {
		const sprites = js13k.Renderer.sprites;
		let imgBall = sprites.bg_eye_ball;
		let imgBlood = sprites.bg_eye_blood;
		let imgIris = sprites.bg_eye_iris;

		// Move to foreground in final phase
		// where contact can cause damage.
		if( this.phase === 6 && !this._won ) {
			ctx = js13k.Renderer.ctxDanger;
			ctx.globalAlpha = this._alpha;
		}
		// Indicate the boss eye can be damaged.
		else if( this.phase === 6 && this._won ) {
			ctx.globalAlpha = 1;
			imgBall = sprites.vuln_ball;
			imgBlood = sprites.vuln_blood;
			imgIris = sprites.vuln_iris;
		}
		else {
			ctx.globalAlpha = 0.1;
		}

		const center = js13k.Renderer.center;
		const s = js13k.Renderer.scale;

		let x = center - 90;
		let y = center - 90;

		// scale (global res) x +translate x scale x -translate
		ctx.setTransform( 2 * s, 0, 0, 2 * s, -x * s, -y * s );
		ctx.drawImage( imgBall, x, y );
		ctx.drawImage( imgBlood, x, y );

		// Have the eye look in the direction of the player.
		const playerCenter = this.player.getCenter();

		const [diff, _length] = js13k.normalize([
			center - playerCenter.x,
			center - playerCenter.y
		]);

		x = center - 15 + Math.sin( -diff[0] ) * 24;
		y = center - 50 + Math.sin( -diff[1] ) * 14;

		ctx.setTransform( 2 * s, 0, 0, 2 * s, -x * s, -y * s );
		ctx.drawImage( imgIris, x, y );

		ctx.setTransform( s, 0, 0, s, 0, 0 );
		ctx.globalAlpha = 1;
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
			this.progress += dt * 0.015;

			if( this.progress > 1 ) {
				if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
					this.phase = 1;
				}
			}
		}
		// Next main phase.
		else if( this.phase === 1 ) {
			this.dangers = this.phase1;
			this.dangers.forEach( ( danger, i ) => danger.start( i * 33 ) );

			this.phase = 2;
			this._end = this.timer + this.dangers.length * 33 + 400;
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
						danger.start( 20 + i * 45 );
					}
				} );

				this.phase = 4;
				this._end = this.timer + 1800;
			}
		}
		// Eyes have reached the center. Start rotating.
		else if( this.phase === 4 && this.timer > this._end - 1600 && this.timer <= this._end ) {
			const LaserEye = js13k.LevelObject.LaserEye;
			const center = js13k.Renderer.center;
			const adjust = [
				[-LaserEye.W * 0.5, -LaserEye.W * 0.5],
				[0, -LaserEye.H * 0.5],
				[LaserEye.W * 0.5, -LaserEye.W * 0.5],
				[0, 0]
			];

			// Switch direction after some time, but slower
			// then to make it not feel to unfair.
			let speed = this.timer > this._end - 700 ? -0.015 : 0.015;

			if( this._end - this.timer < 710 && this._end - this.timer > 680 ) {
				speed = 0;
			}

			if( this.timer > this._end - 300 ) {
				const angle = ( this.dangers[0].angle + Math.PI * 2 ) % ( Math.PI * 2 );
				const angleDiff = Math.abs( angle - Math.PI * 0.5 );

				if( angleDiff < 0.01 && !this.dangers[0].canMove ) {
					this.dangers.forEach( danger => {
						danger.ended = true;
						danger.canMove = true;
					} );

					const res = js13k.Renderer.res;

					this.dangers[0].x = this.dangers[0].targetX - LaserEye.W * 0.5;
					this.dangers[0].y = this.dangers[0].targetY - LaserEye.H * 0.5;
					this.dangers[0].angle = Math.PI * 0.5;
					this.dangers[0].endTargetX = res + 100;
					this.dangers[0].endTargetY = center;
					this.dangers[0].targetY = center;

					this.dangers[1].x = this.dangers[1].targetX - LaserEye.W * 0.5;
					this.dangers[1].y = this.dangers[1].targetY - LaserEye.H * 0.5;
					this.dangers[1].angle = Math.PI;
					this.dangers[1].endTargetX = center;
					this.dangers[1].endTargetY = res + 100;
					this.dangers[1].targetX = center;

					this.dangers[2].x = this.dangers[2].targetX - LaserEye.W * 0.5;
					this.dangers[2].y = this.dangers[2].targetY - LaserEye.H * 0.5;
					this.dangers[2].angle = Math.PI * 1.5;
					this.dangers[2].endTargetX = -100;
					this.dangers[2].endTargetY = center;
					this.dangers[2].targetY = center;

					this.dangers[3].x = this.dangers[3].targetX - LaserEye.W * 0.5;
					this.dangers[3].y = this.dangers[3].targetY - LaserEye.H * 0.5;
					this.dangers[3].angle = 0;
					this.dangers[3].endTargetX = center;
					this.dangers[3].endTargetY = -100;
					this.dangers[3].targetX = center;
				}
			}

			this.dangers.forEach( ( danger, i ) => {
				// Rotate the LaserEyes.
				if( i < 4 && !danger.ended ) {
					if( danger.canMove ) {
						danger._c = danger.getCenter();
					}

					danger.attackStarted = true;
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
				this.player.canAttack = true;

				this._alpha = 0.1;
				this._start = this.timer;
				this._start2 = this.timer;

				js13k.Renderer.shake( 200, 1 );
			}
		}
		// Updates for the phase.
		else if( this.phase === 6 && !this._won ) {
			if( this.timer - this._start < 200 ) {
				this._alpha = Math.max( Math.min( ( this.timer - this._start ) / 200, 1 ), 0.1 );
			}
			else {
				this.dangers[0].show = true;

				if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
					this.player.attack();
				}

				// Check if player hits a target.
				if( this.player.isAttacking() ) {
					const playerCircle = this.player.getCenter();
					playerCircle.r = this.player.r * 0.9;

					for( let i = 0; i < this.dangers.length; i++ ) {
						const danger = this.dangers[i];
						const dangerCenter = danger.getCenter();
						dangerCenter.r = danger.w * 0.5;

						if(
							danger.show &&
							!danger.ended &&
							danger.isVulnerable() &&
							js13k.circleOverlap( playerCircle, dangerCenter )
						) {
							danger.ended = this.timer;
							this._start2 = this.timer;

							js13k.Renderer.shake( 10, 2 );

							// All targets destroyed.
							if( i === this.dangers.length - 1 ) {
								this._won = true;
							}
							// Show next target.
							else {
								this.dangers[i + 1].show = true;
							}

							break;
						}
					}
				}

				const hb = this.player.getHitbox();
				const target = {
					x: hb[0],
					y: hb[1],
					w: hb[2],
					h: hb[3]
				};

				// Wait with the first attack.
				if( this.timer - this._start2 > 300 ) {
					this.dangers.forEach( danger => {
						danger.attack( target );
					} );
				}
			}
		}
		// Outro.
		else if( this.phase === 6 && this._won ) {
			this.dangers = [];
			this.player.canAttack = true;

			if( js13k.Input.isPressed( js13k.Input.ACTION.DO, true ) ) {
				// Really hacky way to do a longer fullscreen attack radius.
				this.player.vuln = false;
				this.player.attDur = 800;
				this.player.rFull = js13k.Renderer.res;
				this.player.attack();
				this.player.onCooldown = () => { return true; };

				this.phase = 7;
				this._end = this.timer + 200;
			}
		}
		// Continue to next level.
		else if( this.phase === 7 && this._end < this.timer ) {
			js13k.Renderer.level = new js13k.Level.Teeth( this.player.hp );
		}

		// Border update.
		switch( this.phase ) {
			case 2:
				this.border += dt * 0.2;
				this.border = Math.min( this.border, 80 );
				break;

			case 4:
			case 6:
				this.border += dt * 0.2;
				this.border = Math.min( this.border, 200 );
				break;
		}
	}


}


js13k.Level.Eyes = Level_Eyes;

}
