"use strict";

/*******************************************************
 ************** Simple ES6 Vector2 Class  **************
 *******************************************************
 * Author: Starbeamrainbowlabs
 * Twitter: @SBRLabs
 * Email: feedback at starbeamrainbowlabs dot com
 * 
 * From https://gist.github.com/sbrl/69a8fa588865cacef9c0
 ******************************************************
 * Originally written for my 2D Graphics ACW at Hull
 * University.
 ******************************************************
 * Changelog
 ******************************************************
 * 19th December 2015:
	* Added this changelog.
 * 28th December 2015:
	* Rewrite tests with klud.js + Node.js
 * 30th January 2016:
	* Tweak angleFrom function to make it work properly.
 * 31st January 2016:
	* Add the moveTowards function.
	* Add the minComponent getter.
	* Add the maxComponent getter.
	* Add the equalTo function.
	* Tests still need to be written for all of the above.
 * 19th September 2016:
	* Added Vector2 support to the multiply method.
 * 10th June 2017:
	* Fixed a grammatical mistake in a comment.
	* Added Vector2.fromBearing static method.
 * 21st October 2017:
 	* Converted to ES6 module.
 	* Added Vector2.zero and Vector2.one constants. Remember to clone them!
 * 4th August 2018: (#LOWREZJAM!)
 	* Optimised equalTo()
 * 6th August 2018: (#LOWREZJAM again!)
 	* Added round(), floor(), and ceil()
 * 7th August 2018: (moar #LOWREZJAM :D)
 	* Added area() and snapTo(grid_size)
 * 10th August 2018: (even more #LOWREZJAM!)
 	* Added Vector2 support to divide()
 * 14th August 2022: (FactorioAssemblyLanguage)
	* Renamed Vector → Vector2
 */

class Vector2 {
	// Constructor
	constructor(inX, inY) {
		if(typeof inX != "number")
			throw new Error("Invalid x value.");
		if(typeof inY != "number")
			throw new Error("Invalid y value.");
		
		// Store the (x, y) coordinates
		this.x = inX;
		this.y = inY;
	}

	/**
	 * Add another vector2 to this vector2.
	 * @param	{Vector2}	v	The vector2 to add.
	 * @return	{Vector2}	The current vector2. useful for daisy-chaining calls.
	 */
	add(v) {
		this.x += v.x;
		this.y += v.y;

		return this;
	}

	/**
	 * Take another vector2 from this vector2.
	 * @param  {Vector2} v The vector2 to subtrace from this one.
	 * @return {Vector2}   The current vector2. useful for daisy-chaining calls.
	 */
	subtract(v) {
		this.x -= v.x;
		this.y -= v.y;

		return this;
	}

	/**
	 * Divide the current vector2 by a given value.
	 * @param  {Number|Vector2} value The number (or Vector2) to divide by.
	 * @return {Vector2}	   The current vector2. Useful for daisy-chaining calls.
	 */
	divide(value) {
		if(value instanceof Vector2)
		{
			this.x /= value.x;
			this.y /= value.y;
		}
		else if(typeof value == "number")
		{
			this.x /= value;
			this.y /= value;
		}
		else
			throw new Error("Can't divide by non-number value.");
		
		return this;
	}

	/**
	 * Multiply the current vector2 by a given value.
	 * @param  {Number|Vector2} value The number (or Vector2) to multiply the current vector2 by.
	 * @return {Vector2}	   The current vector2. useful for daisy-chaining calls.
	 */
	multiply(value) {
		if(value instanceof Vector2)
		{
			this.x *= value.x;
			this.y *= value.y;
		}
		else if(typeof value == "number")
		{
			this.x *= value;
			this.y *= value;
		}
		else
			throw new Error("Can't multiply by non-number value.");
		
		return this;
	}
	
	/**
	 * Move the vector2 towards the given vector2 by the given amount.
	 * @param  {Vector2} v      The vector2 to move towards.
	 * @param  {Number} amount The distance to move towards the given vector2.
	 */
	moveTowards(v, amount)
	{
		// From http://stackoverflow.com/a/2625107/1460422
		var dir = new Vector2(
			v.x - this.x,
			v.y - this.y
		).limitTo(amount);
		this.x += dir.x;
		this.y += dir.y;
		
		return this;
	}
	
	/**
	 * Rounds the x and y components of this vector2 down to the next integer.
	 * @return	{Vector2}	This vector2 - useful for diasy-chaining.
	 */
	floor() {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		
		return this;
	}
	/**
	 * Rounds the x and y components of this vector2 up to the next integer.
	 * @return	{Vector2}	This vector2 - useful for diasy-chaining.
	 */
	ceil() {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		
		return this;
	}
	/**
	 * Rounds the x and y components of this vector2 to the nearest integer.
	 * @return	{Vector2}	This vector2 - useful for diasy-chaining.
	 */
	round() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		
		return this;
	}
	
	/**
	 * Calculates the 'area' of this vector2 and returns the result.
	 * In other words, returns x * y. Useful if you're using a Vector2 to store 
	 * a size.
	 * @return {Number} The 'area' of this vector2.
	 */
	area() {
		return this.x * this.y;
	}
	
	/**
	 * Snaps this vector2 to an imaginary square grid with the specified sized 
	 * squares.
	 * @param	{Number}	grid_size	The size of the squares on the imaginary  grid to which to snap.
	 * @return	{Vector2}	The current vector2 - useful for daisy-chaining.
	 */
	snapTo(grid_size) {
		this.x = Math.floor(this.x / grid_size) * grid_size;
		this.y = Math.floor(this.y / grid_size) * grid_size;
		
		return this;
	}

	/**
	 * Limit the length of the current vector2 to value without changing the
	 * direction in which the vector2 is pointing.
	 * @param  {Number} value The number to limit the current vector2's length to.
	 * @return {Vector2}	   The current vector2. useful for daisy-chaining calls.
	 */
	limitTo(value) {
		if(typeof value != "number")
			throw new Error("Can't limit to non-number value.");
		
		this.divide(this.length);
		this.multiply(value);

		return this;
	}

	/**
	 * Return the dot product of the current vector2 and another vector2.
	 * @param  {Vector2} v   The other vector2 we should calculate the dot product with.
	 * @return {Vector2}	 The current vector2. Useful for daisy-chaining calls.
	 */
	dotProduct(v) {
		return (this.x * v.x) + (this.y * v.y);
	}

	/**
	 * Calculate the angle, in radians, from north to another vector2.
	 * @param  {Vector2} v The other vector2 to which to calculate the angle.
	 * @return {Vector2}	 The current vector2. useful for daisy-chaining calls.
	 */
	angleFrom(v) {
		// From http://stackoverflow.com/a/16340752/1460422
		var angle = Math.atan2(v.y - this.y, v.x - this.x) - (Math.PI / 2);
		angle += Math.PI/2;
		if(angle < 0) angle += Math.PI * 2;
		return angle;
	}

	/**
	 * Clones the current vector2.
	 * @return {Vector2} A clone of the current vector2. Very useful for passing around copies of a vector2 if you don't want the original to be altered.
	 */
	clone() {
		return new Vector2(this.x, this.y);
	}

	/*
	 * Returns a representation of the current vector2 as a string.
	 * @returns {string} A representation of the current vector2 as a string.
	 */
	toString() {
		return `(${this.x}, ${this.y})`;
	}
	
	/**
	 * Whether the vector2 is equal to another vector2.
	 * @param  {Vector2} v The vector2 to compare to.
	 * @return {boolean}  Whether the current vector2 is equal to the given vector2.
	 */
	equalTo(v)
	{
		return this.x == v.x && this.y == v.y;
	}

	/**
	 * Get the unit vector2 of the current vector2 - that is a vector2 poiting in the same direction with a length of 1. Note that this does *not* alter the original vector2.
	 * @return {Vector2} The current vector2's unit form.
	 */
	get unitVector2() {
		var length = this.length;
		return new Vector2(
		this.x / length,
		this.y / length);
	}

	/**
	 * Get the length of the current vector2.
	 * @return {Number} The length of the current vector2.
	 */
	get length() {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	}
	
	/**
	 * Get the value of the minimum component of the vector2.
	 * @return {Number} The minimum component of the vector2.
	 */
	get minComponent() {
		return Math.min(this.x, this.y);
	}
	
	/**
	 * Get the value of the maximum component of the vector2.
	 * @return {Number} The maximum component of the vector2.
	 */
	get maxComponent() {
		return Math.min(this.x, this.y);
	}
}

/**
 * Returns a new vector2 based on an angle and a length.
 * @param	{Number}	angle	The angle, in radians.
 * @param	{Number}	length	The length.
 * @return	{Vector2}	A new vector2 that represents the (x, y) of the specified angle and length.
 */
Vector2.fromBearing = function(angle, length) {
	return new Vector2(
		length * Math.cos(angle),
		length * Math.sin(angle)
	);
}

Vector2.zero = new Vector2(0, 0);
Vector2.one = new Vector2(1, 1);

export default Vector2;
