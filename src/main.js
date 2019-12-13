import Vue from "vue";
import VueRouter from "vue-router";
import "./tea-components/SideNav";
//import "./tea-components/Noun";
import "./css/bootstrap-reboot.css";
import "./css/index.css";

import gamedata from "./gamedata";

// vue
import App from "./App.vue";
import Scene from "./components/Scene";
import Locations from "./components/Locations";

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
  routes: [{ path: "/", component: Scene }, { path: "/locations", component: Locations }]
});

new Vue({
  router,
  data: () => ({
    game: g,
    response: ""
  }),
  mounted: () => {
    // g.subscribe("tea-location-change", data => {
    //   console.log(`Changed location from ${data.from.noun} to ${data.to.noun}`);
    // });
  },
  render: h => h(App)
}).$mount("#app");
