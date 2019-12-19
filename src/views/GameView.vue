<template>
  <div class="full-height">
    <tea-pushlayout ref="pushout">
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
              <div>Tea Engine: Prototype (not even alpha)</div>
            </div>
          </nav>
        </template>

        <template v-slot:content>
          <div
            aria-live="polite"
            role="region"
            aria-relevent="additions removals text"
            tabindex="0"
          >
            <app-scene :things="things" :location="location"></app-scene>
          </div>
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
                v-on:click="handlePushout('locations')"
              >
                <i class="fas fa-compass" aria-hidden="true"></i>
              </button>
              <button
                class="full-width"
                ref="inventoryButton"
                aria-controls="sidenav2"
                aria-label="Open Locations Side menu"
                v-on:click="handlePushout('inventory')"
              >
                <i class="fas fa-toolbox" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </template>
      </app-layout>

      <div slot="menu">
        <div v-if="activePushout==='locations'">
          <app-locations :location="location" :locations="locations"></app-locations>
        </div>
        <div v-if="activePushout==='inventory'">
          <app-inventory :inventory="inventory"></app-inventory>
        </div>
      </div>
    </tea-pushlayout>

    <tea-overlaynav id="sidenav1" ref="sidenav1" :data-open="open.sidenav1" data-position="left">
      <div class="box">
        <app-nav></app-nav>
      </div>
    </tea-overlaynav>
  </div>

  <!-- <div class="full-height">
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
            <div>Tea Engine: Settings</div>
          </div>
        </nav>
      </template>

      <template v-slot:content>
        <router-view></router-view>
      </template>

      <template v-slot:commandbar>
        <div class="bar">
          <app-commander/>
        </div>
      </template>
    </app-layout>

    <tea-sidenav id="sidenav1" ref="sidenav1" :data-open="open.sidenav1" data-position="left">
      <div class="box">
        <app-nav></app-nav>
      </div>
    </tea-sidenav>
  </div>-->
</template>

<script>
import Commander from "../components/Commander";
import Layout from "../components/Layout";
import Nav from "../components/Nav";
import Inventory from "../components/Inventory";
import Locations from "../components/Locations";
import Scene from "../components/Scene";

export default {
  name: "app-gameview",
  components: {
    "app-layout": Layout,
    "app-commander": Commander,
    "app-nav": Nav,
    "app-inventory": Inventory,
    "app-locations": Locations,
    "app-scene": Scene
  },
  computed: {
    open: function() {
      return {
        sidenav1: this.$refs.sidenav1 && this.$refs.sidenav1.isOpen
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
    },
    things: function() {
      return this.$root.game.getActiveThings();
    }
  },
  props: {},
  data: () => ({
    activePushout: null
  }),
  methods: {
    handleOpen: function(sidenavName, triggerName) {
      this.$refs[sidenavName].openWithTrigger(this.$refs[triggerName] || null);
    },
    handlePushout(name) {
      const pushout = this.$refs.pushout;
      const open = JSON.parse(pushout.isOpen);

      if (!open) {
        this.activePushout = name;
        return this.$refs.pushout.open();
      }

      if (open && name === this.activePushout) {
        return this.$refs.pushout.close();
      }

      if (this.open && name !== this.activePushout) {
        return (this.activePushout = name);
      }
    }
  },
  mounted() {}
};
</script>

<style>
</style>
