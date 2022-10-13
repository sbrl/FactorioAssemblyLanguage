"use strict";

/**
 * Concatenates 1 or more readable streams.
 *
 * @param   {stream.Readable[]}	streams		The streams to concatenate.
 * @param	{Buffer|string}		value_join	A value to emit after reading from each stream. If null (the default), no additional chunk will be emitted.
 * @return  {AsyncGenerator<Buffer|string>}           An asynchronous generator that yields promises that resolve to chunks from each of the streams, read in order.
 */
export default async function* streams_concat(streams, value_join=null) {
	for(const stream in streams) {
		for await (const chunk of stream)
			yield chunk;
		
		if(value_join !== null)
			yield value_join;
	}
}