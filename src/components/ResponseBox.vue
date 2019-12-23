<template>
  <div
    aria-live="assertive"
    aria-atomic="true"
    class="response"
    ref="responseEl"
    v-html="formatted"
  ></div>
</template>

<script>
export default {
  name: "app-responsebox",
  props: ["response", "words", "type"],
  computed: {
    formatted() {
      let formatted = this.response;
      this.words.map(
        i => (formatted = formatted.replace(i[this.type], this.actButton(i, this.type)))
      );
      return formatted;
    }
  },
  data: () => ({
    buttons: []
  }),
  methods: {
    handleClick(e) {
      const { verb, named, noun } = e.target.dataset;
      if (!verb && !named) return undefined;
      const cmd = `${verb} ${named}`;
      this.$root.game.command(cmd);
    },
    actButton(data, type = "verb") {
      return `<button class="small" data-named="${data.named}" data-verb="${data.verb}">${
        data[type]
      }</button>`;
    }
  },
  beforeUpdate() {
    this.buttons.map(i => i.removeEventListener("click", this.handleClick));
    this.$refs.responseEl.innerHTML = "";
  },
  updated() {
    this.buttons = Array.from(this.$refs.responseEl.querySelectorAll("button"));
    this.buttons.map(i => i.addEventListener("click", this.handleClick));
  }
};
</script>

<style scoped>

.response {
    background: var(--tea-bg-2);
  border-radius: var(--tea-radius);
  height: 4rem;
  flex: 0 0 100%;  
  text-align: left;
  padding: calc(var(--tea-spacing)/2);
}

.response:first-letter {
  text-transform: uppercase;
}
</style>

