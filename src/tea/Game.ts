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
    });
  }

  /**
   * returns all things
   */
  getThings(): iThing[] {
    return this.things;
  }

  registerBehaviour(behaviour: iBehaviour) {
    this.behaviourRegister.set(behaviour.name, behaviour);
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

  command(cmd: String) {
    const parserResult = commandParser(cmd);
    const { nouns, verbs, described, command } = parserResult;
    const msg = [];
    let txt = "";
    let response = "";
    const firstThings = this.getThingsByNoun(nouns[0], described[0]);
    const secondThings = this.getThingsByNoun(nouns[1], described[1]);

    if (firstThings.length === 0) {
      txt = `There should be at least one noun.`;
      if (!msg.includes(txt)) msg.push(txt);
    }

    if (verbs.length === 0) {
      txt = `There should be at least one verb.`;
      if (!msg.includes(txt)) msg.push(txt);
    }

    if (firstThings.length > 1) {
      txt = `There are ${firstThings.length} things called "${nouns[0]}".`;
      if (!msg.includes(txt)) msg.push(txt);
    }

    if (secondThings.length > 1) {
      txt = `There are ${secondThings.length} things called "${nouns[1]}".`;
      if (!msg.includes(txt)) msg.push(txt);
    }

    if (
      firstThings.length === 1 &&
      secondThings.length === 0 &&
      verbs.length > 0
    ) {
      // simple
      response = firstThings[0].callAction(verbs[0]);
      if (!response) {
        const actions = firstThings[0].getActionKeys();
        response = `Unable to "${command}", valid actions are; ${actions.join(
          ", "
        )}.`;
      }
    }

    if (firstThings.length === 1 && secondThings.length === 1) {
      // complex
    }

    // find actions
    // perform call

    // pubsub.publish(Game.getPubs.commandPostCall, {
    //   msg,
    //   parserResult,
    //   firstThings,
    //   secondThings
    // });

    pubsub.publish(Game.getPubs.command, {
      msg,
      response,
      parserResult,
      firstThings,
      secondThings
    });
  }
}
export default Game;
