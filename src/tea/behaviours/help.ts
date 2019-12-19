import { Thing } from "../index";

const behaviour = {
  name: "help",
  properties: {
    filterActionsTo: [],
    excludeActionsTo: []
  },
  methods: {
    help(ins: Thing): String {
      const allowedActs = ins.getProperty("filterActionsTo");
      let acts = ins.getActionKeys();
      if (allowedActs && allowedActs.length > 0) acts = acts.filter(i => allowedActs.includes(i));

      if (acts.length > 1) {
        const last = acts.pop();
        return `You can ${acts.join(", ")} or ${last} the ${ins.name}.`;
      }
      return `You can ${acts.join(", ")} the ${ins.name}.`;
    }
  },
  actions: {
    help: "help",
    examine: "help"
  }
};

Object.freeze(behaviour);
export default behaviour;
