<template>
  <div>
    <h2 id="prompt">{{ prompt }}</h2>
    <div id="answerChoices">
      <form @submit.prevent="submitAnswer">
        <ul>
          <li v-for="(answer, index) in this.answerChoices" :key="answer">
            <label>
              <input type="radio" v-model="chosenValue" name="answer_choice" :value="index">
              {{answer}}
            </label>
          </li>
        </ul>
        <input type="submit" value="Submit" class="btn btn-primary btn-lg">
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Api } from '@/helpers/api';

@Component({
  components: {}
})
export default class RespondToPoll extends Vue {
  @Prop() private pollId!: string;
  @Prop() private apiToken!: string;
  @Prop() private prompt!: string;
  @Prop() private answerChoices!: any[];
  private chosenValue: string = '';

  private submitAnswer() {
    Api.saveResponse(this.apiToken, this.pollId, this.chosenValue).then(
      (response) => {
        this.$emit('responded', response);
      }
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
ul {
  padding: 0;
  li {
    list-style: none;
  }
}
</style>
