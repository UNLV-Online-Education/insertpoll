<template>
  <div>
    <button @click="incrementCount()">Click</button>
    <p>Number of clicks:</p>
    <span id="counter">{{currentCount}}</span>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ButtonCounter extends Vue {
  private currentCount: number = 0;
  @Prop() private initialCount!: number;
  public created() {
    if (this.initialCount !== undefined) {
      this.currentCount = this.initialCount;
    }
  }
  public incrementCount() {
    this.currentCount++;
  }
}
</script>