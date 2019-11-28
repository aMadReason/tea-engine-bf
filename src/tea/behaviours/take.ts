import { Thing } from "../index";

const take = {
  name: "take",
  properties: {},
  methods: {
    take(instance: Thing): String {
      const key = instance.locationKey;
      if (key === null) return `${instance.noun} is already in your inventory.`;
      instance.setLocationKey(null);

      return `${instance.noun} added to inventory.`;
    },
    drop(instance: Thing): String {
      const key = instance.locationKey;
      if (key !== null) return `${instance.noun} is not in your inventory.`;
      const loc = instance.game.getActiveLocation();
      instance.setLocationKey(loc.key);

      return `${instance.noun} removed from inventory.`;
    }
  },
  actions: {
    take: "take",
    pick: "take",
    drop: "drop",
    rid: "drop"
  }
};

Object.freeze(take);
export default take;
