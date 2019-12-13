import { Thing } from "../index";

const describe = {
  name: "help",
  methods: {
    help(ins: Thing): String {
      const acts = ins.getActionKeys();
      return `You can ${acts.join(", ")} the ${ins.name}.`;
    }
  },
  actions: {
    help: "help"
  }
};

Object.freeze(describe);
export default describe;
