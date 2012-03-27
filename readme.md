barkeep [![Build Status](https://secure.travis-ci.org/flite/barkeep.png)](http://travis-ci.org/flite/barkeep)
===

<img src="http://bit.ly/wAqCqY" alt="Barkeep" title="Barkeep" height="336" width="535"/>

Barkeep is Flite's javascript build toolkit. It provides a simple toolkit of common build-related functions, such as:

* Syncing full directories to S3.
* Creating directories if they don't exist.
* Getting a recursive listing of files in a directory.

## Usage

Include the barkeep module and instantiate it.

``` javascript
var Barkeep = require('barkeep');
var bk = new Barkeep();
```

## Examples

*To create a directory if one doesn't exist.*

``` javascript
var bk = new Barkeep();
bk.directory('/scripts');
```

*Get a recursive listing of all files in src/ that end in .js*

``` javascript
var bk = new Barkeep();
var files = bk.fileListRecursive('src/', '*.js');
console.dir(files);
```