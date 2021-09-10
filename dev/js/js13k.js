'use strict';


/**
 * @namespace js13k
 */
const js13k = {


	// Config
	DEBUG: true,
	FONT: '"Courier New", monospace',
	TARGET_FPS: 60,


	/**
	 * Check if two circles overlap.
	 * @param  {object} c1
	 * @param  {object} c1.x - X coordinate of center.
	 * @param  {object} c1.y - Y coordinate of center.
	 * @param  {object} c1.r - Radius.
	 * @param  {object} c2.x - X coordinate of center.
	 * @param  {object} c2.y - Y coordinate of center.
	 * @param  {object} c2.r - Radius.
	 * @return {boolean}
	 */
	circleOverlap( c1, c2 ) {
		const sqCenterDistance = ( c1.x - c2.x ) * ( c1.x - c2.x ) + ( c1.y - c2.y ) * ( c1.y - c2.y );
		const sqRadiusSum = ( c1.r + c2.r ) * ( c1.r + c2.r );

		return sqCenterDistance < sqRadiusSum;
	},


	/**
	 *
	 */
	init() {
		js13k.Input.init();
		js13k.Audio.init();

		js13k.Renderer.init( () => {
			js13k.Renderer.level = new js13k.Level.Intro();
			js13k.Renderer.mainLoop();
		} );
	},


	/**
	 * Normalize a 2D vector.
	 * @param  {number[]} vec
	 * @return {Array} Index 0: normalized vector; index 1: length of vector before normalizing
	 */
	normalize( vec ) {
		const length = Math.sqrt( vec[0] * vec[0] + vec[1] * vec[1] );
		vec[0] /= length || 1;
		vec[1] /= length || 1;

		return [vec, length];
	},


	/**
	 * Shuffle an array.
	 * @param  {Array} arr
	 * @return {Array}
	 */
	shuffle( arr ) {
		for( let i = arr.length - 1; i > 0; i-- ) {
			const j = Math.floor( Math.random() * ( i + 1 ) );
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}

		return arr;
	}


};


window.addEventListener( 'load', () => js13k.init() );
