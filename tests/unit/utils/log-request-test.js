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
