<template>
  <div class="full-height">
    <div class="layout">
      <header>
        <slot name="header"></slot>
        <!-- <nav slot="nav">
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
        </nav>-->
      </header>

      <section class="box content">
        <slot name="content"></slot>
      </section>

      <!-- <div class="bar"> -->
      <slot name="commandbar"></slot>
      <!-- <app-commander/> -->
      <!-- <div class="quick-controls">
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
      </div>-->
      <!-- </div> -->
    </div>

    <!-- <tea-sidenav id="sidenav1" ref="sidenav1" :data-open="open.sidenav1" data-position="left">
      <div class="box">
        <ul class="sidebar-list">
          <li>
            <button class="full-width" v-on:click="$router.push('/')">
              <i class="fas fa-home" aria-hidden="true"></i> Home
            </button>
          </li>
          <li>
            <button class="full-width" v-on:click="$router.push('/locations')">
              <i class="far fa-compass" aria-hidden="true"></i> Locations
            </button>
          </li>
          <li>
            <button class="full-width" v-on:click="$router.push('/inventory')">
              <i class="fas fa-toolbox" aria-hidden="true"></i> Inventory
            </button>
          </li>
          <li>
            <button class="full-width" v-on:click="$router.push('/settings')">
              <i class="fas fa-cog" aria-hidden="true"></i> Settings
            </button>
          </li>
        </ul>
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
            <li v-for="loc in locations" v-bind:key="loc.noun">
              <button class="full-width" v-on:click="handleChangeLocation">
                <i class="fas fa-home" aria-hidden="true"></i> Home
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
          <ul class="sidebar-list">
            <li>
              <button class="full-width" v-on:click="$router.push('/')">
                <i class="fas fa-home" aria-hidden="true"></i> Home
              </button>
            </li>
          </ul>
        </section>
      </div>
    </tea-sidenav>-->
  </div>
</template>

<script>
import Commander from "./Commander";

export default {
  name: "app-layout",
  components: {
    // "app-commander": Commander
  },
  computed: {
    // open: function() {
    //   return {
    //     sidenav1: this.$refs.sidenav1 && this.$refs.sidenav1.isOpen,
    //     sidenav2: this.$refs.sidenav2 && this.$refs.sidenav2.isOpen,
    //     sidenav3: this.$refs.sidenav3 && this.$refs.sidenav3.isOpen
    //   };
    // },
    // location: function() {
    //   return this.$root.game.getActiveLocation();
    // },
    // locations: function() {
    //   return this.$root.game.locations;
    // }
  },
  data: () => ({}),
  methods: {
    // handleOpen: function(sidenavName, triggerName) {
    //   this.$refs[sidenavName].openWithTrigger(this.$refs[triggerName] || null);
    // },
    // changeLocation(location) {
    //   this.$root.game.command(`go to ${location.noun}`);
    //   this.$router.push("/");
    // }
  }
};
</script>

<style>
.sidebar-list > li {
  margin: calc(var(--tea-spacing) / 2) 0;
}

.bar {
  clear: both;
  width: 100%;
  background: var(--tea-bg-3, slategrey);
  padding: 1rem 0;
  display: flex;
  flex: row wrap;
  text-align: center;
}

.bar > * {
  vertical-align: top;
  margin: 0 calc(var(--tea-spacing) / 2);
}

.box {
  padding: calc(var(--tea-spacing) / 2);
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;  
}

.layout {
  height: 100%;;
  display: flex;
  flex-direction: column;
}

.layout > * {
  vertical-align: top;
  align-items: top;
}

.layout .content {
  flex: 1;
  overflow-y: auto;

}

.quick-controls {
  margin-left: 0;
}

.quick-controls > button {
  margin: 1px 0;
}
</style>

