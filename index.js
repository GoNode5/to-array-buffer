/**
 * @module  to-array-buffer
 */

'use strict'

var isBase64 = require('is-base64')
var str2ab = require('string-to-arraybuffer')

//FIXME: what is the good way to go on with this package?
module.exports = function toArrayBuffer (arg) {
	//zero-length or undefined-like
	if (!arg) return new ArrayBuffer();

	//array buffer
	if (arg instanceof ArrayBuffer) return arg;

	//try to decode data-uri
	if (typeof arg === 'string') {
		return str2ab(arg)
	}

	//array buffer view: TypedArray, DataView, Buffer etc
	if (ArrayBuffer.isView(arg)) {
		if (arg.byteOffset != null) return arg.buffer.slice(arg.byteOffset, arg.byteOffset + arg.byteLength);
		return arg.buffer;
	}

	//buffer/data nested: NDArray, ImageData etc.
	//FIXME: NDArrays with custom data type may be invalid for this procedure
	if (arg.buffer || arg.data || arg._data) {
		var result = toArrayBuffer(arg.buffer || arg.data || arg._data);
		return result;
	}

	//array-like or unknown
	//hope Uint8Array knows better how to treat the input
	return (new Uint8Array(arg.length != null ? arg : [arg])).buffer;
}
