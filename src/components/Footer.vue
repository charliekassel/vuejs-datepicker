<template>
  <div
    class="footer"
    :class="footerClass"
  >
    <button
      class="today-button"
      :class="todayButtonClass"
      type="button"
      @click="setToday"
    >
      Today
    </button>

    <button
      v-if="selectedDate"
      class="clear-button"
      :class="clearButtonClass"
      type="button"
      @click="clearDate"
    >
      Clear
    </button>
  </div>
</template>

<script>
export default {
  props: {
    selectedDate: Date,
    clearDate: Function,
    setToday: Function,
    footerClass: [String, Object, Array],
    todayButtonClass: [String, Object, Array],
    clearButtonClass: [String, Object, Array]
  }
}
</script>

<style lang="stylus" scoped>
.footer
  display: flex
  align-items: center
  justify-content: flex-end
  padding: 1rem

  .clear-button
    margin-left: 1rem
</style>
