import { shallowMount } from '@vue/test-utils';
import InsertPollView from '@/views/InsertPollView.vue';
import CreatePoll from '@/components/CreatePoll.vue';
import CanvasEditorInsertForm from '@/components/CanvasEditorInsertForm.vue';
import { Api } from '@/helpers/api';
import flushPromises from 'flush-promises';

describe('InsertPollView.vue', () => {
  let apiMock: jest.SpyInstance;

  beforeEach(() => {
    apiMock = jest.spyOn(Api, 'getLTIData').mockImplementation(() => {
      return Promise.resolve({
        data: {}
      });
    });
  });
  afterEach(() => {
    apiMock.mockReset();
  });

  it('requests LTI payload with Hash', () => {
    const hash = 'BLAH' + Math.ceil(Math.random() * 1000);
    expect(apiMock).toHaveBeenCalledTimes(0);
    shallowMount(InsertPollView, { propsData: { hash } });
    expect(apiMock).toHaveBeenCalled();
    expect(apiMock).toBeCalledWith(hash);
  });

  it('has a create-poll component with API Token from LTI payload', async () => {
    const expectedToken = 'token.is.here';
    apiMock.mockImplementation(() => {
      return Promise.resolve({ data: { token: expectedToken } });
    });
    const wrapper = shallowMount(InsertPollView);
    expect(wrapper.find(CreatePoll).exists()).toBeFalsy();
    await flushPromises();
    expect(wrapper.find(CreatePoll).exists()).toBeTruthy();
    expect(wrapper.find(CreatePoll).props('apiToken')).toBe(expectedToken);
  });

  it('conditionally renders the canvas editor insert form after poll creation action', async () => {
    const wrapper = shallowMount(InsertPollView);
    wrapper.setData({ apiToken: 'a token' });
    expect(wrapper.find(CanvasEditorInsertForm).exists()).toBeFalsy();
    wrapper.find(CreatePoll).vm.$emit('createdPoll', 'somepollId');
    expect(wrapper.find(CanvasEditorInsertForm).exists()).toBeTruthy();
  });
  it('passes correct props to CanvasEditorInsertForm', async () => {
    const expectedFormActionURL = 'http://abc123.com';
    const expectedCourseId = '92456';
    const expectedPollId = '1441';
    const ltiResponse = {
      data: {
        ext_content_return_url: expectedFormActionURL,
        custom_canvas_course_id: expectedCourseId
      }
    };
    apiMock.mockImplementation(() => {
      return Promise.resolve(ltiResponse);
    });
    const wrapper = shallowMount(InsertPollView);
    await flushPromises();
    wrapper.setData({ apiToken: 'a token' });
    wrapper.find(CreatePoll).vm.$emit('createdPoll', expectedPollId);
    const editorInsertForm = wrapper.find(CanvasEditorInsertForm);
    expect(editorInsertForm.props('formActionURL')).toBe(expectedFormActionURL);
    expect(editorInsertForm.props('courseId')).toBe(expectedCourseId);
    expect(editorInsertForm.props('pollId')).toBe(expectedPollId);
  });
});
