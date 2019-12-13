<template>
  <div class="commander">
    <div class="response" ref="responseEl" v-html="response"></div>
    <form class="field" v-on:submit="e => submitCommand(e)">
      <input v-model="inputCommand" placeholder id="cmd" type="text">
      <label for="cmd">Command</label>
    </form>
    <div>
      <button type="submit">Submit</button>
    </div>
  </div>
</template>

<script>
import HowlerChannel from "../tea/modules/HowlerChannel";
import { openClose, atmospherics } from "../sounds.js";

const effects = new HowlerChannel({ fade: true }).addSounds(openClose);
const tracks = new HowlerChannel({ fade: true }).addSounds(atmospherics);

export default {
  name: "app-commander",
  props: [],
  data: () => ({
    inputCommand: ""
  }),
  computed: {
    response: {
      get: function() {
        return this.$root.response;
      },
      set: function(content) {
        this.$root.response = content;
      }
    },
    game: function() {
      return this.$root.game;
    },
    things: function() {
      return this.$root.game.getActiveThings();
    }
  },
  methods: {
    submitCommand(event) {
      event.preventDefault();
      const parsed = this.game.parseCommand(this.inputCommand);

      if (parsed.strictCommand === "inventory") {
        const inventory = this.game.getThingsByLocationKey();
        if (inventory.length === 0) return (this.$root.response = `You aren't carrying anything.`);
        return (this.$root.response = `The items you are carrying are ${inventory
          .map(i => `a ${i.describedNoun || i.noun}`)
          .join(", ")}.`);
      }

      console.log(parsed);

      this.game.command(this.inputCommand);
      this.inputCommand = "";
    },

    commandPostHook(data) {
      const { verb, valid } = data;
      this.msg = data.msg;
      this.response = data.response;

      const takeActs = "take|pick|drop|leave";
      const goActs = "go|move";

      if (valid) {
        if (takeActs.includes(verb)) effects.play("handleSmallLeather");
        if (goActs.includes(verb)) effects.play("doorClose_3");
      }
    }
  },
  mounted() {
    this.$root.game.subscribe("tea-command-post", data => this.commandPostHook(data));
    this.$root.game.subscribe("tea-location-change", data => this.commandPostHook(data));
    tracks.play("low");

    this.$refs.responseEl.addEventListener("click", e => {
      const { noun, verb, describedNoun } = e.target.dataset;
      //const results = this.$root.game.getThingsByNoun(noun, describedNoun, this.things);
      //if (results.length === 0) return null;
      this.game.command(`${verb} ${describedNoun || noun}`);
    });
  }
};
</script>

<style>
.commander {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  align-content: center;
  width: 100%;
}

.commander > div {
  /* vertical-align: top; */
  /* margin: 0; */
}

.response {
  background: var(--tea-bg-2);
  height: 4rem;
  flex: 0 0 100%;
  border-radius: var(--tea-radius);
  text-align: left;
  padding: calc(var(--tea-spacing)/2)
}


button.verb {
  padding: 0.1rem 0;
  min-height: 1rem;
  padding: 0.1rem 0.2rem;
  line-height: 1.1;
}
</style>

