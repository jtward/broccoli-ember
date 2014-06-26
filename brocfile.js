var filterTemplates = require('broccoli-template')
var compileES6 = require('broccoli-es6-concatenator')
var compileSass = require('broccoli-compass')
var pickFiles = require('broccoli-static-compiler')
var mergeTrees = require('broccoli-merge-trees')
//var findBowerTrees = require('broccoli-bower')
var env = require('broccoli-env').getEnv()

var appFilesToAppend = [
    'jQuery/dist/jquery.min.js',
    'handlebars/handlebars.min.js',
    'ember/ember.js',
    'ember-resolver/dist/ember-resolver.js'
  ]

var testFilesToAppend = [
  'qunit/qunit/qunit.js',
  'ember-qunit/dist/named-amd/main.js'
];

//change this for each project!
var appNamespace = 'broccoli-ember';

function preprocess (tree) {
  tree = filterTemplates(tree, {
    extensions: ['hbs', 'handlebars'],
    compileFunction: 'Ember.Handlebars.compile'
  })
  
  return tree
}

var bowerComps = 'bower_components';

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
  files:['index.html'],
  destDir: '/tests'
})

var testsScripts = 'tests'
testsScripts = pickFiles(testsScripts, {
  srcDir: '/',
  files:['**/*.js'],
  destDir: '/tests'
})

var vendor = 'vendor'
var sourceTrees = [app, styles, vendor, bowerComps]

//sourceTrees = sourceTrees.concat(findBowerTrees())

var appAndDependencies = new mergeTrees(sourceTrees, { overwrite: true })

var appJs = compileES6(appAndDependencies, {
  loaderFile: 'loader.js',
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

// TESTING
var testSourceTrees = [app, testsScripts, vendor, bowerComps];
//testSourceTrees = testSourceTrees.concat(findBowerTrees())
var testAndDependencies = new mergeTrees(testSourceTrees, { overwrite: true })
var testsJs = compileES6(testAndDependencies, {
  loaderFile: 'loader.js',
  ignoredModules: [
    'ember/resolver',
    'qunit',
    'ember-qunit'
  ],
  inputFiles: [
    'tests/**/*.js'
  ],
  legacyFilesToAppend: appFilesToAppend.concat(testFilesToAppend),
  wrapInEval: false,
  outputFile: '/assets/tests.js'
})

var appCss = compileSass(appAndDependencies, appNamespace + '/styles/app.scss', {
    outputStyle: 'expanded',
    sassDir: appNamespace + '/styles',
    imagesDir: 'public/images/',
    cssDir: '/assets'
})

var publicFiles = 'public'

module.exports = mergeTrees([appJs, appCss, publicFiles, testsJs, testFiles])