import { shallowMount } from '@vue/test-utils';
import RespondToPoll from '@/components/RespondToPoll.vue';
import { Api } from '@/helpers/api';
import flushPromises from 'flush-promises';

describe('RespondToPoll.vue', () => {
  it('displays the prompt H2 tag', async () => {
    const pollId = '50892u';
    const expectedToken = 'afiweubf293.oewinfew.owiefneoigb';
    const expectedPrompt = 'This is a poll question.';
    const wrapper = shallowMount(RespondToPoll, {
      propsData: { prompt: expectedPrompt }
    });
    expect(wrapper.find('h2#prompt').text()).toBe(expectedPrompt);
  });

  it('displays the answer choices as radio buttons', async () => {
    const expectedAnswerChoices = ['red', 'blue', 'grape'];
    const wrapper = shallowMount(RespondToPoll, {
      propsData: { answerChoices: expectedAnswerChoices }
    });
    expectedAnswerChoices.map((elem, index) => {
      expect(
        wrapper
          .findAll('div#answerChoices li label')
          .at(index)
          .text()
      ).toBe(elem);
      expect(
        wrapper
          .findAll('div#answerChoices li label input')
          .at(index)
          .element.getAttribute('value')
      ).toBe('' + index);
      expect(
        wrapper
          .findAll('div#answerChoices li label input')
          .at(index)
          .element.getAttribute('name')
      ).toBe('answer_choice');
    });
  });

  it('calls the API when form is submitted', async () => {
    const pollId = '50892u';
    const expectedToken = 'ewuoiensfoeinasa.owiebnoaibg.asdfi';
    const expectedAnswerChoices = ['red'];

    const apiSaveResponseMock = jest
      .spyOn(Api, 'saveResponse')
      .mockImplementation(() => {
        return Promise.resolve({});
      });

    const wrapper = shallowMount(RespondToPoll, {
      propsData: {
        pollId,
        apiToken: expectedToken,
        answerChoices: expectedAnswerChoices
      }
    });
    await flushPromises();
    expect(apiSaveResponseMock).not.toHaveBeenCalled();
    wrapper.find('input[type=radio]').element.click();
    wrapper.find('form').trigger('submit.prevent');
    expect(apiSaveResponseMock).toHaveBeenCalled();
    expect(apiSaveResponseMock).toHaveBeenCalledWith(expectedToken, pollId, 0);
  });

  it('emits the saved response as an event', async () => {
    const expectedApiResponse = {
      response: {
        id: 5,
        poll_id: 3,
        course_id: 160,
        user_id: '234',
        value: '2',
        poll: {
          id: 3,
          prompt: 'Which semester?',
          answer_choices: '["red"]'
        }
      }
    };
    jest.spyOn(Api, 'saveResponse').mockImplementation(() => {
      return Promise.resolve({
        response: {
          id: 5,
          poll_id: 3,
          course_id: 160,
          user_id: '234',
          value: '2',
          poll: {
            id: 3,
            prompt: 'Which semester?',
            answer_choices: '["red"]'
          }
        }
      });
    });
    const wrapper = shallowMount(RespondToPoll);
    expect(wrapper.emitted().responded).toBeUndefined();
    wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(wrapper.emitted().responded.length).toBe(1);
    expect(wrapper.emitted().responded[0][0]).toEqual(expectedApiResponse);
  });
});
