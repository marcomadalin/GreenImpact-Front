<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title class="text-h6 red--text mb-0">
        {{ title }}
      </v-card-title>

      <v-card-text class="black--text">
        {{ text }}
      </v-card-text>

      <v-card-actions>
        <v-btn
          small
          rounded
          elevation="0"
          color="red"
          class="white--text"
          @click="$emit('remove-action', true)"
        >
          {{ continueT }}
        </v-btn>

        <v-btn small rounded elevation="0" @click="dialog = false">
          {{ cancelT }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    continueTitle: {
      type: String,
      default: '',
    },
    cancelTitle: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      dialog: this.value,
    }
  },

  computed: {
    continueT() {
      return this.continueTitle || this.$t('continue')
    },
    cancelT() {
      return this.cancelTitle || this.$t('cancel')
    },
  },

  watch: {
    value(newVal) {
      this.dialog = newVal
    },

    dialog(value) {
      this.$emit('input', value)
    },
  },
}
</script>
