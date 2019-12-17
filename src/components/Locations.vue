<template>
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
          <button class="full-width" v-on:click="$root.changeLocation(loc)">
            {{loc.name | capitalize}}
            <span v-if="location.name === loc.name">
              <small>(current location)</small>
            </span>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "app-locations",
  components: {},
  props: ["locations", "location"],
  data: () => ({}),
  methods: {}
};
</script>

<style scoped>
</style>

