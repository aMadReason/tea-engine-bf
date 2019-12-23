<template>
  <div class="commander">
    <form class="full-width" v-on:submit="e => submitCommand(e)">
      <label for="cmd">Command:</label>
      <input v-model="inputCommand" placeholder id="cmd" type="text">
      <button type="submit">Submit</button>
    </form>
    <app-responsebox :type="$root.type" :words="$root.words" :response="$root.response"></app-responsebox>
  </div>
</template>

<script>
import ResponseBox from "./ResponseBox";

export default {
  name: "app-commander",
  props: ["things"],
  components: {
    "app-responsebox": ResponseBox
  },
  data: () => ({
    inputCommand: "",
    msg: []
  }),
  computed: {},
  methods: {
    submitCommand(event) {
      event.preventDefault();
      this.$root.game.command(this.inputCommand);
      this.inputCommand = "";
    }
  }
};
</script>

<style scoped>
.commander {
  width: 100%;
}

.commander  form {
  display: flex;
  flex-flow: row wrap;
  margin-bottom: calc(var(--tea-spacing, 0.5rem)/2);
}

.commander form > input {
  flex: 1;
  box-shadow: var(--tea-shadow);
  min-height: 30px;
}



</style>

