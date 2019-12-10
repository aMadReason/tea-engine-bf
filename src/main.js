import Vue from "vue";
import "rpg-awesome/css/rpg-awesome.css";
import "./tea-components/SideNav";
import "./css/bootstrap-reboot.css";
import "./css/index.css";

import gamedata from "./gamedata";

// vue
import App from "./App.vue";

// tea engine
import { travel, take } from "./tea/behaviours";
import { Game } from "./tea/index";

Vue.config.productionTip = false;

const g = new Game();
g.registerBehaviours([travel, take]);
g.resolveGameData(gamedata);

new Vue({
  data: () => ({
    game: g
  }),
  mounted: () => {
    g.subscribe("tea-location-change", data => {
      console.log(`Changed location from ${data.from.noun} to ${data.to.noun}`);
    });
  },
  render: h => h(App)
}).$mount("#app");
