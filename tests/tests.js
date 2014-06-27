var Application = require('broccoli-ember/app')['default'];
var Router = require('broccoli-ember/router')['default'];

function startApp(attrs) {
  var App;

  var attributes = Ember.merge({
    // useful Test defaults
    rootElement: '#ember-testing',
    LOG_ACTIVE_GENERATION:false,
    LOG_VIEW_LOOKUPS: false
  }, attrs); // but you can override;

  Router.reopen({
    location: 'none'
  });

  Ember.run(function(){
    App = Application.create(attributes);
    App.setupForTesting();
    App.injectTestHelpers();
  });

  App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

  return App;
}

window.App = startApp();

test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

module("Index module", {
	setup: function(){
		visit('/');
	},
	teardown: function(){
		App.reset();
	}
});

test('Does bill exist?', function(){
  equal(find('.bill').length, 1, 'found bill');
});

test('Is there a header?', function(){
   equal(find('header').length, 1, 'found header');
});


module("About module", {
	setup: function(){
		visit('/about');
	},
	teardown: function(){
		App.reset();
	}
});

test('Look for another bill', function(){
  equal(find('#another-bill').length, 1, 'found bill again');
});