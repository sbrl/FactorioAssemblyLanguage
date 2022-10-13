"use strict";

export default function(cli) {
	cli.subcommand("compile", "Compiles a Factorio Assembly Language (.fal) file into Factorio blueprint. Example: 'falc infile1.fal infile2.fal infileN.fal -o blueprint.txt'. This is the default subcommand.")
		.argument("output", "Specifies the filepath to which the resulting factorio blueprint should be written. Default: stdout.", "-", "string");
}