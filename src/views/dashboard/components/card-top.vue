<template>
  <div id='topCard'>
    <div class="topCard-wrap">
      <p class="title">
        <span>{{ title }}</span>
        <span>今日</span>
      </p>
      <p class="title-num">{{ titleNum }}</p>
      <p class="yesterday-num">
        <span>昨日数据</span>
        <span>{{ yesterdayNmu }}{{ unit }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopCard',
  components: {
  },
  props: {
    title: String,
    titleNum: String,
    yesterdayNmu: String,
    unit: String
  },
  data() {
    return {
    }
  },
  created() {
  },
  computed: {
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.topCard-wrap {
  @include wrap-base-style;
  padding: 20px;

  .title {
    @include flex-between-center;

    span:nth-of-type(2) {
      font-size: 12px;
      color: $title-span-font-color-card-top;
      background-color: $title-span-background-color-card-top;
      border: 1px solid $title-span-border-color-card-top;
      padding: 5px 10px;
      border-radius: 4px;
    }
  }

  .title-num {
    font-size: 30px;
    font-weight: bold;
    border-bottom: 1px solid $titleNum-border-bottom-color-card-top;
    padding: 15px 0;
  }

  .yesterday-num {
    @include flex-between-center;
    margin-top: 20px;
  }
}
</style>
