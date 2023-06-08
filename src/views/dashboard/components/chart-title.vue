<template>
  <div id="chartTitle">
    <div class="chartTitle-wrap">
      <div class="title">
        {{ title }}
      </div>
      <div class="time">
        <slot name="buttons"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartTitle',
  components: {},
  props: {
    title: String,
  },
  data() {
    return {}
  },
  created() {},
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.chartTitle-wrap {
  @include flex-between-center;
  padding: 15px 20px;
  border-bottom: 1px solid $border-color-card-top;

  .title {
    font-size: 16px;
    font-weight: bold;
    color: $font-color-chart-title;
    border-left: 3px solid $title-span-font-color-card-top;
    padding: 0 5px;
  }
}
</style>
