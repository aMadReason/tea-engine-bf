<template>
  <app-layout/>
  <!-- <div id="app">
    
    Current location: {{location.noun}}.
    <ul v-if="locations && locations.length > 0">
      <li v-for="(i, idx) in locations" v-bind:key="idx+'-'+i.key">
        <button v-on:click="changeLocation(i.key)">{{i.key}}</button>
      </li>
    </ul>
    <hr>
    {{describeLocation()}}
    <hr>

    <ul v-if="things && things.length > 0">
      <li v-for="(i, idx) in things" v-bind:key="idx+'-'+i.noun">{{i.callAction('describe')}}</li>
    </ul>

    <hr>

    <form v-on:submit="e => submitCommand(e)">
      <label>
        Command:
        <input v-model="inputCommand" type="text">
      </label>
      <button type="submit">Go</button>
    </form>

    <ul v-if="msg.length > 0">
      <li v-for="(i, idx) in msg" v-bind:key="idx">{{i}}</li>
    </ul>

    <div>{{response}}</div>

    <hr>Inventory:
    <ul v-if="things && inventoryThings.length > 0">
      <li
        v-for="(i, idx) in inventoryThings"
        v-bind:key="idx+'-'+i.noun"
      >{{i.describedNoun || i.noun}}</li>
    </ul>
  </div>-->
</template>

<script>
import Layout from "./components/Layout";

export default {
  name: "app-main",
  components: {
    "app-layout": Layout
  },
  props: {
    source: String
  },
  data: () => ({
    inputCommand: "",
    msg: [],
    response: null,
    drawer: null
  }),
  computed: {
    // game: function() {
    //   return this.$root.game;
    // },
    // locations: function() {
    //   return this.$root.game.locations;
    // },
    // location: function() {
    //   return this.$root.game.getActiveLocation();
    // },
    // things: function() {
    //   return this.$root.game.getActiveThings();
    // },
    // inventoryThings: function() {
    //   return this.$root.game.getThingsByLocationKey(null);
    // }
  },
  methods: {
    setResponse(content) {
      this.response = content;
    }
    // changeLocation(key) {
    //   this.game.setLocationByKey(key);
    // },
    // describeLocation: function() {
    //   return this.location.callAction("describe");
    // },
    // submitCommand(event) {
    //   event.preventDefault();
    //   this.game.command(this.inputCommand);
    //   this.inputCommand = "";
    // },
    // handleCommand(data) {
    //   const { verb, valid } = data;
    //   this.msg = data.msg;
    //   this.response = data.response;
    //   const takeActs = "take|pick|drop|leave";
    //   if (valid) {
    //     if (takeActs.includes(verb)) effects.play("handleSmallLeather");
    //   }
    // }
  },
  mounted() {
    //console.log(this.$root.game);
    //this.$root.game.subscribe("tea-command-post", data => this.handleCommand(data));
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
