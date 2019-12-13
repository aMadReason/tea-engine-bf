import { Thing } from "../index";

const take = {
  name: "take",
  properties: {},
  methods: {
    take(ins: Thing): String {
      const key = ins.locationKey;
      if (key === null) return `${ins.name} is already in your inventory.`;
      ins.setLocationKey(null);

      const stateKey = ins.getProperty("stateKey");
      if (stateKey && stateKey === "initial") {
        ins.setProperty("stateKey", "default");
      }

      return `${ins.name} added to inventory.`;
    },
    drop(ins: Thing): String {
      const key = ins.locationKey;
      const loc = ins.game.getActiveLocation();
      if (key) return `${ins.name} is not in your inventory.`;
      ins.setLocationKey(loc.key);

      const descriptions = ins.getProperty("descriptions");
      if (descriptions && "dropped" in descriptions) {
        ins.setProperty("stateKey", "dropped");
      }

      return `${ins.name} removed from inventory.`;
    }
  },
  actions: {
    take: "take",
    pick: "take",
    drop: "drop",
    leave: "drop",
    put: "drop"
  }
};

Object.freeze(take);
export default take;
