import { Thing, Game } from "../index";

const use = {
  name: "use",
  properties: {
    uses: 1,
    usesLeft: 1
  },
  methods: {
    use(ins: Thing, game: Game): String {
      const uses = ins.getProperty("uses");
      let usesLeft = ins.getProperty("usesLeft");

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
