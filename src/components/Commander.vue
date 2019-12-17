<template>
  <div class="commander">
    <div class="response" ref="responseEl" v-html="response" role="menu" tabindex="0"></div>
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
  props: ["things"],
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
    }
  },
  methods: {
    submitCommand(event) {
      event.preventDefault();
      this.$root.game.command(this.inputCommand);
      this.inputCommand = "";
    },

    formatHelp: function(data) {
      const ins = data.firstThings[0] || data.inventoryThings[0];
      let response = data.commandAction();
      const acts = ins.getActionKeys();
      acts.map(i => {
        response = response.replace(
          i,
          `<button class="verb small" data-named="${ins.name}" data-verb="${i}">${i}</button>`
        );
      });
      this.response = response;
    },

    handleSounds(data) {
      const { verb, valid } = data;
      const takeActs = "take|pick|drop|leave";
      const goActs = "go|move";

      if (valid) {
        if (takeActs.includes(verb)) effects.play("handleSmallLeather");
        if (goActs.includes(verb)) effects.play("doorClose_3");
      }
    },

    handleInventory() {
      const inventory = this.$root.game.getThingsByLocationKey();
      if (inventory.length === 0) return (this.response = `You aren't carrying anything.`);
      return (this.response = `The items you are carrying are ${inventory
        .map(i => `a ${i.describedNoun || i.noun}`)
        .join(", ")}.`);
    },

    commandHook(data) {
      const { verb, valid, inventoryThings } = data;
      this.msg = data.msg;

      this.handleSounds(data);
      if (data.msg && data.msg.length > 0) this.response = data.msg.join(" ");

      if (data.strictCommand === "inventory") return this.handleInventory();

      if (valid && ["help", "examine"].includes(verb)) {
        return this.formatHelp(data);
      }

      if (valid) return (this.response = data.commandAction());
    }
  },
  mounted() {
    this.$root.game.subscribe("tea-command", data => this.commandHook(data));
    this.$root.game.subscribe("tea-location-change", data => this.commandHook(data));
    tracks.play("low");

    this.$refs.responseEl.addEventListener("click", e => {
      const { verb, named } = e.target.dataset;
      this.$root.game.command(`${verb} ${named}`);
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

</style>

