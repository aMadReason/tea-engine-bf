export interface iPair<K, V> {
  key: K;
  value: V;
}

export interface iProperties<T> {
  [propName: string]: T;
}

export interface iPubsub {
  subs: Map<String, Function>;
  subscribe: Function;
  publish: Function;
}

export interface iThing {
  key: String;
  pubsub: iPubsub;
  locationKey: String;
  noun: String;
  game: iGame; // eslint-disable-line
  describedNoun: String;
  name: String;
  methods: Map<String, Function>;
  properties: Map<
    String,
    Boolean | Number | String[] | Number[] | iProperties<String> | iProperties<Boolean>
  >;
  actions: Map<String, String>; // maps verbs to method key
  callAction: Function;
  getAction: Function;
  getActionKeys: Function;
  setLocationKey: Function;
}

// matches json
export interface iThingData {
  key?: String;
  locationKey?: String;
  noun: String;
  describedNoun?: String;
  behaviours?: Array<String>;
  methods?: iProperties<Function>;
  properties?: iProperties<String> | iProperties<Boolean> | iProperties<Number>;
  actions?: iProperties<String>; // maps verbs to method key
}

export interface iBehaviour {
  name?: String;
  methods: iProperties<Function>;
  properties: Map<
    String,
    Boolean | Number | String[] | Number[] | iProperties<String> | iProperties<Boolean>
  >;
  actions: iProperties<String>; // maps verbs to method key
  //fn(instance: iThing): iThing;
}

export interface iGame {
  location: String;
  locations: Array<iThing>;
  things: Array<iThing>;
  behaviourRegister?: Map<String, iBehaviour>;
  parserPatterns?: Object;
  setLocationByKey: Function;
  getActiveLocation: Function;
  getThingsByLocationKey: Function;
}

export interface iGameData {
  location?: String;
  locations: Array<iThingData>;
  things: Array<iThingData>;
}
