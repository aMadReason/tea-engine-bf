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

      this.game.command(this.inputCommand);

      this.inputCommand = "";
    },

    commandHook(data) {
      const { verb, valid } = data;
      this.msg = data.msg;

      const takeActs = "take|pick|drop|leave";
      const goActs = "go|move";

      if (valid) {
        if (takeActs.includes(verb)) effects.play("handleSmallLeather");
        if (goActs.includes(verb)) effects.play("doorClose_3");
      }

      if (data.strictCommand === "inventory") {
        const inventory = this.game.getThingsByLocationKey();
        if (inventory.length === 0) return (this.response = `You aren't carrying anything.`);
        return (this.response = `The items you are carrying are ${inventory
          .map(i => `a ${i.describedNoun || i.noun}`)
          .join(", ")}.`);
      }

      if (data.msg && data.msg.length > 0) {
        this.response = data.msg.join(" ");
      }

      if (data.valid) return (this.response = data.commandAction());
    }
  },
  mounted() {
    this.$root.game.subscribe("tea-command", data => this.commandHook(data));
    this.$root.game.subscribe("tea-location-change", data => this.commandHook(data));
    tracks.play("low");

    this.$refs.responseEl.addEventListener("click", e => {
      const { noun, verb, described } = e.target.dataset;
      //const results = this.$root.game.getThingsByNoun(noun, describedNoun, this.things);
      //if (results.length === 0) return null;
      this.game.command(`${verb} ${described || noun}`);
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
  padding: calc(var(--tea-spacing)/2);
}

.response:first-letter {
  text-transform: uppercase;
}


button.verb {
  padding: 0.1rem 0;
  min-height: 1rem;
  padding: 0.1rem 0.2rem;
  line-height: 1.1;
}
</style>

