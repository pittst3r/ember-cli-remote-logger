import Ember from 'ember';
import fetch from 'ember-network/fetch';

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

  path: 'log',

  url: Ember.computed('host', 'namespace', 'path', function() {
    let host = this.get('host') || '';
    let namespace = this.get('namespace') || '';
    let path = this.get('path');

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

    return constructUrl(host, [namespace, path]);
  }),

  _push(level, entry, tags = []) {
    tags.unshift(level.toUpperCase());

    const formattedEntry = this._formatEntry(entry, tags);

    Ember.get(Ember.Logger, level).call(this, formattedEntry);

    return this._sendRequest(formattedEntry);
  },

  _formatEntry(entry, tags = []) {
    return tags.map((t) => {
      return ['[', t, ']'].join('');
    }).concat(entry).join(' ');
  },

  _sendRequest(entry) {
    let url = this.get('url');
    let headers = this.get('headers');

    if (headers) {
      headers['Content-Type'] = 'text/plain';
    }

    const fetchOptions = {
      method: 'POST',
      headers: headers,
      body: entry
    };

    return this._fetch(url, fetchOptions).then((r) => {
      if (r.ok) {
        return Ember.RSVP.resolve(r);
      } else {
        return Ember.RSVP.reject(r);
      }
    });
  },

  _fetch(url, options) {
    return fetch(url, options);
  }
});
