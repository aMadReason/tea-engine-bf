import { Thing } from "../index";

const describe = {
  name: "describe",
  properties: {
    stateKey: "default",
    descriptions: {
      default: "Default."
    }
  },
  methods: {
    describe(ins: Thing): String {
      const stateKey = ins.getProperty("stateKey");
      return ins.getProperty("descriptions")[stateKey];
    }
  },
  actions: {
    describe: "describe",
    examine: "describe"
  }
};

Object.freeze(describe);
export default describe;
