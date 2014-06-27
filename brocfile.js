var filterTemplates = require('broccoli-template')
var compileES6 = require('broccoli-es6-concatenator')
var compileSass = require('broccoli-compass')
var pickFiles = require('broccoli-static-compiler')
var mergeTrees = require('broccoli-merge-trees')
var concatFiles = require('broccoli-concat')
var jshintTree = require('broccoli-jshint');
var env = require('broccoli-env').getEnv()

//change this for each project!
var appNamespace = 'broccoli-ember';

//no es6 dependancies of the main app
var appFilesToAppend = [
  'ember-resolver/dist/ember-resolver.js'    
]

//more external dependacies? add them here
var vendorFilesToAppend = [
  'jQuery/dist/jquery.min.js',
  'handlebars/handlebars.min.js',
]

//only the dev version of ember has the test helpers included
//we don't need them in the production build
if(env === 'production'){
  vendorFilesToAppend.push('ember/ember.prod.js');
} else {
  vendorFilesToAppend.push('ember/ember.js');
}

//process handlebars templates for a given tree
function preprocessTemplates (tree) {
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

var jshintedApp = jshintTree(app, {
  jshintrcPath: '.',
  description: 'jsHint - App'
})

app = preprocessTemplates(app)

var styles = 'styles'
styles = pickFiles(styles, {
  srcDir: '/',
  destDir: appNamespace + '/styles'
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
var filesToExport = [applicationJs, appCss, publicFiles, vendorFiles]

//add the test files if we're not in production
if(env !== 'production'){
  var testFiles = 'tests'
  testFiles = pickFiles(testFiles, {
    srcDir: '/',
    destDir: '/tests'
  })

  var jshintTests = concatFiles(jshintedApp, {
    inputFiles: ['**/*.js'],
    outputFile: '/tests/jshints.js',
    separator: '\n;'
  });

  filesToExport.push(testFiles)
  filesToExport.push(jshintTests)
}

console.log(env) 

module.exports = mergeTrees(filesToExport)