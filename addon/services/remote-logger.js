import Ember from 'ember';
import fetch from 'ember-network/fetch';
import LogRequest from 'ember-cli-remote-logger/utils/log-request';

export default Ember.Service.extend({
  debug(entry, tags = []) {
    return this._push('debug', entry, tags);
  },

  info(entry, tags = []) {
    return this._push('info', entry, tags);
  },

  warn(entry, tags = []) {
    return this._push('warn', entry, tags);
  },

  error(entry, tags = []) {
    return this._push('error', entry, tags);
  },

  adapter: Ember.computed(function() {
    return Ember.getOwner(this).lookup('adapter:application');
  }),

  headers: Ember.computed.alias('adapter.headers'),

  host: Ember.computed.alias('adapter.host'),

  namespace: Ember.computed.alias('adapter.namespace'),

  pathPrefix: 'log',

  url: Ember.computed('host', 'namespace', 'pathPrefix', function() {
    let host = this.get('host') || '';
    let namespace = this.get('namespace') || '';
    let prefix = this.get('pathPrefix');

    return constructUrl(host, [namespace, prefix]);
  }),

  useDifferentEndpoints: false,

  urls: Ember.computed('host', 'namespace', 'pathPrefix', function() {
    let host = this.get('host') || '';
    let namespace = this.get('namespace') || '';
    let prefix = this.get('pathPrefix');

    return {
      debug: constructUrl(host, [namespace, prefix, 'debug']),
      info: constructUrl(host, [namespace, prefix, 'info']),
      warn: constructUrl(host, [namespace, prefix, 'warn']),
      error: constructUrl(host, [namespace, prefix, 'error']),
    };
  }),

  _requestOptions: Ember.computed('url', 'urls', 'headers',
  'useDifferentEndpoints', function() {
    return {
      url: this.get('url'),
      urls: this.get('urls'),
      headers: this.get('headers'),
      useDifferentEndpoints: this.get('useDifferentEndpoints')
    };
  }),

  _push(level, entry, tags = []) {
    tags.unshift(level.toUpperCase());

    let formattedEntry = this._formatEntry(entry, tags);

    Ember.get(Ember.Logger, level).call(this, formattedEntry);

    return this._sendRequest(
      this.get('_requestOptions'), level, formattedEntry);
  },

  _formatEntry(entry, tags = []) {
    return tags.map((t) => {
      return ['[', t, ']'].join('');
    }).concat(entry).join(' ');
  },

  _sendRequest(options, level, entry) {
    let req = new LogRequest(options);
    return req.send(level, entry);
  }
});

function constructUrl(start, parts) {
  if (parts.length === 0) { return start; }

  let newPart = parts.shift();
  let newStart;

  if (newPart.length === 0) {
    newStart = start;
  } else {
    newStart = start + '/' + newPart;
  }

  return constructUrl(newStart, parts);
}
