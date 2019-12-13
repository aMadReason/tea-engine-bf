import { iThing, iGame, iBehaviour, iThingData, iGameData } from "./types";
import { ThingComposer } from "./index";
import pubsub from "./modules/pubsub";
import commandParser from "./modules/commandParser";
import describe from "./behaviours/describe";
import help from "./behaviours/help";

class Game implements iGame {
  location: String = null;
  locations: Array<iThing> = [];
  things: Array<iThing> = [];
  behaviourRegister: Map<String, iBehaviour> = new Map();
  parserPatterns: Object;

  constructor(things = [], locations = [], patterns = {}) {
    this.locations = locations;
    this.things = things;
    this.parserPatterns = patterns;
    //add default behaviours
    Game.defaultBehaviours.map(b => this.registerBehaviour(b));
  }

  static get getPubs() {
    return {
      locationChange: "tea-location-change",
      commandParseCall: "tea-command-parse",
      commandPriorCall: "tea-command-prior",
      commandPostCall: "tea-command-post"
    };
  }

  static get defaultBehaviours() {
    return [describe, help]; // behaviours here are set by default
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

  getThingsByLocationKey(key: String = null): iThing[] {
    return this.things.filter(i => i.locationKey === key);
  }

  getActiveThings(locationKey: String = this.location): iThing[] {
    return this.getThingsByLocationKey(locationKey);
  }

  getThingByKey(key: String): iThing {
    return this.things.find(i => i.key === key);
  }

  getThingsByNoun(
    noun: String,
    describedNoun: String = undefined,
    things: iThing[] = this.getActiveThings()
  ) {
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
    behaviours.map(behaviour => {
      return this.registerBehaviour(behaviour);
    });
  }

  resolveData(data: iThingData) {
    return ThingComposer.resolveThingData(data, this.behaviourRegister, pubsub, this);
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

  parseCommand(cmd: String, patterns = this.parserPatterns) {
    const msg = [];
    const parserResult = commandParser(cmd, patterns);
    const { nouns, verbs, described } = parserResult;
    const verb = verbs[0];
    const locations = this.getLocationsByNoun(nouns[0], described[0]);
    const firstThings = this.getThingsByNoun(nouns[0], described[0]);
    const secondThings = this.getThingsByNoun(nouns[1], described[1]);
    const iThings = this.getThingsByLocationKey(null);
    const inventoryThings = this.getThingsByNoun(nouns[0], described[0], iThings);

    const lLength = locations.length;
    const fLength = firstThings.length;
    const sLength = secondThings.length;
    const iLength = inventoryThings.length;

    const cmdTypes = {
      // order is important
      nav: lLength > 0,
      inventory: verb && iLength > 0 && fLength === 0,
      simple: verb && fLength > 0 && sLength === 0,
      complex: verb && fLength > 0 && sLength > 0
    };

    let type = Object.keys(cmdTypes).find(k => cmdTypes[k] && k) || false;

    // secondary checks
    const simpleDuplicate =
      type === "simple" && fLength >= 2 && firstThings[0].noun === firstThings[1].noun;

    if (simpleDuplicate) {
      type = "simpleDuplicate";
      msg.push(
        `Please be more descriptive and reference ${firstThings
          .map(i => `"${i.describedNoun}"`)
          .join(" or ")}.`
      );
    }

    if (inventoryThings.length >= 2) {
      type = "inventoryDuplicate";
      msg.push(
        `Please be more descriptive and reference ${inventoryThings
          .map(i => `"${i.describedNoun}"`)
          .join(" or ")}.`
      );
    }

    const result = {
      msg,
      ...parserResult,
      verb,
      type,
      locations,
      firstThings,
      secondThings,
      inventoryThings
    };
    pubsub.publish(Game.getPubs.commandParseCall, result);
    return result;
  }

  command(cmd: String, patterns = this.parserPatterns) {
    const result = this.parseCommand(cmd, patterns);
    const { verb, type, locations, firstThings, inventoryThings } = result;
    let valid = false;
    let response = "";

    pubsub.publish(Game.getPubs.commandPriorCall, { ...result });

    if (type === "nav" && locations.length > 0) {
      valid = true;
      response = locations[0].callAction(verb);
    }

    if (type === "simple" && firstThings.length > 0) {
      valid = true;
      response = firstThings[0].callAction(verb);
    }

    if (type === "inventory") {
      valid = true;
      response = inventoryThings[0].callAction(verb);
    }

    pubsub.publish(Game.getPubs.commandPostCall, {
      ...result,
      valid,
      response
    });

    return response;
  }
}
export default Game;
