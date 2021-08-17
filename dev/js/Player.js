'use strict';


{

class Player extends js13k.LevelObject {


	/**
	 *
	 * @constructor
	 * @param {js13k.Level} level
	 * @param {number}      x
	 * @param {number}      y
	 * @param {number}      size
	 */
	constructor( level, x, y, size ) {
		super( level, { x, y, w: 6 * size, h: 8 * size, t: -1 } );
		this.size = size;

		this.dirX = 1;
		this.dirY = 0;

		this.died = 0;
		this.frameX = 0;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		// TODO:
	}


	/**
	 *
	 * @param {number} dt
	 * @param {object} dir
	 * @param {number} dir.x
	 * @param {number} dir.y
	 */
	update( dt, dir ) {
		// TODO:
	}


}


js13k.Player = Player;

}
