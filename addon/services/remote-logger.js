import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Service.extend({
  url: Ember.computed.alias('_url'),

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

  _push(level, entry, tags = []) {
    tags.unshift(level.toUpperCase());

    const formattedEntry = this._formatEntry(entry, tags);

    Ember.get(Ember.Logger, level).call(this, formattedEntry);

    return this._sendRequest(formattedEntry);
  },

  _adapter: Ember.computed(function() {
    return Ember.getOwner(this).lookup('adapter:application');
  }),

  _url: Ember.computed(function() {
    const adapter = this.get('_adapter');
    
    return [adapter.get('host'), adapter.get('namespace'), 'log'].join('/');
  }),

  _formatEntry(entry, tags = []) {
    return tags.map(function(t) {
      return ['[', t, ']'].join('');
    }).concat(entry).join(' ');
  },

  _sendRequest(entry) {
    const adapter = this.get('_adapter');
    const url = this.get('url');
    const headers = adapter.get('headers');

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
    }, (r) => {
      return Ember.RSVP.reject(r);
    });
  },

  _fetch(url, options) {
    return fetch(url, options);
  }
});
