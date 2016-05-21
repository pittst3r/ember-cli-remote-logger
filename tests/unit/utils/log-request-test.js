import Ember from 'ember';
import LogRequest from 'dummy/utils/log-request';
import { module, test } from 'qunit';

module('Unit | Utility | log request');

test('it sends the log entry to the `url`', function(assert) {
  assert.expect(1);

  let actualUrl = 'https://www.example.com/api/v1/log';
  let options = {
    url: actualUrl
  };
  let subject = new LogRequest(options);

  subject.fetch = function stubbedFetch(url) {
    assert.equal(url, actualUrl);
    return Ember.RSVP.resolve({ ok: true });
  };

  subject.send('debug', 'Cool log entry');
});

test('it sends the log entries to the `urls` if opted-in', function(assert) {
  assert.expect(1);

  let actualUrls = {
    debug: 'https://www.example.com/api/v1/log/debug'
  };
  let options = {
    urls: actualUrls,
    useDifferentEndpoints: true
  };
  let subject = new LogRequest(options);

  subject.fetch = function stubbedFetch(url) {
    assert.equal(url, actualUrls.debug);
    return Ember.RSVP.resolve({ ok: true });
  };

  subject.send('debug', 'Cool log entry');
});

test('it sets headers to headers given in options', function(assert) {
  assert.expect(1);

  let actualUrl = 'https://www.example.com/api/v1/log';
  let options = {
    url: actualUrl,
    headers: {
      'X-Whatever': 'foo bar'
    }
  };
  let subject = new LogRequest(options);

  subject.fetch = function stubbedFetch(_, fetchOptions) {
    assert.equal(fetchOptions.headers['X-Whatever'], 'foo bar');
    return Ember.RSVP.resolve({ ok: true });
  };

  subject.send('debug', 'Cool log entry');
});

test('it sets the `Content-Type` header to `text/plain`', function(assert) {
  assert.expect(1);

  let actualUrl = 'https://www.example.com/api/v1/log';
  let options = {
    url: actualUrl
  };
  let subject = new LogRequest(options);

  subject.fetch = function stubbedFetch(_, fetchOptions) {
    assert.equal(fetchOptions.headers['Content-Type'], 'text/plain');
    return Ember.RSVP.resolve({ ok: true });
  };

  subject.send('debug', 'Cool log entry');
});
