import { Thing, Game } from "../index";

const use = {
  name: "use",
  properties: {
    uses: 1,
    usesLeft: 1
  },
  methods: {
    use(instance: Thing, game: Game): String {
      const uses = instance.getProperty("uses");
      let usesLeft = instance.getProperty("usesLeft");

      usesLeft = +usesLeft - 1;

      if (usesLeft <= 0) {
      }

      return "";
    }
  },
  actions: {
    use: "use"
  }
};

Object.freeze(use);
export default use;
