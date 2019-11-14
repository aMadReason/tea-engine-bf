<template>
  <div id="app">
    <ul>
      <li v-for="i in locations" v-bind:key="i.key">
        <button v-on:click="changeLocation(i.key)">{{i.key}}</button>
      </li>
    </ul>
    <hr>
    {{describeLocation()}}
    <hr>

    <ul>
      <li v-for="i in things" v-bind:key="i.noun">{{i.callAction('describe')}}</li>
    </ul>
  </div>
</template>

<script>
//import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {},
  computed: {
    locations: function() {
      return this.$root.game.locations;
    },
    location: function() {
      return this.$root.game.getLocation();
    },
    things: function() {
      return this.$root.game.getThings();
    }
  },
  methods: {
    changeLocation(key) {
      this.$root.game.setLocationByKey(key);
    },
    describeLocation: function() {
      return this.location.callAction("describe");
    }
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
