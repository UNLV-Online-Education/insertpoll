<template>
  <div class="insert-poll-container">
    <p
      id="main-instructions"
    >Use the form below to insert an ungraded multiple-choice poll into your page.</p>
    <form id="createPoll" @submit.prevent="createPoll()">
      <fieldset id="prompt-section">
        <legend>Prompt</legend>
        <label for="prompt" id="prompt-label">Poll Question:</label>
        <br>
        <textarea v-model="prompt" placeholder="Enter poll question" name="prompt" id="prompt"></textarea>
      </fieldset>
      <fieldset id="answer-choices">
        <legend>Answer Choices</legend>
        <p id="answer-choice-instructions">Enter up to six choices for poll-takers to choose from.</p>
        <ul>
          <li v-for="(answer, index) in answerChoices" :key="index">
            <label for="'answer-choice-' + index">Answer Choice {{index+1}}:</label>
            <input
              v-bind:name="'answer-choice-' + (index + 1) "
              type="text"
              v-model="answerChoices[index]"
            >
          </li>
        </ul>
      </fieldset>
      <button type="submit">Insert Poll</button>
    </form>
  </div>
</template>


<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Api } from '@/helpers/api';

@Component
export default class CreatePoll extends Vue {
  @Prop() private apiToken!: string;

  private prompt: string = '';
  private answerChoices = ['', '', '', '', '', ''];

  private createPoll() {
    Api.createPoll(
      this.apiToken,
      this.prompt,
      this.answerChoices
        .filter((elem) => {
          return elem.trim().length > 0;
        })
        .map((elem) => {
          elem = elem.trim();
          return elem;
        })
    ).then((response) => {
      this.$emit('createdPoll', response.data.data.id);
    });
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='scss'>
textarea {
  width: 100%;
}
fieldset {
  border-color: #bf1e2e;
  p {
    margin: 0;
  }
  label {
    margin-right: 1em;
  }
}
button {
  color: #bf1e2e;
}
ul {
  padding-left: 0;
  li {
    list-style: none;
  }
}
</style>
