<template>
  <article>
    <h1>{{ location.noun | capitalize}}</h1>
    <hr>
    {{describeLocation()}}
    <hr>

    <section ref="thingHolder">
      <ul v-if="things && things.length > 0">
        <!-- <li v-for="(i, idx) in things" v-bind:key="idx+'-'+i.noun">{{i.callAction('describe')}}</li> -->
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
  props: [],
  computed: {
    location: function() {
      return this.$root.game.getActiveLocation();
    },
    things: function() {
      return this.$root.game.getActiveThings();
    }
  },
  data: () => ({}),
  methods: {
    describeLocation: function() {
      return this.location.callAction("describe");
    },
    addNounControlsToDesc: function(ins) {
      const desc = ins.callAction("describe");
      //const acts = ins.getActionKeys();
      //const inner = acts.join(", ");

      return desc.replace(
        ins.noun,
        `<button class="noun" data-noun="${ins.noun}" data-described="${ins.describedNoun}">${
          ins.noun
        }</button>`
      );
    },
    handleHelp: function(ins) {
      let response = ins.callMethod("help");
      const acts = ins.getActionKeys();

      acts.map(i => {
        response = response.replace(
          i,
          `<button class="verb" data-verb="${i}"  data-noun="${ins.noun}" data-described="${
            ins.describedNoun
          }">${i}</button>`
        );
      });

      this.$root.response = response;
    }
  },
  mounted() {
    //console.log(this.$refs.thingHolder.querySelectorAll("button.noun"));
    this.$refs.thingHolder.addEventListener("click", e => {
      if (e.target.hasAttribute("data-noun")) {
        const { noun, described } = e.target.dataset;
        const results = this.$root.game.getThingsByNoun(noun, described, this.things);
        if (results.length === 0) return null;
        const instance = results[0];
        this.handleHelp(instance);
      }
    });
  }
};
</script>

<style>
button.noun {
  padding: 0.1rem 0;
  min-height: 1rem;
  padding: 0.1rem 0.2rem;
  line-height: 1.1;
}

button.verb {
  padding: 0.1rem 0;
  min-height: 1rem;
  padding: 0.1rem 0.2rem;
  line-height: 1.1;
}
</style>

