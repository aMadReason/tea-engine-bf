<template>
  <article>
    <h1>Locations</h1>
    <hr>

    <ul v-if="locations && locations.length > 0">
      <li v-for="(i, idx) in locations" v-bind:key="idx+'-'+i.noun">
        <button
          v-on:click="changeLocation(i)"
          class="full-width spaced"
        >Go to {{i.noun | capitalize}}</button>
      </li>
    </ul>
  </article>
</template>

<script>
export default {
  name: "app-locations",
  props: [],
  computed: {
    location: function() {
      return this.$root.game.getActiveLocation();
    },
    locations: function() {
      return this.$root.game.locations;
    }
  },
  data: () => ({}),
  methods: {
    changeLocation(location) {
      this.$root.game.command(`go to ${location.noun}`)
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.spaced {
  margin: calc(var(--tea-spacing, 0.5rem)/2) 0;
}
</style>

