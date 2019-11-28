import { iThing, iGame, iBehaviour, iThingData, iGameData } from "./types";
import { ThingComposer } from "./index";
import pubsub from "./modules/pubsub";
import commandParser from "./modules/commandParser";
import describe from "./behaviours/describe";

class Game implements iGame {
  location: String = null;
  locations: Array<iThing> = [];
  things: Array<iThing> = [];
  behaviourRegister: Map<String, iBehaviour> = new Map();

  constructor(things = [], locations = []) {
    this.locations = locations;
    this.things = things;
    //add default behaviours
    Game.defaultBehaviours.map(b => this.registerBehaviour(b));
  }

  static get getPubs() {
    return {
      locationChange: "tea-location-change",
      commandPriorCall: "tea-command-prior",
      command: "tea-command"
    };
  }

  static get defaultBehaviours() {
    // behaviours here are set by default
    return [describe];
  }

  subscribe(eventName: string, callback: Function) {
    return pubsub.subscribe(eventName, callback);
  }

  addThing(thing: iThing): void {
    this.things.push(thing);
  }

  addLocation(thing: iThing): void {
    this.locations.push(thing);
  }

  getActiveLocation(): iThing {
    return this.locations.find(i => i.key === this.location);
  }

  getLocationByKey(key: String = null): iThing {
    return this.locations.find(i => i.key === key);
  }

  setLocationByKey(key: String = null) {
    const { locations } = this;
    const from = this.getLocationByKey(this.location);
    const to = this.getLocationByKey(key);

    if (to && to.key !== from.key) {
      this.location = to.key;
      pubsub.publish(Game.getPubs.locationChange, { from, to });
    }

    if (!to && locations.length > 0) {
      this.location = locations[0].key;
    }
  }

  /**
   * Returns all Things in an location via a key
   * @param key
   */
  getThingsByLocationKey(key: String): iThing[] {
    return this.things.filter(i => i.locationKey === key);
  }

  /**
   * by default returns all things in the active location
   * if a location key is passed it will return all things in there
   * @param locationKey
   */
  getActiveThings(locationKey: String = this.location): iThing[] {
    return this.getThingsByLocationKey(locationKey);
  }

  /**
   * searches all things for one with a matching key
   * @param key
   */
  getThingByKey(key: String): iThing {
    return this.things.find(i => i.key === key);
  }

  getThingsByNoun(noun: String, describedNoun: String = undefined) {
    const things = this.getActiveThings();
    return things.filter(t => {
      const isDescribed = t.describedNoun === describedNoun;
      const isNoun = noun && t.noun === noun;
      if (describedNoun && isDescribed && isNoun) return true;
      if (!describedNoun && isNoun) return true;
      return false;
    });
  }

  getLocationsByNoun(noun: String, describedNoun: String = undefined) {
    const locations = this.getLocations();
    return locations.filter(t => {
      const isDescribed = t.describedNoun === describedNoun;
      const isNoun = noun && t.noun === noun;
      if (describedNoun && isDescribed && isNoun) return true;
      if (!describedNoun && isNoun) return true;
      return false;
    });
  }

  /**
   * returns all things
   */
  getThings(): iThing[] {
    return this.things;
  }

  getLocations() {
    return this.locations;
  }

  registerBehaviour(behaviour: iBehaviour) {
    this.behaviourRegister.set(behaviour.name, behaviour);
  }

  registerBehaviours(behaviours: iBehaviour[]) {
    console.log(behaviours);
    behaviours.map(behaviour => {
      return this.registerBehaviour(behaviour);
    });
  }

  resolveData(data: iThingData) {
    return ThingComposer.resolveThingData(
      data,
      this.behaviourRegister,
      pubsub,
      this
    );
  }

  // does some pre-processing on iThingData for things like default behaviours
  preThingResolution(data: iThingData): iThingData {
    const defaultBehaviors = Game.defaultBehaviours.map(i => i.name);
    const dataBehaviours = data.behaviours || [];
    const behaviours = [...new Set([...defaultBehaviors, ...dataBehaviours])];
    const processedData = { ...data, behaviours };
    return processedData;
  }

  resolveThingData(data: iThingData) {
    const processedData = this.preThingResolution(data);
    this.addThing(this.resolveData(processedData));
  }

  resolveLocationData(data: iThingData) {
    const processedData = this.preThingResolution(data);
    this.addLocation(this.resolveData(processedData));
  }

  resolveLocationDataList(dataArray: Array<iThingData>) {
    dataArray.map(i => this.resolveLocationData(i));
  }

  resolveThingDataList(dataArray: Array<iThingData>) {
    dataArray.map(i => this.resolveThingData(i));
  }

  resolveGameData(data: iGameData) {
    const { locations, things, location = null } = data;
    if (things) this.resolveThingDataList(things);
    if (locations) this.resolveLocationDataList(locations);
    this.setLocationByKey(location);
  }

  parseCommand(cmd: String) {
    const parserResult = commandParser(cmd);
    const { nouns, verbs, described } = parserResult;
    const verb = verbs[0];
    const locations = this.getLocationsByNoun(nouns[0], described[0]);
    const firstThings = this.getThingsByNoun(nouns[0], described[0]);
    const secondThings = this.getThingsByNoun(nouns[1], described[1]);
    const inventoryThings = this.getThingsByLocationKey(null);
    return {
      parserResult,
      verb,
      locations,
      firstThings,
      secondThings,
      inventoryThings
    };
  }

  command(cmd: String) {
    const {
      parserResult,
      verb,
      locations,
      firstThings,
      secondThings,
      inventoryThings
    } = this.parseCommand(cmd);
    const msg = [];
    let response = "";

    const cmdTypes = {
      nav: locations.length > 0,
      simple: verb && firstThings.length > 0 && secondThings.length === 0,
      complex: verb && firstThings.length > 0 && secondThings.length > 0,
      inventory: verb && inventoryThings.length > 0
    };

    const type = Object.keys(cmdTypes).find(k => cmdTypes[k] && k) || false;

    if (type) {
      if (type === "nav") response = locations[0].callAction(verb);
      if (type === "simple") response = firstThings[0].callAction(verb);
      if (type === "inventory") response = inventoryThings[0].callAction(verb);
    }

    pubsub.publish(Game.getPubs.command, {
      msg,
      response,
      parserResult,
      firstThings,
      secondThings
    });

    return response;
  }
}
export default Game;
