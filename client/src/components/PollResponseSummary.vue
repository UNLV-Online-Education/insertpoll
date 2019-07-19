<template>
  <div>
    <h2 id="prompt">{{prompt}}</h2>
    <ul id="answerChoices">
      <li v-for="(answer, index) in this.answerChoices" :key="index">{{answer}}</li>
    </ul>
    <h3 v-if="myResponse.length > 0" id="ownResponse">You said: {{myResponse}}</h3>
    <h3 id="classResponses">Class Responses (Total: {{totalResponses}})</h3>
    <ResponseChart
      v-if="this.showChart"
      :answerChoices="this.answerChoices"
      :answerBarData="this.answerBarData"
    ></ResponseChart>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ResponseChart from '@/components/ResponseChart.vue';

@Component({ components: { ResponseChart } })
export default class PollResponseSummary extends Vue {
  @Prop() private ownResponse: any;
  @Prop() private prompt!: string;
  @Prop() private answerChoices!: string[];
  @Prop() private aggregateResponses!: any[];
  private totalResponses = 0;
  private answerBarData: number[] = [];
  private showChart = false;

  get myResponse() {
    if (this.ownResponse !== null) {
      return this.answerChoices[+this.ownResponse.value];
    } else {
      return '';
    }
  }

  private mounted() {
    if (this.aggregateResponses.length > 0) {
      const totalAnswers = this.aggregateResponses.reduce(
        (accumulator, currentValue) => {
          return { count: accumulator.count + currentValue.count };
        }
      );
      this.totalResponses = totalAnswers.count;
      this.answerBarData = this.answerChoices.map((elem, index) => {
        return Math.round(
          (this.aggregateCount(index) / this.totalResponses) * 100
        );
      });
      this.showChart = true;
    } else {
      this.totalResponses = 0;
    }
  }

  private aggregateCount(index: number) {
    const countObject = this.aggregateResponses.find((elem) => {
      return elem.value === index;
    });
    if (countObject) {
      return countObject.count;
    } else {
      return 0;
    }
  }
}
</script>

<style lang="scss">
.center {
  text-align: center;
}
p {
  margin: 0.8em;
}
</style>
