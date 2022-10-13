"use strict";

import fs from 'fs';
import streams_concat from '../../lib/async/streams_concat.mjs';

import FALCompiler from '../../lib/falc/FALCompiler.mjs';

export default async function(args) {
	if(args.extras.length == 0)
		args.extras.push("-"); // Default to parsing from stdin
	
	if(typeof args.output !== "string")
		throw new Error(`Error: No output filepath specified.`);
	if(args.extras.filter(filepath => filepath === "-") > 1)
		throw new Error(`Error: stdin can be specified as an input at most once.`)
		
	const source_streams = args.extras.map(filepath => filepath === "-" ? process.stdin : fs.createReadStream(filepath));
		
	const compiler = new FALCompiler();
	
	const result = compiler.compile(streams_concat(source_streams, `\n\n\n`));
	console.log(result);
}