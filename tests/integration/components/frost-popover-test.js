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

      this.render(hbs`
<div class='target'>
frost-popover testbed
</div>
{{#frost-popover target='.target'}}
  <span class='inside'>Inside</span>
{{/frost-popover}}
      `)
      expect(this.$()).to.have.length(1)
    })

    it('clicks', function (done) {
      this.timeout(5000)
      this.render(hbs`
<div id='foo' class='target'>
frost-popover testbed
</div>
{{#frost-popover target='#foo'}}
  <span class='inside'>Inside</span>
{{/frost-popover}}
      `)
      Ember.run.later(function () {
        this.$('#foo').click()
      }, 1000)

      Ember.run.later(function () {
        expect(this.$('.visible')).to.have.length(1)
        done()
      }, 3000)
    })
  }
)
