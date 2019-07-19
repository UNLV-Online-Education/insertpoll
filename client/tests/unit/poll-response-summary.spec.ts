import { shallowMount } from '@vue/test-utils';
import PollResponseSummary from '@/components/PollResponseSummary.vue';
import flushPromises from 'flush-promises';

describe('PollResponseSummary.vue', () => {
  it('shows total responses based on addition of all aggregate responses', async () => {
    const wrapper = shallowMount(PollResponseSummary, {
      propsData: {
        ownResponse: {
          value: 0
        },
        answerChoices: ['fake choice 1', 'fake choice 2'],
        aggregateResponses: [{ value: 0, count: 4 }, { value: 1, count: 8 }]
      }
    });
    await flushPromises();
    expect(wrapper.find('h3#classResponses').text()).toBe(
      'Class Responses (Total: ' + (4 + 8) + ')'
    );
  });
  it('shows 0 total responses when none have responded', async () => {
    const wrapper = shallowMount(PollResponseSummary, {
      propsData: {
        ownResponse: null,
        answerChoices: ['fake choice 1', 'fake choice 2'],
        aggregateResponses: []
      }
    });
    await flushPromises();
    expect(wrapper.find('h3#classResponses').text()).toBe(
      'Class Responses (Total: ' + 0 + ')'
    );
  });
  it('shows own response if there is one', () => {
    const response = '1';
    const expectedAnswerValue = 'Harry';
    const wrapper = shallowMount(PollResponseSummary, {
      propsData: {
        ownResponse: {
          value: response
        },
        answerChoices: ['fake choice 1', expectedAnswerValue],
        aggregateResponses: [{ count: 1 }]
      }
    });
    expect(wrapper.find('#ownResponse').text()).toBe(
      'You said: ' + expectedAnswerValue
    );
  });
  it('Does not show own response if there is not one', () => {
    const wrapper = shallowMount(PollResponseSummary, {
      propsData: {
        ownResponse: null,
        answerChoices: [''],
        aggregateResponses: [{ count: 1 }]
      }
    });
    expect(wrapper.contains('#ownResponse')).toBeFalsy();
  });

  it('shows prompt in H2 tag', () => {
    const expectedPrompt = 'something';
    const wrapper = shallowMount(PollResponseSummary, {
      propsData: {
        ownResponse: {
          value: 0
        },
        prompt: expectedPrompt,
        answerChoices: ['test'],
        aggregateResponses: [{ count: 1 }]
      }
    });
    expect(wrapper.find('h2').text()).toBe(expectedPrompt);
  });
  it('shows UL of answer choices', () => {
    const expectedAnswerChoice1 = 'test';
    const expectedAnswerChoice2 = 'test22';
    const wrapper = shallowMount(PollResponseSummary, {
      propsData: {
        ownResponse: {
          value: 0
        },
        prompt: 'blah',
        answerChoices: [expectedAnswerChoice1, expectedAnswerChoice2],
        aggregateResponses: [{ count: 1 }]
      }
    });
    const listItems = wrapper.findAll('#answerChoices li');
    expect(listItems.length).toBe(2);
    expect(listItems.at(0).text()).toBe(expectedAnswerChoice1);
    expect(listItems.at(1).text()).toBe(expectedAnswerChoice2);
  });
});
