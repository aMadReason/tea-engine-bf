<template>
  <div>
    <nav>
      <div class="bar"></div>
    </nav>

    <tea-sidenav ref="sidenav" :data-open="open">hi</tea-sidenav>

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

