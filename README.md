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
| Option | `offset` | | The amount in pixels the popover should appear from the target (defaults to `10`) |
| Option | `position` | `top`,`right`,`bottom`,`left`, `auto`| The location of the popover relative to the target. When `auto` is specified, it will dynamically reorient the popover. For example, if position is `auto left`, the popover will display to the left when possible, otherwise it will display right. (defaults to `bottom`) |
| Option | `closest` | boolean  | When true uses JQuery's [closest function](https://api.jquery.com/closest/). Otherwise just uses main selector `$(<target>)` (defaults to `false`).  |
| Option | `excludePadding` | boolean  | When true removes the padding from position calculations (defaults to `false`).|
| Option | `event |  | The event that will trigger the popover (defaults to on `click`). Uses [on()](http://api.jquery.com/on/)|
| | |  ||


## Examples

**template.hbs**

```hbs
{{#frost-button size='small' priority='primary' class='button'}}
  <div class='text'>Target</div>
  {{#frost-popover target='.button' closest=true offset=10 position='bottom' as |close|}}
    Popover content
    {{#frost-button size="small" priority="tertiary" onClick=(action close)}}
      <div class="text">Close</div>
    {{/frost-button}}
  {{/frost-popover}}
{{/frost-button}}

<div class='target'>
frost-popover testbed
</div>
{{#frost-popover target='.target'}}
  <span class='inside'>Inside Popover</span>
{{/frost-popover}}


<div class='lefty'>
left testbed 5
{{#frost-popover target='.lefty' closest=true position='right' excludePadding=true event='mouseenter mouseleave'}}
  <span class='inside'>On Hover</span>
{{/frost-popover}}
</div>
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
