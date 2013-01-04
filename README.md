# scribd

Scribd Platform API binding for Node.JS.

### Installing

GIT

    $ git clone https://github.com/firejune/scribd.git

NPM

    $ npm install scribd

### Usage
`````javascript
var Scribd = require('scribd');

var key = "ENTER-YOUR-API-KEY-HERE"
  , secret = "ENTER-YOUR-API-SECRET-HERE"; 

var scribd = new Scribd(key, secret);

// or

var scribd = new Scribd({
    apikey: key
  , secret: secret
});


/**
 * docs.upload
 */

scribd.upload(function(err, res) {
  console.log("\n scribd.upload", err, res);
}, "./my.docx", "doc", "private");

// or

scribd.upload({
    file: "./my.docx"
  , docType: "doc"
  , access: "private"
}, function(err, res) {
  console.log("\n scribd.upload", err, res);
});

// on conversion event(> 0.1.8)
scribd.on('conversion', function(err, res) {
  clog('conversion event', err, res);
});
`````

### Methods
`````javascript
/**
 * Docs Method
 */

// docs.upload (callback, file, [docType], [access], [revId])
scribd.upload(function(err, res) {
  console.log('\n scribd.upload', err, res);
}, './document.path');

// docs.uploadFromUrl (callback, url, [docType], [access], [revId])
scribd.uploadFromUrl(function(err, res) {
  console.log('\n scribd.uploadFromUrl', err, res);
}, 'url');

// docs.getList (callback)
scribd.getList(function(err, res) {
  console.log('\n scribd.getList', err, res);
});

// docs.getConversionStatus (callback, docId)
scribd.getConversionStatus(function(err, res) {
  console.log('\n scribd.getConversionStatus', err, res);
}, 'docId');

// docs.getSettings (callback, docId)
scribd.getSettings(function(err, res) {
  console.log('\n scribd.getSettings', err, res);
}, 'docId');

// docs.changeSettings (callback, docId, [title], [description], [access], [license], [showAds], [tags])
scribd.changeSettings(function(err, res) {
  console.log('\n scribd.changeSettings', err, res);
}, 'docId', 'title');

// docs.getDownloadUrl (callback, docId)
scribd.getDownloadUrl(function(err, res) {
  console.log('\n scribd.getDownloadUrl', err, res);
}, 'docId');

// docs.getStats (callback, docId)
scribd.getStats(function(err, res) {
  console.log('\n scribd.getStats', err, res);
}, 'docId');

// docs.delete (callback, docId)
scribd.delete(function(err, res) {
  console.log('\n scribd.remove', err, res);
}, 'docId');

// docs.search (callback, query, [numResults], [numStart], [scope])
scribd.search(function(err, res) {
  console.log('\n scribd.search', err, res);
}, 'Node.JS', 1);

// docs.getCategories (callback, [categoryId], [withSubcategories])
scribd.getCategories(function(err, res) {
  console.log('\n scribd.getCategories', err, res);
});

// docs.featured (callback, [limit], [offset], [scope])
scribd.featured(function(err, res) {
  console.log('\n scribd.featured', err, res);
});

// docs.browse (callback, [limit], [offset], [categoryId], [sort])
scribd.browse(function(err, res) {
  console.log('\n scribd.browse', err, res);
});

// docs.uploadThumb (callback, file, docId)
scribd.uploadThumb(function(err, res) {
  console.log('\n scribd.uploadThumb', err, res);
}, 'thumbnail.path', 'docId');


/**
 * Thumbnail Method
 */

// thumbnail.get (callback, docId, [width], [height])
scribd.getThumbnail(function(err, res) {
  console.log('\n scribd.getThumbnail', err, res);
}, 'docId', 256);


/**
 * User Method
 */

// user.login (callback, username, password)
scribd.login(function(err, res) {
  console.log('\n scribd.login', err, res);
}, 'username', 'password');

// user.signup (callback, username, password, email, [name])
scribd.signup(function(err, res) {
  console.log('\n scribd.signup', err, res);
}, 'username', 'password', 'email', 'name');

// user.getAutoSigninUrl (callback, [nextUrl])
scribd.getAutoSigninUrl(function(err, res) {
  console.log('\n scribd.getAutoSigninUrl', err, res);
}, '/');
`````
Have fun!

### License

MIT <3
