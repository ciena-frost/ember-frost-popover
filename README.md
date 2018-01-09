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
| Action | `close` | | Close the popover and optionally fire an external action |
| Option | `closest` | boolean  | When true uses JQuery's [closest function](https://api.jquery.com/closest/). Otherwise just uses main selector `$(<target>)` (defaults to `false`).  |
| Option | `delay` | number | Delay the open of the popover if provided, unit in ms.|
| Option | `event` |  | The event that will trigger the popover (defaults to on `click`). Uses [on()](http://api.jquery.com/on/)|
| Option | `excludePadding` | boolean  | When true removes the padding from position calculations (defaults to `false`).|
| Option | `handlerIn` |  | The event that will open the popover (replaces the `event` when `handlerOut` is also set). Uses [on()](http://api.jquery.com/on/)|
| Option | `handlerOut` |  | The event that will close the popover (replaces the `event` when `handlerIn` is also set). Uses [on()](http://api.jquery.com/on/)|
| Option | `hideDelay` | number | Delay the close of the popover if provided, unit in ms.|
| Option | `offset` | | The amount in pixels the popover should appear from the target (defaults to `10`) |
| Option | `position` | `top`,`right`,`bottom`,`left`, `auto`| The location of the popover relative to the target. When `auto` is specified, it will dynamically reorient the popover. For example, if position is `auto left`, the popover will display to the left when possible, otherwise it will display right. (defaults to `bottom`) |
| Option | `resize` | | If set to false, will prevent the browser from resizing at the edges of the viewport. This preserves the *expand to fit content* behavior of `width: auto`. It defaults to true. |
| Option | `stopPropagation` | | If set to true event handlers will call `event.stopPropagation()` |
| Option | `target` |  | The selector string of the target that activates the popover |
| Option | `viewport`| | The selector for the viewport. Defaults to 'body' |

## Specifying Target

If the `frost-popover` component is placed next to the `target`, be careful to use a selector that will uniquely
identify the `target`. If it is nested inside the `target`, you can set `closest` to true which will search the
nearest ancestor from the `popover`.

### Hover Behavior

The `popover` will by default maintain its visible state when hovered.
If the events are `mouseenter` and `mouseleave`, adding a `hideDelay` makes hovering over the popover much easier
for the user.

### A Note On Positioning

The `popover` is displayed using `absolute` positioning. The `target`'s coordinates are determined from the `offsets`
from its parent's container. In most cases, the `target` will occupy the same stacking context as the `popover`.
However, if the `target` has `absolute` positioning and the `popover` is nested, they won't share the same stacking
context and the `popover`'s position will be erroneous. If the `target` must be `absolute`, then it's best to place
the `popover` next to it.

**template.hbs**

```hbs
{{#frost-button hook='popoverButton' size='small' priority='primary' class='button'}}
  <div class='text'>Target</div>
  {{#frost-popover target='.button' closest=true offset=10 position='bottom' as |close|}}
    Popover content
    {{#frost-button hook='closeButton' size="small" priority="tertiary" onClick=(action close)}}
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
