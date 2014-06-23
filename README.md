Ember Broccoli
==============

Goals
-----
- Faster rebuilds & live reloads for development with broccoli.
- Less steps to produce a build (as in xcode / eclipse build)
- Testable


Dependancies
------------
broccoli cli
    npm install -g broccoli-cli

bower
    npm install -g bower


Structure
---------
app - ember application in Ember App Kit suggested format, using ES6 modules
public - root html folder
tmp - temp build file
styles - sass compass compilable scss files
vendor - magic loader for ES6 module compilation


Running
-------
`broccoli serve` will watch & serve your files
To get live reload working, install `Live Reload` 

    https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei 

It should 'just work'.


Testing
-------
TODO


Building
--------
TODO - a cordova prepare before-prepare hook should run `broccoli build www`, then `cordova prepare` (and `cordova build`) would both have the correct up to date files.

