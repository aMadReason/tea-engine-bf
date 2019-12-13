import { Thing } from "../index";

const take = {
  name: "take",
  properties: {},
  methods: {
    take(instance: Thing): String {
      const key = instance.locationKey;
      if (key === null) return `${instance.noun} is already in your inventory.`;
      instance.setLocationKey(null);

      const stateKey = instance.getProperty("stateKey");
      if (stateKey && stateKey === "initial") {
        instance.setProperty("stateKey", "default");
      }

      return `${instance.noun} added to inventory.`;
    },
    drop(instance: Thing): String {
      const key = instance.locationKey;
      const loc = instance.game.getActiveLocation();
      if (key) return `${instance.noun} is not in your inventory.`;
      instance.setLocationKey(loc.key);

      const descriptions = instance.getProperty("descriptions");
      if (descriptions && "dropped" in descriptions) {
        instance.setProperty("stateKey", "dropped");
      }

      return `${instance.noun} removed from inventory.`;
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
