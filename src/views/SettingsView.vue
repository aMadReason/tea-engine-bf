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

    <tea-overlaynav id="sidenav1" ref="sidenav1" :data-open="open.sidenav1" data-position="left">
      <div class="box">
        <app-nav></app-nav>
      </div>
    </tea-overlaynav>
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
    routes: function() {
      return this.$router.options.routes;
    },
    open: function() {
      return {
        sidenav1: this.$refs.sidenav1 && this.$refs.sidenav1.isOpen
      };
    }
  },
  props: {},
  data: () => ({}),
  methods: {
    handleOpen: function(sidenavName, triggerName) {
      this.$refs[sidenavName].openWithTrigger(this.$refs[triggerName] || null);
    }
  },
  mounted() {}
};
</script>

<style>
</style>
