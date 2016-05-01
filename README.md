# ember-cli-remote-logger

[![Build Status](https://travis-ci.org/robbiepitts/ember-cli-remote-logger.svg?branch=master)](https://travis-ci.org/robbiepitts/ember-cli-remote-logger)

Gives your ember-cli app remote logging capabilities.

# Installation

```
ember install ember-cli-remote-logger
ember install ember-network
```

# Usage

This addon will look up your application adapter and use it to build a request
to send the log entries with. Your adapter's host, namespace, and headers are
included in the request. In addition to your adapter's headers a `Content-Type`
of `text/plain` is added and the body of the request is, accordingly,
plain text. The request is sent using `ember-network/fetch`, so it's FastBoot compatible.

So, for example, if your adapter's host is `https://www.example.com` and your
namespace is `api/v1` then log entries will be sent via `POST` to
`https://www.example.com/api/v1/log`.

Once your server is ready to accept requests you can use the logger thusly:

```js
export default Ember.Component.extend({
  remoteLogger: Ember.inject.service(),

  actions: {
    coolAction() {
      remoteLogger.debug('Sweet log entry', ['OPTIONAL', 'TAGS']);
    }
  }
});
```

This results in a log entry that looks like this:

```
[DEBUG][OPTIONAL][TAGS] Sweet log entry
```

There are three more log levels in addition to `debug`: `info`, `warn`, and `error`.

The log methods return a promise and resolve/reject according to whether an ok response was received from the server or not. I'm not sure that I would recommend waiting for log requests to resolve from a UX point of view, but it's there in case you need it.
