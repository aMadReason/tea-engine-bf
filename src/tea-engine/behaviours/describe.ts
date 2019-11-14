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
    describe(instance: Thing): String {
      const stateKey = instance.getProperty("stateKey");
      return instance.getProperty("descriptions")[stateKey];
    }
  },
  actions: {
    describe: "describe",
    examine: "describe"
  }
};

Object.freeze(describe);
export default describe;
