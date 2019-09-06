<template>
    <div class="w-100">
        <div class="card cardbgGray">
            <div class="card-body">
                <h2 id="prompt">{{ prompt }}</h2>
                <div id="answerChoices">
                <button class="btn btn-light btn-lg d-block btn-block selection mb-10 buttonText" v-cloak v-for="(answer, index) in this.answerChoices" :key="answer" name="answer_choice" :value="index" @click="clicked(index)" :class="[active==index ? 'selectedButton moveToRight' : 'notSelected']"><i class="fa fa-check-circle fa-2x circleCheck" v-if="active==index" :class="[active==index ? 'animated zoomIn' : '']"></i> <i class="fa fa-circle-thin fa-2x circleOnly" v-else></i> {{answer}}</button>
                <!--
                    <form @submit.prevent="submitAnswer">
                        <ul>
                            <li v-for="(answer, index) in this.answerChoices" :key="answer">
                                <label>
                                    <input type="radio" v-model="chosenValue" name="answer_choice" :value="index" v-on:click="selection">
                                    {{answer}} <i class="fa fa-check" v-if="selected"></i>
                                </label>
                            </li>
                        </ul>
                        <input type="submit" value="Submit" role="button" class="btn btn-success btn-lg">
                    </form>-->
                    <button type="submit" class="btn btn-success btn-lg mt-30" @click="submitAnswer">Submit <i class="fa fa-check"></i></button>
                </div>
            </div>
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
    private active: number = -1;

    public clicked(index: number) {
      this.active = index;
    }

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

.buttonText{
  text-align: left !important;
  word-break: normal;
}

.cardbgGray{
  background: #f7f7f7 !important;
}

.circleOnly{
  color: #E4E4E4;
}
.circleCheck{
  color: #28a745;
}

.moveToRight{
  transform: translateX(15px);
  transition: transform .2s linear;
}

.selection:hover{
  background: white !important;
  box-shadow: 4px 5px 5px #d8d8d8;
  transform: translateX(15px);
  transition: transform .2s linear;
}

.selectedButton, selection:focus{
   border: 3px solid #28a745 !important;
   box-shadow: 5px 9px 18px #d8d8d8;
   background: white;
}

.notSelected:hover{
  transform: scale(1.02);
  transition: transform .2s linear;
}

.notSelected{
   border: 3px solid #ECECEC;
   transition: transform .3s linear;
   box-shadow: 4px 5px 5px #d8d8d8;
   background: white;
}
</style>