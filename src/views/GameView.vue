<template>
  <div class="full-height">
    <app-layout>
      <template v-slot:header>
        <nav slot="nav">
          <div class="bar">
            <button
              ref="menuButton"
              aria-controls="sidenav1"
              aria-label="Open Main Side menu"
              v-on:click="handleOpen('sidenav1', 'menuButton')"
              class="float-right"
            >
              <i class="fas fa-bars" aria-hidden="true"></i>
            </button>
            <div>Tea Engine</div>
          </div>
        </nav>
      </template>

      <template v-slot:content>
        <router-view></router-view>
      </template>

      <template v-slot:commandbar>
        <div class="bar">
          <app-commander/>
          <div class="quick-controls">
            <button
              class="full-width"
              ref="locationsButton"
              aria-controls="sidenav2"
              aria-label="Open Locations Side menu"
              v-on:click="handleOpen('sidenav2', 'locationsButton')"
            >
              <i class="fas fa-compass" aria-hidden="true"></i>
            </button>
            <button
              class="full-width"
              ref="inventoryButton"
              aria-controls="sidenav3"
              aria-label="Open Inventory Side menu"
              v-on:click="handleOpen('sidenav3', 'inventoryButton')"
            >
              <i class="fas fa-toolbox" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </template>
    </app-layout>

    <tea-sidenav id="sidenav1" ref="sidenav1" :data-open="open.sidenav1" data-position="left">
      <div class="box">
        <app-nav></app-nav>>
      </div>
    </tea-sidenav>

    <tea-sidenav id="sidenav2" ref="sidenav2" :data-open="open.sidenav2" data-position="right">
      <div class="box">
        <section>
          <header>
            <h1>Locations</h1>
            <small>
              Currently in the
              <strong>{{location.noun | capitalize}}</strong>.
            </small>
          </header>
          <ul class="sidebar-list" v-if="locations.length > 0">
            <li v-for="loc in locations" v-bind:key="loc.name">
              <button class="full-width" v-on:click="changeLocation(loc)">
                {{loc.name | capitalize}}
                <span v-if="location.name === loc.name">
                  <small>(current location)</small>
                </span>
              </button>
            </li>
          </ul>
        </section>
      </div>
    </tea-sidenav>

    <tea-sidenav id="sidenav3" ref="sidenav3" :data-open="open.sidenav3" data-position="right">
      <div class="box">
        <section>
          <header>
            <h1>Inventory</h1>
          </header>
          <ul class="sidebar-list" v-if="inventory.length > 0">
            <li v-for="item in inventory" v-bind:key="item.name">
              <button class="full-width">{{item.name | capitalize}}</button>
            </li>
          </ul>
        </section>
      </div>
    </tea-sidenav>
  </div>
</template>

<script>
import Commander from "../components/Commander";
import Layout from "../components/Layout";
import Nav from "../components/Nav";

export default {
  name: "app-gameview",
  components: {
    "app-layout": Layout,
    "app-commander": Commander,
    "app-nav": Nav
  },
  computed: {
    // routes: function() {
    //   return this.$router.options.routes;
    // },
    open: function() {
      return {
        sidenav1: this.$refs.sidenav1 && this.$refs.sidenav1.isOpen,
        sidenav2: this.$refs.sidenav2 && this.$refs.sidenav2.isOpen,
        sidenav3: this.$refs.sidenav3 && this.$refs.sidenav3.isOpen
      };
    },
    location: function() {
      return this.$root.game.getActiveLocation();
    },
    locations: function() {
      return this.$root.game.locations;
    },
    inventory: function() {
      return this.$root.game.getThingsByLocationKey(null);
    }
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
  methods: {
    setResponse(content) {
      this.response = content;
    },
    handleOpen: function(sidenavName, triggerName) {
      this.$refs[sidenavName].openWithTrigger(this.$refs[triggerName] || null);
    },
    changeLocation(location) {
      this.$root.game.command(`go to ${location.noun}`);
      this.$router.push("/");
    }
  },
  mounted() {}
};
</script>

<style>
</style>
