# ember-cli-remote-logger

[![Build Status](https://travis-ci.org/robbiepitts/ember-cli-remote-logger.svg?branch=master)](https://travis-ci.org/robbiepitts/ember-cli-remote-logger)

Gives your ember-cli app remote logging capabilities.

## Installation

```
ember install ember-cli-remote-logger
ember install ember-network
```

## Usage

This addon will look up your application adapter and use it to build a request
to send the log entries with. Your adapter's host, namespace, and headers are
included in the request. In addition to your adapter's headers a `Content-Type`
of `text/plain` is added and the body of the request is, accordingly,
plain text. The request is sent using `ember-network/fetch`, so it's FastBoot
compatible.

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

There are three more log levels in addition to `debug`: `info`, `warn`, and
`error`.

The log methods return a promise and resolve/reject according to whether an ok
response was received from the server or not. I'm not sure that I would
recommend waiting for log requests to resolve from a UX point of view, but it's
there in case you need it.

### Customization

Every part of the logging endpoint url is individually customizable (or you can
override the whole URL itself). Simply extend the `remote-logger` service and
override any of the following properties to achieve the desired effect. The
`url` property, if left alone, is dynamically constructed thusly:

```
{host}/{namespace}/{pathPrefix}
```

These properties, except for `pathPrefix` which defaults to "log", will be
inferred from your application adapter. If any property is absent the url will
still be constructed properly. For example, if `host` is absent but `namespace`
is present, the url may look something like `/api/v1/log`. Or if `namespace` is
absent but everything else is present then the url may look something like
`https://www.example.com/log`.

As stated before, the following properties can be altered like so:

```js
import RemoteLogger from 'ember-cli-remote-logger/services/remote-logger';

export default RemoteLogger.extend({
  host: 'https://www.example.com',
  namespace: 'api',
  pathPrefix: 'log-entries'
});

// or

export default RemoteLogger.extend({
  url: 'https://www.example.com/api/log-entries'
});
```

Headers are also customizable. The are inferred by your application adapter but
can be overridden in the same way as above. The `headers` property may be a
computed property and should be a POJO. The only thing that you can't change
about headers is `Content-Type`, which will always be `text/plain` even if
you set that.

#### Separate URLs for each log level

You can opt-in to this feature by setting `useDifferentEndpoints` to `true`.
This will construct URLs the same as above but will append the log level to the
url:

```
{host}/{namespace}/{pathPrefix}/{logLevel}
```

### FastBoot

`fetch` requires a full URL, including the protocol. This means you need to
either define the
[`url`](http://emberjs.com/api/data/classes/DS.RESTAdapter.html#property_host)
property on your application adapter or override the `url` property on the
`remote-logger` service:

```js
import RemoteLogger from 'ember-cli-remote-logger/services/remote-logger';

export default RemoteLogger.extend({
  url: 'https://www.example.com/sweet/url'
});
```
