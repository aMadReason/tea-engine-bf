<template>
  <div class="commander">
    <div
      aria-live="assertive"
      aria-atomic="true"
      class="response"
      ref="responseEl"
      v-html="response"
      role="menu"
      tabindex="0"
    ></div>
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
export default {
  name: "app-commander",
  props: ["things"],
  data: () => ({
    inputCommand: "",
    msg: []
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

    formatHelp: function(response, data) {
      const { firstThings: fThings, inventoryThings: iThings } = data;
      const fThing = !fThings || fThings.length === 0 ? false : true;
      const iThing = !iThings || iThings.length === 0 ? false : true;

      if (!fThing && !iThing) return null;

      const ins = data.firstThings[0] || data.inventoryThings[0];
      const acts = ins.getActionKeys();

      const words = acts.map(i => ({ noun: ins.noun, named: ins.name, verb: i }));
      this.$root.formatResponse(response, words, "verb");
    },

    handleInventory() {
      const inventory = this.$root.game.getThingsByLocationKey();
      const words = inventory.map(i => ({ noun: i.noun, named: i.name, verb: "help" }));
      let response = `You aren't carrying anything.`;

      if (inventory.length === 1) {
        response = `Your inventory contains ${inventory.map(i => `a ${i.name}`)}.`;
      }

      if (inventory.length > 1) {
        const last = inventory.pop();
        response = `Your inventory contains ${inventory.map(i => `a ${i.name}`)} and a ${
          last.name
        }.`;
      }

      this.$root.formatResponse(response, words, "named");
    },

    handleLocations() {
      const locations = this.$root.game.getLocationNouns();
      const words = locations.map(i => ({ noun: i, named: i, verb: "go" }));
      let response = `There are no locations for you to travel to.`;

      if (locations.length === 1) {
        response = `You can go to ${locations.map(i => `the ${i}`)}.`;
      }

      if (locations.length > 1) {
        const last = locations.pop();
        response = `You can go to ${locations.map(i => `the ${i}`)} or the ${last}.`;
      }

      this.$root.formatResponse(response, words, "noun");
    },

    commandHook(data) {
      const { verb, valid, type } = data;
      let response = data.commandAction ? data.commandAction() : "";
      // if (!valid) return (this.response = response);

      this.$root.handleSounds(data);

      if (data.command === "locations") return this.handleLocations();
      if (data.strictCommand === "inventory") return this.handleInventory();

      if (["help", "examine"].includes(verb)) {
        return this.formatHelp(response, data);
      }

      //if (!valid) return (this.response = response);
      this.response = response;
    }
  },
  mounted() {
    this.$root.game.subscribe("tea-command", data => this.commandHook(data));
    this.$root.game.subscribe("tea-location-change", data => this.commandHook(data));

    this.$refs.responseEl.addEventListener("click", e => {
      const { verb, named } = e.target.dataset;
      if (!verb && !named) return undefined;
      const cmd = `${verb} ${named}`;
      this.$root.game.command(cmd);
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

