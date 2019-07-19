<template>
  <div class="home">
    <create-poll
      v-if="this.apiToken"
      :apiToken="this.apiToken"
      v-on:createdPoll="pollCreatedHandler"
    />
    <canvas-editor-insert-form
      v-if="this.pollId"
      :formActionURL="this.formActionURL"
      :courseId="this.courseId"
      :pollId="this.pollId"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import CreatePoll from '@/components/CreatePoll.vue'; // @ is an alias to /src
import { Api } from '@/helpers/api';
import CanvasEditorInsertForm from '@/components/CanvasEditorInsertForm.vue';

@Component({
  components: {
    'create-poll': CreatePoll,
    'canvas-editor-insert-form': CanvasEditorInsertForm
  }
})
export default class InsertPollView extends Vue {
  private apiToken = '';
  private formActionURL = '';
  private courseId = '';
  private pollId = '';
  @Prop(String) private hash!: string;

  private created() {
    Api.getLTIData(this.hash).then((response) => {
      this.apiToken = response.data.token;
      this.formActionURL = response.data.ext_content_return_url;
      this.courseId = response.data.custom_canvas_course_id;
    });
  }

  private pollCreatedHandler(thePollId: any) {
    this.pollId = thePollId;
  }
}
</script>
