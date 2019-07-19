import { shallowMount } from '@vue/test-utils';
import EmbeddedPollView from '@/views/EmbeddedPollView.vue';
import PollViewSwitcher from '@/components/PollViewSwitcher.vue';
import { Api } from '@/helpers/api';
import flushPromises from 'flush-promises';

describe('EmbeddedPollView.vue', () => {
  let apiGetLtiMock: jest.SpyInstance;
  let apiGetPollDataMock: jest.SpyInstance;

  beforeEach(() => {
    apiGetLtiMock = jest.spyOn(Api, 'getLTIData').mockImplementation(() => {
      return Promise.resolve({
        data: {
          body: {}
        }
      });
    });
    apiGetPollDataMock = jest
      .spyOn(Api, 'getPollData')
      .mockImplementation(() => {
        return Promise.resolve({
          data: {
            poll: {
              prompt: 'blah',
              answerChoices: JSON.stringify([])
            }
          }
        });
      });
  });
  afterEach(() => {
    apiGetLtiMock.mockReset();
    apiGetPollDataMock.mockReset();
  });

  it('shows PollViewSwitcher component with token from lti data', async () => {
    const hash = 'BLAH' + Math.ceil(Math.random() * 1000);
    const expectedToken =
      'expectedtoken.efoiqayfeoienfaoinfda.lfjkbwe.aoiewnvoaienfawoiebgsdl';
    apiGetLtiMock.mockImplementation(() => {
      return Promise.resolve({
        data: {
          token: expectedToken
        }
      });
    });
    expect(apiGetLtiMock).toHaveBeenCalledTimes(0);
    const wrapper = shallowMount(EmbeddedPollView, { propsData: { hash } });
    expect(wrapper.find(PollViewSwitcher).exists()).toBeFalsy();
    expect(apiGetLtiMock).toHaveBeenCalled();
    expect(apiGetLtiMock).toBeCalledWith(hash);
    await flushPromises();
    expect(wrapper.find(PollViewSwitcher).exists()).toBeTruthy();
    expect(wrapper.find(PollViewSwitcher).props('apiToken')).toBe(
      expectedToken
    );
  });

  it('isInstructor on PollViewSwitcher if no student role found.', async () => {
    apiGetLtiMock.mockImplementation(() => {
      return Promise.resolve({
        data: {
          roles:
            'urn:lti:instrole:ims/lis/TeacherAssistant,urn:lti:instrole:fake/lis/Master-Painter'
        }
      });
    });
    const wrapper = shallowMount(EmbeddedPollView);
    expect(wrapper.find(PollViewSwitcher).exists()).toBeFalsy();
    await flushPromises();
    await flushPromises();
    expect(wrapper.find(PollViewSwitcher).exists()).toBeTruthy();
    expect(wrapper.find(PollViewSwitcher).props('isInstructor')).toBeTruthy();
  });
  it('isInstructor is false on PollViewSwitcher if a "Learner" role is found.', async () => {
    apiGetLtiMock.mockImplementation(() => {
      return Promise.resolve({
        data: {
          roles: 'urn:lti:instrole:ims/lis/Learner'
        }
      });
    });
    const wrapper = shallowMount(EmbeddedPollView);
    expect(wrapper.find(PollViewSwitcher).exists()).toBeFalsy();
    await flushPromises();
    await flushPromises();
    expect(wrapper.find(PollViewSwitcher).exists()).toBeTruthy();
    expect(wrapper.find(PollViewSwitcher).props('isInstructor')).toBeFalsy();
  });

  it('isInstructor is false on PollViewSwitcher if a "Student" role is found.', async () => {
    apiGetLtiMock.mockImplementation(() => {
      return Promise.resolve({
        data: {
          roles: 'Student'
        }
      });
    });
    const wrapper = shallowMount(EmbeddedPollView);
    expect(wrapper.find(PollViewSwitcher).exists()).toBeFalsy();
    await flushPromises();
    await flushPromises();
    expect(wrapper.find(PollViewSwitcher).exists()).toBeTruthy();
    expect(wrapper.find(PollViewSwitcher).props('isInstructor')).toBeFalsy();
  });
  it('shows PollViewSwitcher component and passes pollId prop', () => {
    const expectedPollId = 'asdf';
    const wrapper = shallowMount(EmbeddedPollView, {
      propsData: { pollId: expectedPollId }
    });
    wrapper.setData({ gotData: true });
    expect(wrapper.find(PollViewSwitcher).exists()).toBeTruthy();
    expect(wrapper.find(PollViewSwitcher).props('pollId')).toBe(expectedPollId);
  });
  it('passes PollViewSwitcher component the prompt', async () => {
    const expectedPollId = 'asdf';
    const expectedPrompt = 'foien';
    const wrapper = shallowMount(EmbeddedPollView, {
      propsData: { pollId: expectedPollId }
    });
    apiGetPollDataMock.mockImplementation(() => {
      return Promise.resolve({
        data: {
          poll: { prompt: expectedPrompt }
        }
      });
    });
    await flushPromises();
    wrapper.setData({ gotData: true });
    expect(wrapper.find(PollViewSwitcher).props('prompt')).toBe(expectedPrompt);
  });
  it('passes PollViewSwitcher component the answerChoices', async () => {
    const expectedPollId = 'asdf';
    const expectedAnswerChoices = [
      { value: 'John' },
      { value: 'Paul' },
      { value: 'George' },
      { value: 'Ringo' }
    ];
    const wrapper = shallowMount(EmbeddedPollView, {
      propsData: { pollId: expectedPollId }
    });
    apiGetPollDataMock.mockImplementation(() => {
      return Promise.resolve({
        data: {
          poll: { answer_choices: JSON.stringify(expectedAnswerChoices) }
        }
      });
    });
    await flushPromises();
    wrapper.setData({ gotData: true });
    expect(wrapper.find(PollViewSwitcher).props('answerChoices')).toEqual(
      expectedAnswerChoices
    );
  });
});
