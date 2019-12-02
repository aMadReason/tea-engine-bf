import Vue from "vue";
import App from "./App.vue";
import { travel, take } from "./tea/behaviours";
import { Game } from "./tea/index";
Vue.config.productionTip = false;

const gamedata = {
  things: [
    {
      noun: "cup",
      locationKey: "cabin",
      describedNoun: "golden cup",
      behaviours: ["take"],
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
      behaviours: ["take"],
      properties: {
        descriptions: {
          default: "A shabby red book rests haphazardly on the ground."
        }
      }
    },
    {
      noun: "book",
      locationKey: "cabin",
      describedNoun: "green book",
      behaviours: ["take"],
      properties: {
        descriptions: {
          default: "A shabby green book rests haphazardly on the ground."
        }
      }
    },
    {
      noun: "rope",
      locationKey: "deck",
      behaviours: ["take"],
      properties: {
        stateKey: "wall",
        descriptions: {
          wall: "A large coil of rope is hung on the wall.",
          default: "A large coil of rope.",
          dropped: "A large coil of rope sits on the floor."
        }
      }
    }
  ],
  locations: [
    {
      key: "cabin",
      noun: "cabin",
      behaviours: ["travel"],
      properties: {
        descriptions: {
          default: "The engine purrs constantly in the background. "
        }
      }
    },
    {
      key: "deck",
      noun: "deck",
      behaviours: ["travel"],
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
