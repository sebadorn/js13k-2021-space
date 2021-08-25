'use strict';


{

class LevelObject {


	/**
	 *
	 * @constructor
	 * @param {object}   data
	 * @param {?string}  data.color
	 * @param {?number} [data.t = 0]
	 * @param {?number} [data.x = 0]
	 * @param {?number} [data.y = 0]
	 * @param {?number} [data.w = 0]
	 * @param {?number} [data.h = 0]
	 */
	constructor( level, data ) {
		this.type = data.t || 0;

		this.color = data.color || this.color || '#404047';

		this.x = 0;
		this.y = 0;
		this.w = data.w || 0;
		this.h = data.h || 0;

		this.collision = true;
		this.level = level;

		this.x = data.x || 0;
		this.y = data.y || 0;

		this.nextPos = {
			x: this.x,
			y: this.y
		};
	}


	/**
	 *
	 * @param {CanvasRenderingContext2d} ctx
	 */
	draw( ctx ) {
		// TODO:
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		// TODO:
	}


}


js13k.LevelObject = LevelObject;

}
