import { iThingData, iBehaviour, iGame, iPubsub } from "./types";
import { Thing } from "./index";

class ThingComposer {
  static resolve(thing: Thing, data: iThingData | iBehaviour, Game: iGame) {
    const { properties, methods, actions } = data;

    if (properties) {
      Object.keys(properties).map(p => thing.setProperty(p, properties[p]));
    }

    if (methods) {
      Object.keys(methods).map(m => thing.setMethod(m, methods[m]));
    }

    if (actions) {
      Object.keys(actions).map(a => thing.setAction(a, actions[a]));
    }

    return thing;
  }

  static resolveThingData(
    data: iThingData,
    behaviourRegister: Map<String, iBehaviour>,
    pubsub: iPubsub,
    Game: iGame
  ): Thing {
    const { noun, describedNoun, behaviours, locationKey, key } = data;
    const thing = new Thing({ noun, describedNoun, locationKey, key, pubsub });

    // resolved behaviour
    if (behaviours) {
      behaviours.map(b => {
        const behaviour = behaviourRegister.get(b);
        return ThingComposer.resolve(thing, behaviour, Game);
      });
    }

    // resolved any Thing specifics, which take priority over behaviour
    return ThingComposer.resolve(thing, data, Game);
  }
}

export default ThingComposer;
