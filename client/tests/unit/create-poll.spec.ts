import { shallowMount, mount } from '@vue/test-utils';
import CreatePoll from '@/components/CreatePoll.vue';
import { Api } from '@/helpers/api';
import flushPromises from 'flush-promises';

describe('InsertPoll.vue', () => {
  const canvasURL = 'https://blah.com/';
  const apiURL = 'https://superapi.net/';
  process.env = Object.assign(process.env, {
    VUE_APP_API_URL: apiURL,
    VUE_APP_CANVAS_URL: canvasURL
  });
  const createPollSpy = jest.spyOn(Api, 'createPoll');
  afterEach(() => {
    createPollSpy.mockReset();
  });

  it('has instructions p tags', () => {
    const wrapper = shallowMount(CreatePoll);
    expect(
      wrapper.find('.insert-poll-container p#main-instructions').text()
    ).toBe(
      'Use the form below to insert an ungraded multiple-choice poll into your page.'
    );
    expect(
      wrapper.find('.insert-poll-container p#answer-choice-instructions').text()
    ).toBe('Enter up to six choices for poll-takers to choose from.');
  });

  it('has CreatePoll form with labelled input fields', () => {
    const wrapper = shallowMount(CreatePoll);
    expect(wrapper.contains('form#createPoll')).toBe(true);
  });

  it('posts prompt and answer choices to poll creation api when form is submitted', () => {
    createPollSpy.mockImplementation(() => {
      return Promise.resolve({ data: { data: { id: 'blah' } } });
    });
    const expectedPrompt = 'Blahblabhlbha';
    const expectedApiToken = 'eweinsidn.aoiwebfoeub.poqiupwihfa';
    const expectedAnswerChoices = [
      '2',
      'three',
      'red',
      'orange',
      'blue',
      'grape'
    ];
    const wrapper = shallowMount(CreatePoll, {
      propsData: { apiToken: expectedApiToken }
    });
    wrapper.setData({ prompt: expectedPrompt });
    wrapper.setData({ answerChoices: expectedAnswerChoices });
    const createPollForm = wrapper.find('form#createPoll');
    expect(createPollSpy).not.toBeCalled();
    createPollForm.trigger('submit');
    expect(createPollSpy).toBeCalled();
    expect(createPollSpy).toHaveBeenCalledWith(
      expectedApiToken,
      expectedPrompt,
      expectedAnswerChoices
    );
  });
  it('emits Poll Id with createdPoll event when submitted', async () => {
    const expectedPollId = 78891;
    jest.spyOn(Api, 'createPoll').mockImplementation(() => {
      return Promise.resolve({ data: { data: { id: expectedPollId } } });
    });
    const wrapper = shallowMount(CreatePoll);
    const createPollForm = wrapper.find('form#createPoll');
    createPollForm.trigger('submit');
    await flushPromises();
    expect(wrapper.emitted().createdPoll).toBeTruthy();
    expect(wrapper.emitted().createdPoll[0][0]).toBe(expectedPollId);
  });
  it('renders 6 empty input fields', () => {
    const wrapper = shallowMount(CreatePoll);
    expect(wrapper.contains('fieldset#answer-choices')).toBeTruthy();
    const inputs = wrapper.findAll('fieldset#answer-choices input[type=text]');
    expect(inputs.length).toBe(6);
    expect(inputs.at(0).attributes('name')).toBe('answer-choice-1');
    expect(inputs.at(1).attributes('name')).toBe('answer-choice-2');
    expect(inputs.at(2).attributes('name')).toBe('answer-choice-3');
    expect(inputs.at(3).attributes('name')).toBe('answer-choice-4');
    expect(inputs.at(4).attributes('name')).toBe('answer-choice-5');
    expect(inputs.at(5).attributes('name')).toBe('answer-choice-6');

    const labels = wrapper.findAll('fieldset#answer-choices label');
    expect(labels.length).toBe(6);
    expect(labels.at(0).text()).toBe('Answer Choice 1:');
    expect(labels.at(1).text()).toBe('Answer Choice 2:');
    expect(labels.at(2).text()).toBe('Answer Choice 3:');
    expect(labels.at(3).text()).toBe('Answer Choice 4:');
    expect(labels.at(4).text()).toBe('Answer Choice 5:');
    expect(labels.at(5).text()).toBe('Answer Choice 6:');
  });
  it('renders textarea with label', () => {
    const wrapper = shallowMount(CreatePoll);
    expect(wrapper.contains('fieldset#prompt-section textarea')).toBeTruthy();
    const input = wrapper.find('fieldset#prompt-section textarea');
    expect(input.attributes('name')).toBe('prompt');
    expect(input.attributes('placeholder')).toBe('Enter poll question');
    const label = wrapper.find('fieldset#prompt-section label');
    expect(label.attributes('for')).toBe('prompt');
  });
  it('ignores empty answer choice fields to poll creation api when form is submitted', () => {
    createPollSpy.mockImplementation(() => {
      return Promise.resolve({ data: { data: { id: 'blah' } } });
    });
    const answerChoices = [
      'red',
      '',
      '  blue',
      ' ',
      'grape',
      '      ',
      'kiwi  ',
      '	'
    ];
    const expectedAnswerChoices = ['red', 'blue', 'grape', 'kiwi'];
    const wrapper = shallowMount(CreatePoll, { propsData: { apiToken: '' } });
    wrapper.setData({ answerChoices });
    const createPollForm = wrapper.find('form#createPoll');
    expect(createPollSpy).not.toBeCalled();
    createPollForm.trigger('submit');
    expect(createPollSpy).toBeCalledWith('', '', expectedAnswerChoices);
  });
});
