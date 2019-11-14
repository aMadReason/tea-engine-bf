import { iThing, iGame, iBehaviour, iThingData, iGameData } from "./types";
import { ThingComposer } from "./index";
import pubsub from "./pubsub";
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
    //this.registerBehaviour(describe);
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

  getLocation(): iThing {
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
      pubsub.publish("tea-location-change", { from, to });
    }

    if (!to && locations.length > 0) {
      this.location = locations[0].key;
    }
  }

  getThingsByLocationKey(key: String) {
    return this.things.filter(i => i.locationKey === key);
  }

  getThings(locationKey: String = this.location) {
    return this.getThingsByLocationKey(locationKey);
  }

  registerBehaviour(behaviour: iBehaviour) {
    this.behaviourRegister.set(behaviour.name, behaviour);
  }

  resolveData(data: iThingData) {
    return ThingComposer.resolveThingData(data, this.behaviourRegister, this);
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
}
export default Game;
