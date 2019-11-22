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
  describedNoun: String;
  methods: Map<String, Function>;
  properties: Map<
    String,
    String | Number | String[] | Number[] | iProperties<String>
  >;
  actions: Map<String, String>; // maps verbs to method key
  callAction: Function;
  getActionKeys: Function;
}

// matches json
export interface iThingData {
  key?: String;
  locationKey?: String;
  noun: String;
  describedNoun?: String;
  behaviours?: Array<String>;
  methods?: iProperties<Function>;
  properties?: iProperties<String | Number | String[] | Number[]>;
  actions?: iProperties<String>; // maps verbs to method key
}

export interface iBehaviour {
  name?: String;
  methods: iProperties<Function>;
  properties: iProperties<
    String | Number | Array<String> | iProperties<String>
  >;
  actions: iProperties<String>; // maps verbs to method key
  //fn(instance: iThing): iThing;
}

export interface iGame {
  location: String;
  locations: Array<iThing>;
  things: Array<iThing>;
  behaviourRegister?: Map<String, iBehaviour>;
}

export interface iGameData {
  location?: String;
  locations: Array<iThingData>;
  things: Array<iThingData>;
}
