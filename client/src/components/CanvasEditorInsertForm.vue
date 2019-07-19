<template>
  <!-- <form ref="theForm" :action="this.formActionURL" method="POST">
    <input id="lti-message-type" type="hidden" name="lti_message_type" value="ContentItemSelection">
    <input id="lti-version" type="hidden" name="lti_version" value="LTI-1p0">
    <input id="lti-data" type="hidden" name="content_items" :value="this.ltiDataString">
  </form>-->
  <form ref="theForm" :action="this.formActionURL" method="POST">
    <input id="lti-message-type" type="hidden" name="lti_message_type" value="ContentItemSelection">
    <input id="lti-version" type="hidden" name="lti_version" value="LTI-1p0">
    <input id="content-items" type="hidden" name="content_items" :value="this.ltiDataString">
  </form>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import FormSubmitter from '@/helpers/FormSubmitter.ts';

@Component
export default class CanvasEditorInsertForm extends Vue {
  @Prop() private courseId!: number;
  @Prop() private pollId!: number;
  @Prop() private formActionURL!: string;

  private mounted() {
    FormSubmitter.submitForm(this.$refs.theForm as HTMLFormElement);
  }

  get ltiDataString() {
    return encodeURI(
      `{"@context":"http://purl.imsglobal.org/ctx/lti/v1/ContentItem","@graph":[{"@type":"ContentItem","@id":"${
        process.env.VUE_APP_CANVAS_URL
      }courses/${this.courseId}/external_tools/retrieve","url":"${
        process.env.VUE_APP_CANVAS_URL
      }courses/${
        this.courseId
      }/external_tools/retrieve?display=borderless&url=${
        process.env.VUE_APP_API_URL
      }launch?pollId=${
        this.pollId
      }","title":"test","text":"text","mediaType":"text/html","placementAdvice":{"presentationDocumentTarget":"iframe","displayWidth" : 400,"displayHeight" : 400}}]}`
    );
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='scss'>
</style>
