<template>
  <v-dialog v-model="dialog" width="600" overlay-color="darkBlue">
    <v-card class="pa-8 rounded-lg">
      <div class="ml-2">
        <img class="icon" :src="require(`assets/img/icons/Delete.svg`)" />
      </div>
      <v-card-title
        v-if="title"
        class="blue--text text-h1 px-3 pr-4"
        style="margin-left: -5px"
      >
        {{ $t(title) }}
      </v-card-title>

      <v-card-text
        v-if="text"
        class="darkGray--text text-b1"
        style="margin-left: -17px"
      >
        {{ $t(text) }}</v-card-text
      >

      <v-card-actions v-if="confirm" class="px-2">
        <v-btn
          rounded
          depressed
          elevation="0"
          color="red"
          class="text-body-2 white--text"
          :loading="loading"
          @click="emitDelete"
        >
          {{ $t(confirm) }}
        </v-btn>

        <v-btn
          rounded
          depressed
          elevation="0"
          class="text-body-2"
          @click="dialog = false"
        >
          {{ $t('cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    confirm: {
      type: String,
      default: null,
    },
    close: {
      type: Boolean,
      default: false,
    },
    closeDialog: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialog: this.value,
      loading: false,
    }
  },
  watch: {
    value(newVal) {
      this.dialog = newVal
    },

    dialog(value) {
      this.$emit('input', value)
    },

    close(oldVal, newVal) {
      if (newVal) {
        this.loading = false
        this.dialog = false
      }
    },
  },
  methods: {
    emitDelete() {
      this.$emit('delete', this.item)
      if (this.closeDialog) this.dialog = false
      else this.loading = true
    },
  },
}
</script>

<style scoped lang="scss">
.v-overlay--active {
  background: rgba(6, 6, 50, 0.4) !important;
}
.icon {
  width: 50px !important;
  height: 50px !important;
}
</style>
