[ci-img]: https://img.shields.io/travis/ciena-frost/ember-frost-popover.svg "Travis CI Build Status"
[ci-url]: https://travis-ci.org/ciena-frost/ember-frost-popover

[cov-img]: https://img.shields.io/coveralls/ciena-frost/ember-frost-popover.svg "Coveralls Code Coverage"
[cov-url]: https://coveralls.io/github/ciena-frost/ember-frost-popover

[npm-img]: https://img.shields.io/npm/v/ember-frost-popover.svg "NPM Version"
[npm-url]: https://www.npmjs.com/package/ember-frost-popover

[ember-observer-badge]: http://emberobserver.com/badges/ember-frost-popover.svg "Ember Observer score"
[ember-observer-badge-url]: http://emberobserver.com/addons/ember-frost-popover

[ember-img]: https://img.shields.io/badge/ember-2.3+-orange.svg "Ember 2.3+"

[bithound-img]: https://www.bithound.io/github/ciena-frost/ember-frost-popover/badges/score.svg "bitHound"
[bithound-url]: https://www.bithound.io/github/ciena-frost/ember-frost-popover


# ember-frost-popover

###### Dependencies

![Ember][ember-img]
[![NPM][npm-img]][npm-url]

###### Health

[![Travis][ci-img]][ci-url]
[![Coveralls][cov-img]][cov-url]

###### Security

[![bitHound][bithound-img]][bithound-url]

###### Ember Observer score
[![EmberObserver][ember-observer-badge]][ember-observer-badge-url]


## Installation
```
ember install ember-frost-popover
```

## API

| Interface | Attributes | Value | Description |
| ----------| ---------- | ----- | ----------- |
| Required | `target` |  | The selector string of the target that activates the popover |
| Action | `close` | | Close the popover and optionally fire an external action|
| Event | `onOpen`| | Fires whenever the popover is opened|
| Event | `onClose` | | Fires whenever the popover has been closed
| Event | `onBeforeClose` | | Function that is run before closing the drop. If the function returns `false`, the closing of the drop will be prevented. Useful if you only want to programmatically close the drop. |
| Option | `className` | `drop-theme-arrows-bounce` | CSS Naming Prefix to Popover Elements|
| Option | `offset` | `<offsetTop>  <offsetRight>`. Example:  `0 10px` | The amount in pixels the popover should appear from the target (defaults to `0 0`) |
| Option | `position` | `top left`, `left top`, `left`, `left bottom`, `bottom left`, `bottom`, `bottom right`, `right bottom`, `right`, `right top`, `top right`, `top` | The location of the popover relative to the target. When `auto` is specified, it will dynamically reorient the popover. For example, if position is `auto left`, the popover will display to the left when possible, otherwise it will display right. (defaults to `bottom`) |
| Option | `event` | `click`, `hover`, `focus`, `always`| The event that will trigger the popover (defaults to on `click`)
| Option | `constrainToWindow`| | If set to true, uses Tether's constraints list to flip the drop when it would otherwise be outside the viewport. |
| Option | `constrainToScrollParent`| | Similar to `constrainToWindow` but for the target element's first scroll parent: the first parent that has `overflow: auto` or `overflow: scroll` set, or the body, whichever comes first.|
| Option | `remove` | | Removes the popover from the DOM when closed (default true)|

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
