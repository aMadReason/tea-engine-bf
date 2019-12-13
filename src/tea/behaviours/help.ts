import { Thing } from "../index";

const describe = {
  name: "help",
  methods: {
    help(instance: Thing): String {
      const acts = instance.getActionKeys();
      return `You can try the following actions; ${acts.join(", ")}.`;
    }
  },
  actions: {
    help: "help"
  }
};

Object.freeze(describe);
export default describe;
