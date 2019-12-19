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
    actButton(data, type = "verb") {
      return `<button class="small" data-named="${data.named}" data-verb="${data.verb}">${
        data[type]
      }</button>`;
    },
    formatResponse(response, words, type = "verb") {
      let formatted = response;
      words.map(i => (formatted = formatted.replace(i[type], this.actButton(i, type))));
      this.response = formatted;
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
    }
  },
  mounted: () => {
    tracks.play("low");
  },
  render: h => h(App)
}).$mount("#app");
