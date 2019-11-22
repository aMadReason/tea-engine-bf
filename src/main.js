import Vue from "vue";
import App from "./App.vue";

import { Game } from "./tea/index";
//import { describe } from "./tea-engine/behaviours/describe";
Vue.config.productionTip = false;

const gamedata = {
  things: [
    {
      noun: "cup",
      locationKey: "cabin",
      describedNoun: "golden cup",
      behaviours: ["describe"],
      properties: {
        descriptions: {
          default: "A small golden cup rests on it's side on the floor."
        }
      }
    },
    {
      noun: "book",
      locationKey: "cabin",
      describedNoun: "red book",
      properties: {
        descriptions: {
          default: "A shabby red book rests haphazardly on the ground."
        }
      },
      actions: {
        read: "describe",
        use: "describe",
        look: "describe",
        examine: "describe"
      }
    },
    {
      noun: "book",
      locationKey: "cabin",
      describedNoun: "green book",
      properties: {
        descriptions: {
          default: "A shabby green book rests haphazardly on the ground."
        }
      }
    },
    {
      noun: "rope",
      locationKey: "deck",
      properties: {
        descriptions: {
          default: "A large coil of rope is hung on the wall.",
          dropped: "A large coil of rope sits on the floor."
        }
      }
    }
  ],
  locations: [
    {
      key: "cabin",
      noun: "cabin",
      properties: {
        descriptions: {
          default: "The engine purrs constantly in the background. "
        }
      }
    },
    {
      key: "deck",
      noun: "deck",
      properties: {
        descriptions: {
          default:
            "Waves slap rythmically against the hull of the boat as the water rolls in time of the waves. The deck is sparse."
        }
      }
    }
  ]
};

const g = new Game();
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
