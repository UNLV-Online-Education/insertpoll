<template>
  <div>
    <h2 id="prompt">{{prompt}}</h2>
    <ul id="answerChoices" class="list-group">
      <li v-for="(answer, index) in this.answerChoices" :key="index" class="list-group-item p-4" :class="[choiceValue==index ? 'font-weight-bold bg-success' : 'font-weight-normal']">
      <span>
        <i class="fa fa-check-circle circleCheck text-white" v-cloak v-if="choiceValue==index"><h4 class="font-weight-bold">You chose: </h4> </i> {{answer}}
        </span>
      <!--<div class="progress">
  <div class="progress-bar bg-success" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
</div>-->
<!--<p class="font-weight-bold">13 votes</p>-->
      </li>
    </ul>
    <!--<h3 v-if="myResponse.length > 0" id="ownResponse">You said: {{myResponse}}</h3>
    <div v-if="isInstructor" id="classResponses">
      <h3>Class Responses (Total: {{totalResponses}})</h3>
      <ResponseChart
        v-if="this.showChart"
        :answerChoices="this.answerChoices"
        :answerBarData="this.answerBarData"
      ></ResponseChart>
    </div>-->
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
  @Prop() private isInstructor!: boolean;
  private totalResponses = 0;
  private answerBarData: number[] = [];
  private showChart = false;
  private choiceValue: number = -1;

  // PollResponseSummary() {
  //   this.myResponse();
  // }

  get myResponse() {
    if (this.ownResponse !== null) {
      this.choiceValue = this.ownResponse.value;
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
