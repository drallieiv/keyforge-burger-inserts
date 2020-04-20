import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | house-ratio-bar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('useColor', true);
    let data = [0.2, 0.5, 0.3];
    this.set('housesRatioBarData', data);
    await render(hbs`<HouseRatioBar @data={{this.housesRatioBarData}} @useColor={{this.useColor}}/>`);

    assert.equal(this.element.textContent.trim(), '');
  });
});
