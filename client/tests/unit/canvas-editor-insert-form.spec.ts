import { shallowMount, mount } from '@vue/test-utils';
import CanvasEditorInsertForm from '@/components/CanvasEditorInsertForm.vue';
import FormSubmitter from '@/helpers/FormSubmitter.ts';

describe('InsertPoll.vue', () => {
  const canvasURL = 'https://blah.com/';
  const apiURL = 'https://superapi.net/';
  let formSubmitterMock: jest.SpyInstance;
  beforeEach(() => {
    formSubmitterMock = jest
      .spyOn(FormSubmitter, 'submitForm')
      .mockImplementation(() => {
        return;
      });
  });
  afterEach(() => {
    formSubmitterMock.mockReset();
  });
  process.env = Object.assign(process.env, {
    VUE_APP_API_URL: apiURL,
    VUE_APP_CANVAS_URL: canvasURL
  });
  it('has the correct hidden inputs and computed values', () => {
    const expectedCourseId = 98315;
    const expectedPollId = 21356;
    const expectedFormActionURL = 'http://jonralphio.com/';
    const expectedContentItems = encodeURI(
      `{"@context":"http://purl.imsglobal.org/ctx/lti/v1/ContentItem","@graph":[{"@type":"ContentItem","@id":"${canvasURL}courses/${expectedCourseId}/external_tools/retrieve","url":"${canvasURL}courses/${expectedCourseId}/external_tools/retrieve?display=borderless&url=${apiURL}launch?pollId=${expectedPollId}","title":"test","text":"text","mediaType":"text/html","placementAdvice":{"presentationDocumentTarget":"iframe","displayWidth" : 400,"displayHeight" : 400}}]}`
    );
    const wrapper = shallowMount(CanvasEditorInsertForm, {
      propsData: {
        courseId: expectedCourseId,
        pollId: expectedPollId,
        formActionURL: expectedFormActionURL
      }
    });
    const theForm = wrapper.find('form');
    expect(theForm.attributes().action).toBe(expectedFormActionURL);
    expect(theForm.attributes().method).toBe('POST');
    expect(
      theForm.find('input[name="lti_message_type"]').attributes().type
    ).toBe('hidden');
    expect(
      theForm.find('input[name="lti_message_type"]').attributes().value
    ).toBe('ContentItemSelection');
    expect(theForm.find('input[name="lti_version"]').attributes().type).toBe(
      'hidden'
    );
    expect(theForm.find('input[name="lti_version"]').attributes().value).toBe(
      'LTI-1p0'
    );
    expect(theForm.find('input[name="content_items"]').attributes().type).toBe(
      'hidden'
    );
    expect(theForm.find('input[name="content_items"]').attributes().value).toBe(
      expectedContentItems
    );
  });

  it('submits itself upon mount', () => {
    expect(formSubmitterMock).not.toBeCalled();
    const wrapper = shallowMount(CanvasEditorInsertForm);
    expect(formSubmitterMock).toBeCalled();
    expect(formSubmitterMock).toBeCalledWith(wrapper.find('form').element);
  });
});
