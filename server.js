// Watcher constructor
function Watcher(watchDir, processedDir) {
  this.watchDir = watchDir;
  this.processedDir = processedDir;
}

// Require events module
var events = require('events');
// Require util module
var util = require('util');

// Make Watcher object inherit events.EventEmitter
// same as Watcher.prototype = new events.EventEmitter();
util.inherits(Watcher, events.EventEmitter);


// Require filesystem
var fs = require('fs');

// Define directory
var watchDir = './watch';
var processedDir = './done';

// Define watch() function for Watcher object
Watcher.prototype.watch = function() {
  var watcher = this;
  // Read watchDir and return it if not err
  fs.readdir(this.watchDir, function(err, files) {
    if (err) throw err;
    // Loop through each file in watchDir(files)
    for (var index in files) {
      // Log filename to the console
      console.log(files[index]);
      // Call 'process' event of watcher for each file in watchDir(files)
      watcher.emit('process', files[index]);
    }
  });
}

// Define start() function for Watcher object
Watcher.prototype.start = function() {
  var watcher = this;
  // Below is lower-end code, which uses Node built-in module fs to watch a directory for change. The callback will be called each time the file is accessed.
  fs.watchFile(watchDir, function() {
    watcher.watch();
  });
}

// Instantiate watcher object
var watcher = new Watcher(watchDir, processedDir);

// Register 'process' event on watcher object
watcher.on('process', function process(file) {
  var watchFile = this.watchDir + '/' + file;
  var processedFile = this.processedDir + '/' + file.toLowerCase();

  // fs.rename() actually rename the old path (watchFile) of the file with the new path (processedFile).
  fs.rename(watchFile, processedFile, function(err) {
    if (err) throw err;
  });
});

// Start to watch for change
watcher.start();
