var filterTemplates = require('broccoli-template')
var compileES6 = require('broccoli-es6-concatenator')
var compileSass = require('broccoli-compass')
var pickFiles = require('broccoli-static-compiler')
var mergeTrees = require('broccoli-merge-trees')
var concatFiles = require('broccoli-concat')
var env = require('broccoli-env').getEnv()

//change this for each project!
var appNamespace = 'broccoli-ember';

//no es6 dependancies of the main app
var appFilesToAppend = [
  'ember-resolver/dist/ember-resolver.js'    
]

var vendorFilesToAppend = [
  'jQuery/dist/jquery.min.js',
  'handlebars/handlebars.min.js',
  'ember/ember.js'
]

//process handlebars templates for a given tree
function preprocess (tree) {
  tree = filterTemplates(tree, {
    extensions: ['hbs', 'handlebars'],
    compileFunction: 'Ember.Handlebars.compile'
  })
  
  return tree
}

var app = 'app'
app = pickFiles(app, {
  srcDir: '/',
  destDir: appNamespace // move under app namespace
})
app = preprocess(app)

var styles = 'styles'
styles = pickFiles(styles, {
  srcDir: '/',
  destDir: appNamespace + '/styles'
})

var testFiles = 'tests'
testFiles = pickFiles(testFiles, {
  srcDir: '/',
  destDir: '/tests'
})

var vendor = 'vendor'
var sourceTrees = [app, styles, vendor]

var appAndDependencies = new mergeTrees(sourceTrees, { overwrite: true })

var applicationJs = compileES6(appAndDependencies, {
  loaderFile: 'loader/loader.js',
  ignoredModules: [
    'ember/resolver',
    'qunit',
    'ember-qunit'
  ],
  inputFiles: [
    appNamespace + '/**/*.js'
  ],
  legacyFilesToAppend: appFilesToAppend,
  wrapInEval: false,
  outputFile: '/assets/app.js'
})

var vendorFiles = concatFiles(appAndDependencies, {
  inputFiles: vendorFilesToAppend,
  outputFile: '/assets/vendor.js',
  separator: '\n;'
});

var appCss = compileSass(appAndDependencies, appNamespace + '/styles/app.scss', {
    outputStyle: 'expanded',
    sassDir: appNamespace + '/styles',
    imagesDir: 'public/images/',
    cssDir: '/assets'
})

var publicFiles = 'public'

module.exports = mergeTrees([applicationJs, appCss, publicFiles, vendorFiles, testFiles])