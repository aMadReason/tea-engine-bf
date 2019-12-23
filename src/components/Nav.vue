<template>
  <section>
    <header>
      <h1>Menu</h1>
    </header>
    <ul class="sidebar-list">
      <li v-for="(r, i) in routes" v-bind:key="i">
        <router-link class="full-width inline block" :to="r.path">
          <i :class="r.icon" aria-hidden="true"></i>
          {{r.label}}
        </router-link>

        <!-- <span v-if="route.path === r.path" class="full-width inline block">
          <i :class="r.icon" aria-hidden="true"></i>
          {{r.label}}
        </span>-->
        <!-- <button
          :disabled="route.path === r.path"
          class="full-width"
          v-on:click="$router.push(r.path)"
        >
          <i :class="r.icon" aria-hidden="true"></i>
          {{r.label}}
        </button>-->
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "app-nav",
  props: [],
  computed: {
    route: function() {
      return this.$router.currentRoute;
    },
    routes: function() {
      return this.$router.options.routes;
    }
  },
  data: () => ({}),
  methods: {
    renderLink(item) {
      if (this.route.path !== item.path) {
        return (
          <router-link class="full-width" to="r.path">
            Go to Foo
          </router-link>
        );
      }
    }
  }
};
</script>

<style scoped>
</style>

