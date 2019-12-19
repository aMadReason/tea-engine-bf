import { Thing } from "../index";

// reveals more detailed details about the thing

const examine = {
  name: "examine",
  properties: {
    stateKey: "",
    details: {
      default: "There is nothing remarkable about the {name}"
    }
  },
  methods: {
    examine(ins: Thing): String {
      const name = ins.name.toString();
      const stateKey = ins.getProperty("stateKey").toString();
      const details = ins.getProperty("details");
      let detail = details[stateKey];
      if (!detail) detail = details["default"];
      return detail.replace("{name}", name);
    }
  },
  actions: {
    examine: "examine"
  }
};

Object.freeze(examine);
export default examine;
