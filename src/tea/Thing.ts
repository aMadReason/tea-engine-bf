import uuid from "./modules/uuid";
import { iThing, iProperties, iPubsub, iGame } from "./types";

class Thing implements iThing {
  key: String;
  pubsub: iPubsub;
  noun: String;
  game: iGame;
  locationKey: String; // if null = in inventory
  describedNoun: String;
  name: String;
  methods: Map<String, Function> = new Map();
  properties: Map<
    String,
    Number | String[] | Number[] | iProperties<String> | iProperties<Boolean>
  > = new Map();
  actions: Map<String, String> = new Map(); // maps verbs to method key

  constructor({
    noun,
    pubsub,
    game,
    describedNoun = undefined,
    locationKey = undefined,
    key = uuid()
  }: {
    noun: String;
    pubsub: iPubsub;
    game: iGame;
    describedNoun?: String;
    locationKey?: String;
    key?: String;
  }) {
    this.key = key;
    this.pubsub = pubsub;
    this.noun = noun;
    this.game = game;
    this.locationKey = locationKey;
    this.describedNoun = describedNoun;
    this.name = describedNoun || noun;
    return this;
  }

  setProperty(
    key: String,
    value:
      | String
      | Boolean
      | Number
      | String[]
      | Number[]
      | iProperties<String>
      | iProperties<Boolean>
  ) {
    this.properties.set(key, value);
    return this;
  }

  getProperty(
    key: String
  ): String | Boolean | Number | String[] | Number[] | iProperties<String> | iProperties<Boolean> {
    return this.properties.get(key);
  }

  setLocationKey(key: String) {
    this.locationKey = key;
  }

  setMethod(key: String, value: Function) {
    this.methods.set(key, value);
    return this;
  }

  getMethod(key: String) {
    return this.methods.get(key);
  }

  callMethod(key: String, instance: iThing = this) {
    const method = this.methods.get(key);
    if (method) return method(instance);
    return false;
  }

  setAction(verb: String, methodKey: String) {
    const method = this.methods.get(methodKey);
    if (method) this.actions.set(verb, methodKey);
    return this;
  }

  getAction(verb: String) {
    return () => this.callAction(verb);
  }

  getActionKeys() {
    return [...this.actions.keys()];
  }

  callAction(verb: String, instance: iThing = this) {
    const action = this.actions.get(verb);
    if (action) return this.callMethod(action);
    return false;
  }
}

export default Thing;
