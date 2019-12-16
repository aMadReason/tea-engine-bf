import { Thing } from "../index";

const describe = {
  name: "help",
  properties: {
    filterActionsTo: []
  },
  methods: {
    help(ins: Thing): String {
      const allowedActs = ins.getProperty("filterActionsTo");
      let acts = ins.getActionKeys();
      if (allowedActs && allowedActs.length > 0) acts = acts.filter(i => allowedActs.includes(i));
      return `You can ${acts.join(", ")} the ${ins.name}.`;
    }
  },
  actions: {
    help: "help"
  }
};

Object.freeze(describe);
export default describe;
