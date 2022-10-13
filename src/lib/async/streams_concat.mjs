"use strict";

import { Readable } from 'stream';

/**
 * Concatenates 1 or more readable streams.
 *
 * @param   {stream.Readable[]}	streams		The streams to concatenate.
 * @param	{Buffer|string}		value_join	A value to emit after reading from each stream. If null (the default), no additional chunk will be emitted.
 * @return  {AsyncGenerator<Buffer|string>}           An asynchronous generator that yields promises that resolve to chunks from each of the streams, read in order.
 */
async function* streams_concat_gen(streams, value_join=null) {
	for(const stream of streams) {
		for await (const chunk of stream) {
			yield chunk;
		}
		
		if(value_join !== null)
			yield value_join;
	}
}

/**
 * Concatenates 1 or more readable streams.
 *
 * @param	{stream.Readable[]}	streams			The streams to concatenate.
 * @param	{Buffer|string}		value_join		A value to emit after reading from each stream. If null (the default), no additional chunk will be emitted.
 * @return	{stream.Readable<Buffer|string>}	A readable streams that functions as a concatenation of all the input streams.
 */
export default async function streams_concat(streams, value_join=null) {
	const gen = await streams_concat_gen(streams, value_join);
	return Readable.from(gen);
}