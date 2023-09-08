<template>
  <div class="mb-4">
    <v-btn
      rounded
      :color="continueColor"
      :class="continueClass"
      @click.prevent="$emit('next')"
      >{{ continueT }}</v-btn
    >
    <v-btn
      rounded
      elevation="0"
      :color="cancelColor"
      :class="cancelClass"
      @click.prevent="$emit('cancel')"
      >{{ cancelT }}</v-btn
    >
  </div>
</template>

<script>
export default {
  props: {
    continueTitle: String,
    continueColor: {
      type: String,
      default: 'white',
    },
    continueClass: {
      type: String,
      default: 'primary--text text-body-2 plain-shadow',
    },
    cancelTitle: String,
    cancelColor: {
      type: String,
      default: 'lightGray',
    },
    cancelClass: {
      type: String,
      default: 'text-body-2 darkGray--text',
    },
  },

  computed: {
    continueT() {
      return this.continueTitle || this.$t('continue')
    },
    cancelT() {
      return this.cancelTitle || this.$t('cancel')
    },
  },
}
</script>
