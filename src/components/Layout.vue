<template>
  <div>
    <nav>
      <div class="bar">
        <ul class="inline float right">
          <li>item 1</li>
          <li>
            <button v-on:click="handleOpen">test</button>
          </li>
        </ul>
      </div>
    </nav>

    <tea-sidenav ref="sidenav" :data-open="open">
      hi
      <a href="#">test</a>
    </tea-sidenav>

    <section>Hi</section>
  </div>
</template>

<script>
export default {
  name: "app-layout",
  computed: {
    open: function() {
      return this.$refs.sidenav && this.$refs.sidenav.isOpen;
    }
  },
  data: () => ({}),
  components: {},
  methods: {
    handleOpen: function() {
      this.$refs.sidenav.open();
    }
  }
};
</script>

