"use strict";

import path from 'path';
import fs from 'fs';

import log_core from './lib/io/Log.mjs';
import { LOG_LEVELS} from './lib/io/Log.mjs';
import log from './lib/io/NamespacedLog.mjs'; const l = log("core");

import CliParser from 'applause-cli';

import a from './lib/io/Ansi.mjs';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));

async function load_subcommands(cli) {
	let dirs = await fs.promises.readdir(path.join(__dirname, "subcommands"));
	for(let dir of dirs) {
		(await import(path.join(__dirname, "subcommands", dir, `meta.mjs`))).default(cli);
	}
}

export default async function () {
	const subcommands = [ "compile" ]; // TODO: Populate this with a readdir as above
	let cli = new CliParser(path.resolve(__dirname, "../package.json"));
	cli.argument("verbose", "Enable verbose debugging output", null, "boolean")
		.argument("log-level", "Set the logging level (possible values: debug, info [default], log, warn, error, none)", "info", "string");
	
	await load_subcommands(cli);
	
	// Default to the compile subcommand
	let args_raw = process.argv.slice(2);
	if(subcommands.indexOf(args_raw.filter(part => !part.startsWith("-"))[0]) == -1)
		args_raw.unshift("compile");
	
	const args = cli.parse(args_raw);
	args.extras = cli.extras;
	
	if(cli.current_subcommand == null)
		cli.current_subcommand = "compile";
	
	log_core.level = LOG_LEVELS[args.log_level.toUpperCase()];
	
	let subcommand_file = path.join(
		__dirname,
		"subcommands",
		cli.current_subcommand,
		`${cli.current_subcommand}.mjs`
	);
	
	if(!fs.existsSync(subcommand_file)) {
		l.error(`Error: The subcommand '${cli.current_subcommand}' doesn't exist (try --help for a list of subcommands and their uses).`);
		process.exit(1);
	}
	
	
	try {
		await (await import(subcommand_file)).default(args);
	}
	catch(error) {
		console.error();
		if(args.verbose)
			throw error;
		else
			console.error(`${a.fred}${a.hicol}${error.message}${a.reset}`);
		process.exit(1);
		throw error;
	}
}
