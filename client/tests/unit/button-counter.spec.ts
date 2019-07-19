import { shallowMount } from '@vue/test-utils';
import ButtonCounter from '@/components/ButtonCounter.vue';

describe('ButtonCounter.vue', () => {
  it('has a button with text click', () => {
    const wrapper = shallowMount(ButtonCounter, {});
    expect(wrapper.contains('button')).toBe(true);
    expect(wrapper.find('button').text()).toBe('Click');
  });
  it('has number of clicks text', () => {
    const wrapper = shallowMount(ButtonCounter, {});
    expect(wrapper.contains('p')).toBe(true);
    expect(wrapper.find('p').text()).toBe('Number of clicks:');
  });
  it('without initialCount property defaults to 0', () => {
    const wrapper = shallowMount(ButtonCounter);
    expect(wrapper.find('#counter').text()).toBe((0).toString());
  });
  it('number of clicks displayed matches initialCount property', () => {
    const expectedCount = Math.ceil(Math.random() * 1000);
    const wrapper = shallowMount(ButtonCounter, {
      propsData: {
        initialCount: expectedCount
      }
    });
    expect(wrapper.find('#counter').text()).toBe(expectedCount.toString());
  });
  it('clicking the button increases the count by 1', () => {
    const startingCount = Math.ceil(Math.random() * 1000);
    const wrapper = shallowMount(ButtonCounter, {
      propsData: {
        initialCount: startingCount
      }
    });
    expect(wrapper.find('#counter').text()).toBe(startingCount.toString());
    wrapper.find('button').trigger('click');
    expect(wrapper.find('#counter').text()).toBe((startingCount + 1).toString());
  });
});
