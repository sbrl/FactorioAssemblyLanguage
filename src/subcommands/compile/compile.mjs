"use strict";

import { Readable } from 'stream';
import fs from 'fs';
import streams_concat from '../../lib/async/streams_concat.mjs';

import FALCompiler from '../../lib/falc/FALCompiler.mjs';

export default async function(args) {
	if(args.extras.length == 0)
		args.extras.push("-"); // Default to parsing from stdin
	
	if(args.extras.filter(filepath => filepath === "-") > 1)
		throw new Error(`Error: stdin can be specified as an input at most once.`)
		
	const source_streams = args.extras.map(filepath => {
		return filepath === "-"
			? fs.createReadStream(null, { fd: 0, encoding: "utf-8" })
			: fs.createReadStream(filepath, { encoding: "utf-8" });
	});
	const compiler = new FALCompiler();
	
	const result = await compiler.compile(await streams_concat(source_streams, `\n\n\n`));
	console.log(result);
}