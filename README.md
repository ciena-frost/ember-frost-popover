[ci-img]: https://img.shields.io/travis/ciena-frost/ember-frost-popover.svg "Travis CI Build Status"
[ci-url]: https://travis-ci.org/ciena-frost/ember-frost-popover

[cov-img]: https://img.shields.io/coveralls/ciena-frost/ember-frost-popover.svg "Coveralls Code Coverage"
[cov-url]: https://coveralls.io/github/ciena-frost/ember-frost-popover

[npm-img]: https://img.shields.io/npm/v/ember-frost-popover.svg "NPM Version"
[npm-url]: https://www.npmjs.com/package/ember-frost-popover

[![Travis][ci-img]][ci-url] [![Coveralls][cov-img]][cov-url] [![NPM][npm-img]][npm-url]

# ember-frost-popover

 * [Installation](#installation)
 * [API](#api)
 * [Examples](#examples)
 * [Contributing](#development)

## Installation
```
ember install ember-frost-popover
```

## API

| Interface | Attributes | Value | Description |
| ----------| ---------- | ----- | ----------- |
| Action | `close` | | Close the popover and optionally fire an external action |
| Option | `offset` | | The amount in pixels the popover should appear from the target (defaults to 10) |
| Option | `place` | | The location of the popover relative to the target |
| | | `top-left`, `top`, `top-right` ||
| | | `right-top`, `right`, `right-bottom` ||
| | | `bottom-right`, `bottom`, `bottom-left` ||
| | | `left-bottom`, `left`, `left-top` ||


## Examples

**template.hbs**

```hbs
{{#frost-button size='small' priority='primary'}}
  <div class='text'>Target</div>
  {{#frost-popover offset=10 place='bottom' as |close|}}
    Popover content
    {{#frost-button size="small" priority="tertiary" onClick=(action close (action 'controllerAction' 'my-value'))}}
      <div class="text">Close</div>
    {{/frost-button}}
  {{/frost-popover}}
{{/frost-button}}
```

**controller.js**

```js
actions: {
  controllerAction (value) {
    console.log(value) // 'my-value'
  }
}
```

## Development
### Setup
```
git clone git@github.com:ciena-frost/ember-frost-popover.git
cd ember-frost-popover
npm install && bower install
```

### Development Server
A dummy application for development is available under `ember-frost-popover/tests/dummy`.
To run the server run `ember server` (or `npm start`) from the root of the repository and
visit the app at http://localhost:4200.

### Testing
Run `npm test` from the root of the project to run linting checks as well as execute the test suite
and output code coverage.
