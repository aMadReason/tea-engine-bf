<template>
  <div class="full-height">
    <div class="layout">
      <header>
        <nav>
          <div class="bar">
            <button
              ref="menuButton"
              aria-controls="side"
              aria-label="OpenSide menu"
              v-on:click="handleOpen"
              class="float-right"
            >
              <i class="fas fa-bars" aria-hidden="true"></i>
            </button>
            <div>Tea Engine</div>
          </div>
        </nav>
      </header>

      <section class="box content">
        <router-view></router-view>
      </section>

      <div class="bar">
        <app-commander/>
      </div>
    </div>
    <tea-sidenav id="side" ref="sidenav" :data-open="open">
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
  </div>
</template>

<script>
import Commander from "./Commander";

export default {
  name: "app-layout",
  components: {
    "app-commander": Commander
  },
  computed: {
    open: function() {
      return this.$refs.sidenav && this.$refs.sidenav.isOpen;
    }
  },
  data: () => ({}),
  methods: {
    handleOpen: function() {
      this.$refs.sidenav.openWithTrigger(this.$refs.menuButton || null);
    }
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

</style>

