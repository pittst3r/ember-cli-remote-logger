export function initialize(application) {
  application.inject('route', 'remoteLogger', 'service:remote-logger');
  application.inject('model', 'remoteLogger', 'service:remote-logger');
  application.inject('component', 'remoteLogger',
    'service:remote-logger');
}

export default {
  name: 'remote-logger-service',
  initialize
};
