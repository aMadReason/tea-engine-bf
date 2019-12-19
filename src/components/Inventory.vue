<template>
  <div class="box">
    <section>
      <header>
        <h1>Inventory</h1>
      </header>
      <ul class="sidebar-list" v-if="inventory.length > 0">
        <li v-for="item in inventory" v-bind:key="item.name">
          <app-invitem :thing="item"></app-invitem>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import InventoryItem from "./InventoryItem";

export default {
  name: "app-inventory",
  components: {
    "app-invitem": InventoryItem
  },
  props: ["inventory"],
  data: () => ({}),
  methods: {}
};
</script>

<style scoped>
</style>

