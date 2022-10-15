"use strict";

import nearley from 'nearley';
import Blueprint from 'factorio-blueprint';

import log from '../io/NamespacedLog.mjs'; const l = log("falc");
import fal_grammar from './FactorioAssemblyLanguage.cjs';
import pole_grid from './components/pole_grid.mjs';
import Vector2 from '../math/Vector2.mjs';

class FALCompiler {
	constructor() {
	}
	
	async parse(source) {
		const parser = new nearley.Parser(nearley.Grammar.fromCompiled(fal_grammar));
		
		for await(const chunk of source) {
			parser.feed(chunk);
		}
		
		return parser.results;
	}
	
	make_blueprint(tree, encode=true) {
		const blueprint = new Blueprint();
		
		pole_grid(blueprint, new Vector2(50, 50));
		
		blueprint.fixCenter();
		return encode ? blueprint.encode() : blueprint;
	}
	
	async compile(source, encode=true) {
		const tree = await this.parse(source);
		return this.make_blueprint(tree, encode);
	}
}

export default FALCompiler;