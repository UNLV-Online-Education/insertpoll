<template>
  <div>
    <canvas ref="theChart">-->
      <table>
        <caption>Class Summary</caption>
        <tr>
          <th scope="col">Response</th>
          <th scope="col">Count</th>
        </tr>
        <tr v-for="(answer, index) of answerChoices" :key="index">
          <td>{{answer}}</td>
          <td>{{answerBarData[index]}}</td>
        </tr>
      </table>
    </canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Chart } from 'chart.js';
@Component({})
export default class ResponseChart extends Vue {
  @Prop() private answerChoices!: string[];
  @Prop() private answerBarData!: number[];

  private mounted() {
    const ctx = (this.$refs.theChart as HTMLCanvasElement).getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    Chart.defaults.global.defaultFontColor = 'rgb(191,30,46)';
    Chart.defaults.global.defaultFontFamily = 'roboto';
    const chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'horizontalBar',

      // The data for our dataset
      data: {
        labels: this.answerChoices,
        datasets: [
          {
            label: 'Percentage',
            backgroundColor: 'rgb(191,30,46)',
            borderColor: 'rgb(191,30,46)',
            data: this.answerBarData
          }
        ]
      },

      // Configuration options go here
      options: {
        legend: { display: false },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                min: 0,
                max: 100,
                callback: (value) => {
                  return value + '%';
                }
              },
              scaleLabel: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    });
  }
}
</script>
