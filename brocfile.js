
var filterTemplates = require('broccoli-template')
//var uglifyJavaScript = require('broccoli-uglify-js')
var compileES6 = require('broccoli-es6-concatenator')
var compileSass = require('broccoli-compass')
var pickFiles = require('broccoli-static-compiler')
var mergeTrees = require('broccoli-merge-trees')
var findBowerTrees = require('broccoli-bower')
var env = require('broccoli-env').getEnv()

//change this for each project!
var appNamespace = 'broccoli-ember';

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
styles = preprocess(styles)

var tests = 'tests'
tests = pickFiles(tests, {
  srcDir: '/',
  destDir: appNamespace + '/tests'
})
tests = preprocess(tests)

var vendor = 'vendor'

var sourceTrees = [app, styles, vendor]
if (env !== 'production') {
  sourceTrees.push(tests)
}
sourceTrees = sourceTrees.concat(findBowerTrees())

var appAndDependencies = new mergeTrees(sourceTrees, { overwrite: true })

var appJs = compileES6(appAndDependencies, {
  loaderFile: 'loader.js',
  ignoredModules: [
    'ember/resolver'
  ],
  inputFiles: [
    appNamespace + '/**/*.js'
  ],
  legacyFilesToAppend: [
    'jquery.js',
    'handlebars.js',
    'ember.js',
    'ember-resolver.js'
  ],
  wrapInEval: false,
  outputFile: '/assets/app.js'
})

var appCss = compileSass(appAndDependencies, appNamespace + '/styles/app.scss', {
    outputStyle: 'expanded',
    sassDir: appNamespace + '/styles',
    imagesDir: 'public/images/',
    cssDir: '/assets'
})

var publicFiles = 'public'

module.exports = mergeTrees([appJs, appCss, publicFiles])
