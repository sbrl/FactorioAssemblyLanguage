"use strict";

import nearley from 'nearley';
import fal_grammar from './FactorioAssemblyLanguage.cjs';

import log from './lib/io/NamespacedLog.mjs'; const l = log("falc");

class FALCompiler {
	constructor() {
	}
	
	async compile(source) {
		const parser = new nearley.Parser(nearley.Grammar.fromCompiled(fal_grammar));
		
		for await(const chunk of source) {
			console.error(`DEBUG:compile FEED`, chunk);
			parser.feed(chunk);
		}
		
		return parser.results;
	}
}

export default FALCompiler;