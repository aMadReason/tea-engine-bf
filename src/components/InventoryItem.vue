<template>
  <div class="box inventory-item">
    <article>
      <h1>{{thing.name}}</h1>
      <div class="acts">
        <button
          class="small"
          v-for="act in actions"
          v-bind:key="act"
          v-on:click="$root.handleAction(act, thing.name)"
        >{{act}}</button>
      </div>
      <details>
        <summary>Description</summary>
        {{ thing.callMethod("describe")}}
      </details>
      <footer></footer>
    </article>
  </div>
</template>

<script>
export default {
  name: "app-inventoryitem",
  props: ["thing"],
  computed: {
    actions: function() {
      const displayActs = ["examine", "drop"];
      const acts = this.thing.getActionKeys().filter(i => displayActs.includes(i));
      return acts;
    }
  },
  data: () => ({}),
  methods: {}
};
</script>

<style scoped>
.inventory-item {
  background: var(--tea-bg-2, grey);
}

.acts {
  display: flex;
}
</style>