<template>
  <div class="embed-container">
    <PollViewSwitcher
      v-if="receivedPollData"
      :apiToken="this.apiToken"
      :pollId="this.pollId"
      :prompt="this.prompt"
      :isInstructor="isInstructor"
      :answerChoices="this.answerChoices"
      class="w-100"
    ></PollViewSwitcher>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PollViewSwitcher from '@/components/PollViewSwitcher.vue';
import { Api } from '@/helpers/api';

@Component({
  components: {
    PollViewSwitcher
  }
})
export default class EmbeddedPollView extends Vue {
  @Prop() private hash!: string;
  @Prop() private pollId!: string;
  private apiToken: string = '';
  private prompt: string = '';
  private roleString: string = '';
  private answerChoices: string[] = [];
  private gotData: boolean = false;

  get receivedPollData() {
    return this.gotData;
  }

  get isInstructor() {
    if (
      this.gotData &&
      !this.roleString.includes('Learner') &&
      !this.roleString.includes('Student')
    ) {
      return true;
    }
    return false;
  }

  private created() {
    Api.getLTIData(this.hash)
      .then((response) => {
        this.apiToken = response.data.token;
        if (response.data.roles) {
          this.roleString = response.data.roles;
        }
      })
      .then(() => {
        return Api.getPollData(this.apiToken, this.pollId);
      })
      .then((response) => {
        this.prompt = response.data.poll.prompt;
        if (typeof response.data.poll.answer_choices !== 'undefined') {
          this.answerChoices = JSON.parse(response.data.poll.answer_choices);
        }
        this.gotData = true;
      });

    // this.prompt = "How awesome does this look?";
    // this.answerChoices = ["great", "medium", "not so good yet"];
    // this.gotData = true;
  }
}
</script>
