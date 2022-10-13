"use strict";

import nearley from 'nearley';
import fal_grammar from './FactorioAssemblyLanguage.cjs';

class FALCompiler {
	constructor() {
	}
	
	compile(source) {
		const parser = new nearley.Parser(nearley.Grammar.fromCompiled(fal_grammar));
		for await(const chunk of source) {
			parser.feed(chunk);
		}
		return parser.results;
	}
}

export default FALCompiler;