import { Thing } from "../index";

const travel = {
  name: "travel",
  methods: {
    travel(ins: Thing): String {
      ins.game.setLocationByKey(ins.key);
      return `Moved to ${ins.name}.`;
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
