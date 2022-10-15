"use strict";

import Vector2 from '../../math/Vector2.mjs';
import entities from './entities.mjs';

const wire_reach = 7; // This isn't the wire reach, but it needs to be 7 instead fo 9 to ensure full coverage
const pole_size = 1;
const pole_name = entities.POLE_MEDIUM;

function pole_grid(blueprint, size) {
	for(let x = 0; x <= size.x; x += wire_reach) {
		for(let y = 0; y <= size.y; y += wire_reach) {
			blueprint.createEntity(pole_name, new Vector2(x, y));
		}
	}
}

function pole_intersects(pos) {
	return pos.x % wire_reach < pole_size || pos.y % wire_reach < pole_size;
}

export {
	wire_reach,
	pole_size,
	pole_grid,
	pole_intersects
}