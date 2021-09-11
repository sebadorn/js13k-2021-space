'use strict';


{

class FangBoss extends js13k.LevelObject {


	/**
	 *
	 * @constructor
	 * @param {js13k.Level} level
	 */
	constructor( level ) {
		super( level, { w: 300, h: 80 } );

		this.progress = -7;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		if( !this.show ) {
			return;
		}

		const segment = this.h * 6;

		const offsetX = ( Math.sin( this.level.timer / 20 ) + 1 ) * 10;
		let offsetY = Math.round( this.progress * this.h );

		if( this.progress > 0 ) {
			offsetY = offsetY % segment;
		}


		// Left side.
		let x = this.x - offsetX;
		let y = this.y - segment + offsetY - this.h;

		ctx.drawImage( js13k.Renderer.sprites.w_tooth, x, y += segment, this.w, this.h );
		ctx.drawImage( js13k.Renderer.sprites.w_tooth, x, y += segment, this.w, this.h );


		// Right side.
		x = js13k.Renderer.res - 20 - this.level.border + offsetX;
		y = this.y - segment + offsetY - this.h;

		ctx.translate( x, y );
		ctx.scale( -1, 1 );
		ctx.translate( -x, -y );

		y -= segment * 0.5;

		ctx.drawImage( js13k.Renderer.sprites.w_tooth, x, y += segment, this.w, this.h );
		ctx.drawImage( js13k.Renderer.sprites.w_tooth, x, y += segment, this.w, this.h );


		ctx.setTransform( js13k.Renderer.scale, 0, 0, js13k.Renderer.scale, 0, 0 );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		if( !this.show ) {
			return;
		}

		this.x = this.level.border + 20;
		this.y = this.level.border + 20;

		this.progress += dt * 0.03;
	}


}


js13k.LevelObject.FangBoss = FangBoss;

}
