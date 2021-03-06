'use strict'

var NDArray = require('ndarray');
var isBrowser = require('is-browser');
var toAB = require('./');
var t = require('tape')


t('basics', t => {
	t.ok(toAB() instanceof ArrayBuffer);
	t.equal(toAB().byteLength, 0);
	t.end()
})

t('ArrayBuffer', t => {
	t.equal(toAB(new ArrayBuffer(2)).byteLength, 2);
	t.end()
})

t('Float32Array', t => {
	t.equal(toAB(new Float32Array(2)).byteLength, 8);
	t.end()
})

t('Buffer', t => {
	t.equal(toAB(new Buffer(4)).byteLength, 4);
	t.end()
})

t('Array', t => {
	t.equal(toAB([1,2,3]).byteLength, 3);
	t.end()
})

t('data-uri bare-bones', t => {
	var uri = 'data:,Hello%2C%20World!';
    var buf = toAB(uri);
    t.equal('Hello, World!', String.fromCharCode.apply(null, new Uint8Array(buf)));

    t.end()
})
t('data-uri bare-bones base64', t => {
	var uri = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D';
    var buf = toAB(uri);
    t.equal('Hello, World!', String.fromCharCode.apply(null, new Uint8Array(buf)));
    t.end()
})
t('plain-text Data URIs', t => {
	var html = '<!DOCTYPE html>'+
               '<html lang="en">'+
               '<head><title>Embedded Window</title></head>'+
               '<body><h1>42</h1></body>'+
               '</html>';

    // Escape the HTML for URL formatting
    var uri = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

    var buf = toAB(uri);
    t.equal(html, String.fromCharCode.apply(null, new Uint8Array(buf)));
    t.end()
})
t.skip('decode "ISO-8859-8 in Base64" URIs', t => {
	var uri = 'data:text/plain;charset=iso-8859-8-i;base64,+ezl7Q==';

    var buf = toAB(uri);
    t.equal(4, buf.byteLength);

    var arr = new Uint8Array(buf)
    t.equal(0xf9, arr[0]);
    t.equal(0xec, arr[1]);
    t.equal(0xe5, arr[2]);
    t.equal(0xed, arr[3]);

    t.end()
})
t('decode "ISO-8859-8 in URL-encoding" URIs')
t('decode "UTF-8 in Base64"')
t('base64')

t('non-decodable')

t.skip('unicode data-uri', t => {
    t.equal(toAB('uuLMhh').byteLength, 16)
    t.end()
})
