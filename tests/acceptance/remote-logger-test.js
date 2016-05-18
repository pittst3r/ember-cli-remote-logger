import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | remote logger');

test('it logs stuff', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(function() {
    assert.equal(server.db.logs[0].entry, '[DEBUG] foo');
  });

});
