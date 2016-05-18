import Ember from 'ember';

export default Ember.Route.extend({
  setupController() {
    this.get('remoteLogger').debug('foo');
  }
});
