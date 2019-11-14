import uuid from "./uuid";
import { iThing, iProperties, iPubsub } from "./types";

class Thing implements iThing {
  key: String;
  pubsub: iPubsub;
  noun: String;
  locationKey: String;
  describedNoun: String;
  methods: Map<String, Function> = new Map();
  properties: Map<
    String,
    String | Number | String[] | Number[] | iProperties<String>
  > = new Map();
  actions: Map<String, String> = new Map(); // maps verbs to method key

  constructor({
    noun,
    pubsub,
    describedNoun = undefined,
    locationKey = undefined,
    key = uuid()
  }: {
    noun: String;
    pubsub: iPubsub;
    describedNoun?: String;
    locationKey?: String;
    key?: String;
  }) {
    this.key = key;
    this.pubsub = pubsub;
    this.noun = noun;
    this.locationKey = locationKey;
    this.describedNoun = describedNoun;
    return this;
  }

  setProperty(
    key: String,
    value: String | Number | String[] | Number[] | iProperties<String>
  ) {
    this.properties.set(key, value);
    return this;
  }

  getProperty(key: String) {
    return this.properties.get(key);
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
  }

  setAction(verb: String, methodKey: String) {
    const method = this.methods.get(methodKey);
    if (method) this.actions.set(verb, methodKey);
    return this;
  }

  callAction(verb: String) {
    const action = this.actions.get(verb);
    if (action) return this.callMethod(action);
  }
}

export default Thing;
