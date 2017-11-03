# 6.0.0 (2017-11-02)

## WARNING: THIS REVERTS EMBER CLI 2.16.2 BACK TO 2.12.3

We apologize for this change. Unfortunately, due to the internal needs of our organization this became a required action.

The 2.16.2 changes are now located in the `ember-cli-2.16.2` branch and will hopefully be contained in a versioned release again in the future.

# 5.0.0 (2017-10-25)
* **Updated** to Ember CLI 2.16.2 and babel 6
* **Updated** to using ember-decorators which replaces ember-computed-decorators
* **Updated** dependencies
* **Updated** pr-bumber to version 3
* **Updated** CONTRIBUTING.md file
* **Updated** to using Ember Javascript Modules API https://github.com/ember-cli/ember-rfc176-data
* **Updated** blueprints to latest versions of dependencies
* **Updated** to use chrome headless in Travis CI
* **Updated** to using Node 8.1.2 NPM 5
* **Added** eslint-plugin-ember to enforce Ember Javascript Modules API syntax
* **Removed** running of code coverage until issue is resolved with ember-cli-code-coverage: https://github.com/kategengler/ember-cli-code-coverage/issues/133
* **Removed** running of ember-try its-2.12 scenario until issue is resolved: https://github.com/ember-cli/ember-try/issues/148

# 4.4.1 (2017-10-23)
* **Updated** testing dependencies
* **Removed** no longer needed `bower.json` and `.bowerrc`


# 4.4.0 (2017-10-22)
* **Added** delay attribute to support a delay display option.

# 4.3.0 (2017-10-17)
* Add `handlerIn` and `handlerOut` options that override `event`.
  * Fixes hover use case and mirrors JQuery's `.hover()` https://api.jquery.com/hover/


# 4.2.14 (2017-08-25)
* **Changed** handling of display/hide


# 4.2.13 (2017-08-25)
* **Modified** onDisplay and onHide now pass the current object as a parameter


# 4.2.12 (2017-08-22)
* **Added** onDisplay function to be run after when the popover is made visible.
* **Added** onHide function to be run after when the popover is no longer visible.


# 4.2.11 (2017-08-10)
* **Updated** ember-cli 2.12.3 inter-dependencies
* **Updated** pin `ember-cli-htmlbars-inline-precompile` per issue: https://github.com/ciena-frost/ember-frost-core/issues/488

# 4.2.10 (2017-07-11)
* Upgrade `ember-cli` to `2.12.3`

# 4.2.9 (2017-05-10)
* **Updated** secure auth token


# 4.2.8 (2017-04-21)
* **Removed** unecessary dependencies in blueprint

# 4.2.7 (2017-04-21)
* **Added** blueprint check


# 4.2.6 (2017-04-06)

* **Fixed** guarded against `isDestroyed|isDestroying` so tests on fast machines don't fail
* **Fixed** placement of run blocks so that async handlers are executed in a run block


# 4.2.5 (2017-03-23)
* **Fixed** `ember` and `ember-cli` dependencies

# 4.2.4
* **Updated** the travis.yml and package.json to run code coverage

# 4.2.3
* **Updated** to use latest pr-bumper which supports being able to set a PR to `none` when publishing a new version is not desired.

# 4.2.2
* **Updated** integration and unit tests to remove the deprecated use of `describeComponent()`


# 4.2.1

* **Updated** build to disable prototype extensions.
* **Updated** CI to test in Chrome as well as Firefox.


# 4.2.0

* **Removed** lodash from dependencies.


# 4.1.0

* **Added** additional builds to CI to make sure addon works with latest versions of Ember.
* **Removed** files from npm package that aren't necessary (all of the various config files).
* **Updated** dependencies to latest versions.


# 4.0.2
Updated ember-lodash-shim to ~1.0.1



# 4.0.1
* **Removed** `ember-one-way-controls`



# 4.0.0
* Updated `ember-frost-core` to `^1.0.0`



# 3.0.0
**upgrade** to node 6.x



# 2.0.2

* **Added** `ember-frost-core` to blueprints.



# 2.0.1
Added badges to the README
trying to fix code coverage reporting


# 2.0.0
Upgrade Ember to v2.8 for LTS. 
Fixed tests and linting after upgrade.

# 1.2.1
- Update environment.js to fix demo

# 1.2.0
No CHANGELOG section found in Pull Request description.
Use a `# CHANGELOG` section in your Pull Request description to auto-populate the `CHANGELOG.md`

# 1.1.0
No CHANGELOG section found in Pull Request description.
Use a `# CHANGELOG` section in your Pull Request description to auto-populate the `CHANGELOG.md`

# 1.0.0
- new absolute position popover
- css animation
- Goes to target element

# 0.1.0

* **Changed** from `ember-lodash` to `ember-lodash-shim` and upgraded dependencies.

# 0.0.2

* **Fixed** deprecation warning from Ember 2.6.0 to stop using `didInitAttrs` hook and instead use `init`.

