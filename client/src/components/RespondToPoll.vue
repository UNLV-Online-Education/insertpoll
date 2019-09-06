<template>
    <div>
        <div class="cardbgGray p-4">
            <div>
                <h2 id="prompt" class="mb-4">{{ prompt }}</h2>
                <div id="answerChoices">
                <!-- Selection buttons -->
                <div>
                <button class="btn btn-light btn-lg d-block btn-block selection mb-4 buttonText w-100" v-cloak v-for="(answer, index) in this.answerChoices" :key="answer" name="answer_choice" :value="index" @click="clicked(index)" :class="[active==index ? 'selectedButton moveToRight' : 'notSelected']"><i class="fa fa-check-circle fa-2x circleCheck"  v-cloak v-if="active==index" :class="[active==index ? 'animated zoomIn' : '']"></i> <i class="fa fa-circle-thin fa-2x circleOnly" v-cloak v-else></i> {{answer}}</button>
                </div>
                <!-- submit choices -->
                <div>
                    <button type="submit" class="btn btn-success btn-lg p-3 submitVote" @click="submitAnswer">Submit your vote <i class="fa fa-check"></i></button>
                    </div>
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

.submitVote{
  font-weight: bold;
}

.buttonText{
  text-align: left !important;
  word-wrap: break-word;
}

.cardbgGray{
  
}

.circleOnly, .circleCheck{
  vertical-align: middle;
  font-size: 150%;
}
.circleOnly{
  color: #E4E4E4;
}
.circleCheck{
  color: #28a745;
}

.moveToRight{
  transform: translateX(15px) translateY(0px);
  transition: transform .2s linear;
}

.selection:hover{
  background: white !important;
  box-shadow: 4px 5px 5px #d8d8d8;
  transform: translateX(15px);
  transition: all .2s linear;
}

.selection{
  min-width: 35% !important;
}

.selectedButton, selection:focus{
   border: 2px solid #28a745 !important;
   transition: all 3s linear;
   box-shadow: 5px 9px 18px #d8d8d8;
   background: white;
   font-weight:bold;
}

.notSelected:hover{
  transform: scale(1.001);
  transition: transform .2s linear;
}

.notSelected{
   transition: transform .3s linear;
   box-shadow: 4px 5px 5px #d8d8d8;
   border: 2px solid #d8d8d8 !important;
   background: white;
}
</style>