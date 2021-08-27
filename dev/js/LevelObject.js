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
		this.x = 0;
		this.y = 0;
		this.w = data.w || 0;
		this.h = data.h || 0;

		this.collision = true;
		this.level = level;

		this.x = data.x || 0;
		this.y = data.y || 0;
	}


}


js13k.LevelObject = LevelObject;

}
