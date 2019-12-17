<template>
  <tea-pushlayout class="full-height">
    <slot name="content"></slot>
    <slot name="menu"></slot>
  </tea-pushlayout>
  <!-- <div class="full-height">
    <div class="layout">
      <header>
        <slot name="header"></slot>
      </header>

      <section class="box content">
        <slot name="content"></slot>
      </section>

      <slot name="commandbar"></slot>
    </div>
  </div>-->
</template>

<script>
export default {
  name: "app-pushlayout",
  components: {},
  computed: {},
  data: () => ({}),
  methods: {}
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
  flex-wrap: wrap;
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

