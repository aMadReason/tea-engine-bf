<template>
  <section>
    <header>
      <h1>Menu</h1>
    </header>
    <ul class="sidebar-list">
      <li v-for="(r, i) in routes" v-bind:key="i">
        <button class="full-width" v-on:click="$router.push(r.path)">
          <i :class="r.icon" aria-hidden="true"></i>
          {{r.label}}
        </button>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "app-nav",
  props: [],
  computed: {
    routes: function() {
      return this.$router.options.routes;
    }
  },
  data: () => ({}),
  methods: {}
};
</script>

<style scoped>
</style>

