import Vue from "vue";
import VueRouter from "vue-router";
import "./tea-components/OverlayNav";
import "./tea-components/PushLayout";
import "./css/bootstrap-reboot.css";
import "./css/index.css";

import gamedata from "./gamedata";
import HowlerChannel from "./tea/modules/HowlerChannel";
import { openClose, atmospherics } from "./sounds.js";

// vue
import App from "./App.vue";
import SettingsView from "./views/SettingsView";
import GameView from "./views/GameView";

// tea engine
import { goTo, take, usePortal } from "./tea/behaviours";
import { Game } from "./tea/index";

Vue.config.productionTip = false;
Vue.use(VueRouter);

const g = new Game();
g.registerBehaviours([goTo, take, usePortal]);
g.resolveGameData(gamedata);

Vue.filter("capitalize", function(value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

const router = new VueRouter({
  routes: [
    { label: "Game", icon: "fa fa-home", path: "/", component: GameView },
    { label: "Settings", icon: "fa fa-cog", path: "/settings", component: SettingsView }
  ]
});

const effects = new HowlerChannel({ fade: true }).addSounds(openClose);
const tracks = new HowlerChannel({ fade: true }).addSounds(atmospherics);

new Vue({
  router,
  data: () => ({
    game: g,
    response: "",
    words: [],
    type: "verb",
    effects,
    tracks
  }),
  methods: {
    handleInventoryHelp(item) {
      this.game.command(`help ${item.name}`);
    },
    handleAction: function(verb, name) {
      this.$root.game.command(`${verb} ${name}`);
    },
    changeLocation(location) {
      this.$root.game.command(`go to ${location.noun}`);
      this.$router.push("/");
    },
    handleSounds(data) {
      const { verb, valid, firstThings } = data;
      const fThing = firstThings && firstThings.length > 0 && firstThings[0];
      const takeAct = "take|pick|drop|leave".includes(verb);
      const goAct = "go|move".includes(verb);
      const genAct = "help|examine".includes(verb);
      const door = verb === "use" && fThing && fThing.noun === "door";

      if (valid) {
        if (takeAct) this.$root.effects.play("item");
        if (goAct) this.$root.effects.play("door");
        if (door) this.$root.effects.play("door");
        if (genAct) this.$root.effects.play("general");
      }
    },
    commandHookInventory() {
      this.type = "noun";
      const inventory = this.$root.game.getThingsByLocationKey();
      let response = `You aren't carrying anything.`;
      let words = [];

      if (inventory.length === 1) {
        response = `Your inventory contains ${inventory.map(i => `a ${i.name}`)}.`;
      }

      if (inventory.length > 1) {
        const last = inventory.pop();
        response = `Your inventory contains ${inventory.map(i => `a ${i.name}`)} and a ${
          last.name
        }.`;
      }

      words = inventory.map(i => ({ noun: i.noun, named: i.name, verb: "help" }));
      return { response, words };
    },
    commandHookLocations() {
      this.type = "noun";
      const locations = this.$root.game.getLocationNouns();
      let response = `There are no locations for you to travel to.`;
      let words = [];

      if (locations.length === 1) {
        response = `You can go to ${locations.map(i => `the ${i}`)}.`;
      }

      if (locations.length > 1) {
        const last = locations.pop();
        response = `You can go to ${locations.map(i => `the ${i}`)} or the ${last}.`;
      }

      words = locations.map(i => ({ noun: i, named: i, verb: "go" }));
      return { response, words };
    },
    commandHook(data) {
      this.type = "verb";
      const { verb, valid, type } = data;
      const { firstThings: fThings, inventoryThings: iThings } = data;
      const fThing = !fThings || fThings.length === 0 ? false : true;
      const iThing = !iThings || iThings.length === 0 ? false : true;
      const isHelp = ["help", "examine"].includes(verb);
      const isLocations = data.command === "locations";
      const isInventory = data.strictCommand === "inventory";
      let result = {
        response: data.commandAction ? data.commandAction() : "",
        words: []
      };

      this.$root.handleSounds(data);

      if (isLocations) {
        result = this.commandHookLocations();
      }

      if (isInventory) {
        result = this.commandHookInventory();
      }

      if (isHelp) {
        const ins = data.firstThings[0] || data.inventoryThings[0];
        const acts = ins.getActionKeys();
        result.words = acts.map(i => ({ noun: ins.noun, named: ins.name, verb: i }));
      }

      this.response = result.response;
      this.words = result.words;
    }
  },
  mounted() {
    tracks.play("low");
    this.$root.game.subscribe("tea-command", data => this.commandHook(data));
    this.$root.game.subscribe("tea-location-change", data => this.commandHook(data));
  },
  render: h => h(App)
}).$mount("#app");
