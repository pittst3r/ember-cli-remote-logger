import Ember from 'ember';
import RemoteLoggerServiceInitializer from 'dummy/initializers/remote-logger-service';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | remote logger service', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RemoteLoggerServiceInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
