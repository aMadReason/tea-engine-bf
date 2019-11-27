import { Thing } from "../index";

const travel = {
  name: "travel",
  methods: {
    travel(instance: Thing): String {
      instance.game.setLocationByKey(instance.key);
      return `Moved to ${instance.describedNoun || instance.noun}.`;
    }
  },
  actions: {
    go: "travel",
    move: "travel",
    travel: "travel"
  }
};

Object.freeze(travel);
export default travel;
