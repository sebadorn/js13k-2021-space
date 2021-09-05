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

		this.angle = 0;
		this.level = level;
		this.sp = 1; // speed
		this.started = 0;
		this.ended = 0;
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
	 */
	start() {
		this.started = this.level.timer;
	}


}


js13k.LevelObject = LevelObject;

}
