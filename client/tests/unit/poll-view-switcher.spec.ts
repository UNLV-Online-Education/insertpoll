import { shallowMount } from '@vue/test-utils';
import PollViewSwitcher from '@/components/PollViewSwitcher.vue';
import RespondToPoll from '@/components/RespondToPoll.vue';
import PollResponseSummary from '@/components/PollResponseSummary.vue';
import { Api } from '@/helpers/api';
import flushPromises from 'flush-promises';

describe('PollViewSwitcher.vue', () => {
  const mockGetOwnResponse = jest.spyOn(Api, 'getOwnResponse');
  const mockGetAggregateData = jest.spyOn(Api, 'getAggregateData');
  beforeEach(() => {
    mockGetOwnResponse.mockReturnValue(Promise.resolve({ data: {} }));
    mockGetAggregateData.mockReturnValue(Promise.resolve({ data: {} }));
  });
  afterEach(() => {
    mockGetOwnResponse.mockClear();
    mockGetAggregateData.mockClear();
  });
  it('utilizes passed apiToken and pollId', async () => {
    const expectedApiToken = 'Bahlkbe';
    const expectedPollId = '130597098';
    expect(mockGetOwnResponse).not.toHaveBeenCalled();
    shallowMount(PollViewSwitcher, {
      propsData: { apiToken: expectedApiToken, pollId: expectedPollId }
    });
    expect(mockGetOwnResponse).toBeCalledWith(expectedApiToken, expectedPollId);
  });

  it('hides respondToPoll and PollResponseSummary before response data is loaded', async () => {
    const wrapper = shallowMount(PollViewSwitcher);
    expect(wrapper.contains(RespondToPoll)).toBeFalsy();
    expect(wrapper.contains(PollResponseSummary)).toBeFalsy();
  });

  it('shows RespondToPoll when user has not responded', async () => {
    const expectedApiToken = 'oinubuehf.joinefpqon.oaiwenf';
    const expectedPollId = 902375;
    const expectedPrompt = 'a prompt';
    const expectedAnswerChoices = [{ value: '' }];
    mockGetOwnResponse.mockReturnValueOnce(
      Promise.resolve({ data: { response: null } })
    );

    const wrapper = shallowMount(PollViewSwitcher, {
      propsData: {
        apiToken: expectedApiToken,
        pollId: expectedPollId,
        prompt: expectedPrompt,
        answerChoices: expectedAnswerChoices
      }
    });
    await flushPromises();
    expect(wrapper.contains(RespondToPoll)).toBeTruthy();
    expect(wrapper.find(RespondToPoll).props('apiToken')).toBe(
      expectedApiToken
    );
    expect(wrapper.find(RespondToPoll).props('pollId')).toBe(expectedPollId);
    expect(wrapper.find(RespondToPoll).props('prompt')).toBe(expectedPrompt);
    expect(wrapper.find(RespondToPoll).props('answerChoices')).toBe(
      expectedAnswerChoices
    );
    expect(wrapper.contains(PollResponseSummary)).toBeFalsy();
  });

  it('hides PollResponseSummary before response data is loaded', async () => {
    const wrapper = shallowMount(PollViewSwitcher);
    expect(wrapper.contains(PollResponseSummary)).toBeFalsy();
  });
  it('shows PollResponseSummary with response data when user has responded', async () => {
    const expectedResponseData = { value: 0 };
    const expectedPrompt = 'some prompt here';
    const expectedAnswerChoices = [{ value: '' }];
    const expectedAggregateResponses = [{ value: '0', count: 10000 }];
    mockGetOwnResponse.mockReturnValueOnce(
      Promise.resolve({ data: { response: expectedResponseData } })
    );
    mockGetAggregateData.mockReturnValueOnce(
      Promise.resolve({ data: { responses: expectedAggregateResponses } })
    );
    const wrapper = shallowMount(PollViewSwitcher, {
      propsData: {
        prompt: expectedPrompt,
        answerChoices: expectedAnswerChoices
      }
    });
    await flushPromises();
    expect(wrapper.contains(PollResponseSummary)).toBeTruthy();
    expect(wrapper.find(PollResponseSummary).props('ownResponse')).toBe(
      expectedResponseData
    );
    expect(wrapper.find(PollResponseSummary).props('prompt')).toBe(
      expectedPrompt
    );
    expect(wrapper.find(PollResponseSummary).props('answerChoices')).toBe(
      expectedAnswerChoices
    );
    expect(wrapper.find(PollResponseSummary).props('aggregateResponses')).toBe(
      expectedAggregateResponses
    );
    expect(wrapper.contains(RespondToPoll)).toBeFalsy();
  });
  it('shows PollResponseSummary if user is instructor', async () => {
    mockGetOwnResponse.mockReturnValueOnce(
      Promise.resolve({ data: { response: null } })
    );
    const wrapper = shallowMount(PollViewSwitcher, {
      propsData: {
        isInstructor: true
      }
    });
    expect(wrapper.contains(PollResponseSummary)).toBeFalsy();
    expect(wrapper.contains(RespondToPoll)).toBeFalsy();
    await flushPromises();
    expect(wrapper.contains(PollResponseSummary)).toBeTruthy();
    expect(wrapper.contains(RespondToPoll)).toBeFalsy();
  });

  it('sets own response and new Aggregate Responses when responded event is emitted', async () => {
    const expectedResponseObject = { response: { someKey: 'blah' } };
    const expectedAggregateObject = { response: { aKey: 'blah4' } };
    mockGetOwnResponse.mockReturnValueOnce(
      Promise.resolve({ data: { response: null } })
    );
    mockGetOwnResponse.mockReturnValueOnce(
      Promise.resolve({ data: { response: expectedResponseObject } })
    );
    mockGetAggregateData.mockReturnValueOnce(
      Promise.resolve({ data: { responses: null } })
    );
    mockGetAggregateData.mockReturnValueOnce(
      Promise.resolve({ data: { responses: expectedAggregateObject } })
    );
    const wrapper = shallowMount(PollViewSwitcher);
    await flushPromises();
    expect(wrapper.contains(RespondToPoll)).toBeTruthy();
    expect(wrapper.contains(PollResponseSummary)).toBeFalsy();

    wrapper.find(RespondToPoll).vm.$emit('responded', {});
    await flushPromises();

    expect(mockGetAggregateData).toHaveBeenCalled();
    expect(wrapper.vm.$data.currentResponse).toBe(expectedResponseObject);
    expect(wrapper.vm.$data.aggregateResponses).toBe(expectedAggregateObject);
    expect(wrapper.contains(RespondToPoll)).toBeFalsy();
    expect(wrapper.contains(PollResponseSummary)).toBeTruthy();
  });
});
