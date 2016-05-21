import fetch from 'ember-network/fetch';

export default function LogRequest(opts) {
  this.url = opts.url;
  this.urls = opts.urls;
  this.headers = opts.headers;
  this.useDifferentEndpoints = opts.useDifferentEndpoints;
}

LogRequest.prototype.send = function LogRequest_send(level, entry) {
  let url = this.url;
  let headers = this.headers || {};

  if (this.useDifferentEndpoints) {
    url = this.urls[level];
  }

  headers['Content-Type'] = 'text/plain';

  const fetchOptions = {
    method: 'POST',
    headers: headers,
    body: entry
  };

  return this.fetch(url, fetchOptions).then((r) => {
    if (r.ok) {
      return Ember.RSVP.resolve(r);
    } else {
      return Ember.RSVP.reject(r);
    }
  });
};

LogRequest.prototype.fetch = function LogRequest_fetch(url, opts) {
  return fetch(url, opts);
};
