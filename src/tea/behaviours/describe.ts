import { Thing } from "../index";

// gives brief description of thing depending on its state.

const describe = {
  name: "describe",
  properties: {
    stateKey: "default",
    descriptions: {
      default: "It's a {name}"
    }
  },
  methods: {
    describe(ins: Thing): String {
      const name = ins.name.toString();
      const stateKey = ins.getProperty("stateKey").toString();
      const descriptions = ins.getProperty("descriptions");
      let description = descriptions[stateKey];
      if (!description) description = descriptions["default"];
      return description.replace("{name}", name);
    }
  },
  actions: {
    describe: "describe"
  }
};

Object.freeze(describe);
export default describe;
