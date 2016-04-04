import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const adapter = Ember.Object.extend({
  host: 'example.com',
  namespace: 'api/v1'
});

moduleFor('service:remote-logger', 'Unit | Service | remote logger', {
  beforeEach: function() {
    this.register('adapter:application', adapter);
  }
});

test('it has a `url` attr for the logging endpoint', function(assert) {
  assert.expect(1);

  let service = this.subject();

  assert.equal(service.get('url'), 'example.com/api/v1/log');
});

test('it concats given tags, keeping log level tag first', function(assert) {
  assert.expect(1);

  let service = this.subject();

  service.reopen({
    _sendRequest(entry) {
      assert.equal(entry, '[DEBUG] [COOL_TAG] [AND_ANOTHER_1] Cool log entry');
    }
  });

  service.debug('Cool log entry', ['COOL_TAG', 'AND_ANOTHER_1']);
});

test('it sends log entry tagged with log level', function(assert) {
  assert.expect(4);

  let service = this.subject();

  service.reopen({
    _sendRequest(entry) {
      assert.equal(entry, '[DEBUG] Cool log entry');
    }
  });

  service.debug('Cool log entry');

  service.reopen({
    _sendRequest(entry) {
      assert.equal(entry, '[INFO] Cool log entry');
    }
  });

  service.info('Cool log entry');

  service.reopen({
    _sendRequest(entry) {
      assert.equal(entry, '[WARN] Cool log entry');
    }
  });

  service.warn('Cool log entry');

  service.reopen({
    _sendRequest(entry) {
      assert.equal(entry, '[ERROR] Cool log entry');
    }
  });

  service.error('Cool log entry');
});

test('it sends the log entry to the `url`', function(assert) {
  assert.expect(1);

  let service = this.subject();

  service.reopen({
    _fetch(url) {
      assert.equal(url, service.get('url'));
      return Ember.RSVP.resolve({ ok: true });
    }
  });

  return service.debug('Cool log entry');
});

test('it rejects if response is not ok', function(assert) {
  assert.expect(1);

  let service = this.subject();

  service.reopen({
    _fetch() {
      return Ember.RSVP.resolve({ ok: false });
    }
  });

  service.debug('Cool log entry').catch((r) => {
    assert.notOk(r.ok);
  });
});
