import Vue from "vue";
import VueRouter from "vue-router";
import "./tea-components/OverlayNav";
import "./tea-components/PushLayout";
import "./css/bootstrap-reboot.css";
import "./css/index.css";

import gamedata from "./gamedata";

// vue
import App from "./App.vue";
import SettingsView from "./views/SettingsView";
import GameView from "./views/GameView";
//import Test from "./views/Test";

// tea engine
import { travel, take } from "./tea/behaviours";
import { Game } from "./tea/index";

Vue.config.productionTip = false;
Vue.use(VueRouter);

const g = new Game();
g.registerBehaviours([travel, take]);
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
    //{ label: "Test", icon: "fa fa-cog", path: "/test", component: Test }
  ]
});

new Vue({
  router,
  data: () => ({
    game: g,
    response: ""
  }),
  methods: {
    handleInventoryHelp(item) {
      this.game.command(`help ${item.name}`);
    },
    changeLocation(location) {
      this.game.command(`go to ${location.noun}`);
      this.$router.push("/");
    }
  },
  mounted: () => {},
  render: h => h(App)
}).$mount("#app");
