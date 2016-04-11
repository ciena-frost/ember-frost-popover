import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describeComponent(
  'frost-popover',
  'Integration: EmberFrostPopoverComponent',
  {
    integration: true
  },
  function () {
    it('renders', function () {
      // Set any properties with this.set('myProperty', 'value')
      // Handle any actions with this.on('myAction', function (val) { ... })
      // Template block usage:
      // this.render(hbs`
      //   {{#frost-popover}}
      //     template content
      //   {{/frost-popover}}
      // `)

      this.render(hbs`{{frost-popover}}`)
      expect(this.$()).to.have.length(1)
    })
  }
)
