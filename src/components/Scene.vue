<template>
  <article>
    <header>
      <h1>{{ location.noun | capitalize}}</h1>
    </header>
    <p>{{describeLocation()}}</p>

    <section>
      <ul ref="thingHolder" v-if="things && things.length > 0">
        <li
          v-for="(i, idx) in things"
          v-bind:key="idx+'-'+i.noun"
          v-html="addNounControlsToDesc(i)"
        ></li>
      </ul>
    </section>
  </article>
</template>

<script>
export default {
  name: "app-scene",
  props: ["location", "things"],
  computed: {},
  data: () => ({}),
  methods: {
    describeLocation: function() {
      return this.location.callMethod("describe");
    },
    addNounControlsToDesc: function(ins) {
      const desc = ins.callMethod("describe");
      return desc.replace(
        ins.noun,
        `<button class="small" data-named="${ins.name}">${ins.noun}</button>`
      );
    }
  },
  mounted() {
    this.$refs.thingHolder.addEventListener("click", e => {
      const { named } = e.target.dataset;
      if (e.target.hasAttribute("data-named")) {
        this.$root.game.command(`help ${named}`);
      }
    });
  }
};
</script>

<style>
</style>

