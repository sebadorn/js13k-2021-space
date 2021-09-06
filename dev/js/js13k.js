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
	 * Check if two axis-aligned bounding boxes overlap.
	 * @param  {object} a   - An axis-aligned bounding box.
	 * @param  {number} a.h - Height.
	 * @param  {number} a.w - Width.
	 * @param  {number} a.x - Position on X axis.
	 * @param  {number} a.y - Position on Y axis.
	 * @param  {object} b   - An axis-aligned bounding box.
	 * @param  {number} b.h - Height.
	 * @param  {number} b.w - Width.
	 * @param  {number} b.x - Position on X axis.
	 * @param  {number} b.y - Position on Y axis.
	 * @return {boolean}
	 */
	// overlap( a, b ) {
	// 	let overlapX = Math.min( a.x + a.w, b.x + b.w ) - Math.max( a.x, b.x );
	// 	overlapX = ( overlapX < 0 ) ? 0 : overlapX;

	// 	let overlapY = Math.min( a.y + a.h, b.y + b.h ) - Math.max( a.y, b.y );
	// 	overlapY = ( overlapY < 0 ) ? 0 : overlapY;

	// 	return ( overlapX * overlapY > Number.EPSILON );
	// },


	/**
	 * Normalize a 2D vector.
	 * @param  {number[]} vec
	 * @return {number[]}
	 */
	normalize( vec ) {
		const length = Math.sqrt( vec[0] * vec[0] + vec[1] * vec[1] );
		vec[0] /= length || 1;
		vec[1] /= length || 1;

		return vec;
	},


	/**
	 * Shuffle an array.
	 * @param {Array} arr
	 */
	shuffle( arr ) {
		for( let i = arr.length - 1; i > 0; i-- ) {
			const j = Math.floor( Math.random() * ( i + 1 ) );
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}


};


window.addEventListener( 'load', () => js13k.init() );
