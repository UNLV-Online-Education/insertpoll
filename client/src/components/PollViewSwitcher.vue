<template>
  <div>
    <RespondToPoll
      v-if="this.receivedResponseData && !shouldShowSummary"
      :pollId="this.pollId"
      :apiToken="this.apiToken"
      :prompt="this.prompt"
      :answerChoices="this.answerChoices"
      v-on:responded="refreshResponseData"
    ></RespondToPoll>
    <PollResponseSummary
      v-if="this.receivedResponseData && shouldShowSummary"
      :prompt="this.prompt"
      :answerChoices="this.answerChoices"
      :ownResponse="this.currentResponse"
      :aggregateResponses="this.aggregateResponses"
    ></PollResponseSummary>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Api } from '@/helpers/api';
import RespondToPoll from '@/components/RespondToPoll.vue';
import PollResponseSummary from '@/components/PollResponseSummary.vue';

@Component({
  components: { RespondToPoll, PollResponseSummary }
})
export default class PollViewSwitcher extends Vue {
  @Prop() private pollId!: string;
  @Prop() private apiToken!: string;
  @Prop() private prompt!: string;
  @Prop() private answerChoices!: string[];
  @Prop() private isInstructor!: boolean;

  private aggregateResponses: any[] = [];
  private currentResponse: any = null;
  private receivedResponseData: boolean = false;

  private created() {
    this.refreshResponseData();
  }

  private refreshResponseData() {
    this.receivedResponseData = false;
    Api.getOwnResponse(this.apiToken, this.pollId)
      .then((res) => {
        this.currentResponse = res.data.response;
      })
      .then(() => {
        return Api.getAggregateData(this.apiToken, this.pollId);
      })
      .then((res) => {
        this.aggregateResponses = res.data.responses;
        this.receivedResponseData = true;
      });
  }

  get shouldShowSummary() {
    return this.isInstructor || this.currentResponse !== null;
  }
}
</script>