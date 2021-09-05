'use strict';


{

class LevelObject {


	/**
	 *
	 * @constructor
	 * @param {object}   data
	 * @param {?number} [data.x = 0]
	 * @param {?number} [data.y = 0]
	 * @param {?number} [data.w = 0]
	 * @param {?number} [data.h = 0]
	 */
	constructor( level, data ) {
		this.x = data.x || 0;
		this.y = data.y || 0;
		this.w = data.w || 0;
		this.h = data.h || 0;

		this._start = Infinity;
		this.angle = 0;
		this.ended = 0;
		this.level = level;
		this.sp = 1; // speed
	}


	/**
	 *
	 * @param  {boolean} [round = false]
	 * @return {object}
	 */
	getCenter( round ) {
		let x = this.x + this.w * 0.5;
		let y = this.y + this.h * 0.5;

		if( round ) {
			x = Math.round( x );
			y = Math.round( y );
		}

		return { x, y };
	}


	/**
	 *
	 * @param {number} [offset = 0]
	 */
	start( offset = 0 ) {
		this._start = this.level.timer + offset;
	}


}


js13k.LevelObject = LevelObject;

}
