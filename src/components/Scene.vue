<template>
  <article>
    <h1>{{ location.noun | capitalize}}</h1>
    <hr>
    {{describeLocation()}}
    <hr>

    <section ref="thingHolder" tabindex="0" role="menu">
      <ul v-if="things && things.length > 0">
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
      return this.location.callAction("describe");
    },
    addNounControlsToDesc: function(ins) {
      const desc = ins.callAction("describe");
      console.log(desc, ins.noun);
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

