<template>
  <v-dialog :key="componentKey" v-model="dialog" width="800">
    <v-card class="pa-8 rounded-lg">
      <v-card-title v-if="edit" class="blue--text text-h1 px-3 mb-8">
        {{ $t('editNote') }}
      </v-card-title>
      <v-card-title v-else class="blue--text text-h1 px-3 mb-8">
        {{ $t('newNote') }}
      </v-card-title>

      <v-text-field
        v-model="titleInput"
        class="mx-4"
        clearable
        filled
        shaped
        :counter="38"
        :rules="[
          (v) => !!v || $t('requiredField'),
          !nameUsed || $t('nameRepeatNote'),
          (v) => !!v && v.length <= 38,
        ]"
        :label="$t('noteTitle')"
      ></v-text-field>

      <v-textarea
        v-model="descriptionInput"
        class="mx-4"
        filled
        clearable
        no-resize
        rows="8"
        shaped
        :rules="[(v) => !!v && v.length > 0]"
        :label="$t('noteDescription')"
      ></v-textarea>

      <v-card-actions>
        <v-btn
          v-if="edit"
          rounded
          depressed
          elevation="0"
          color="primary"
          class="text-body-2 white--text px-4"
          :loading="loading"
          @click="emitEdit"
        >
          {{ $t('updateNote') }}
        </v-btn>
        <v-btn
          v-else
          rounded
          depressed
          elevation="0"
          color="primary"
          class="text-body-2 white--text px-4"
          :loading="loading"
          @click="emitCreate"
        >
          {{ $t('createNote') }}
        </v-btn>

        <v-btn rounded elevation="0" class="text-body-2" @click="emitCancel">
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
    logbook: {
      type: Object,
      default: null,
    },
    item: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    allItems: {
      type: Array,
      default: null,
    },
    close: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: this.value || '',
      titleInput: this.title || '',
      descriptionInput: this.description || '',
      componentKey: 0,
      nameUsed: false,
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
      if (newVal) this.clearModal()
    },
  },
  methods: {
    emitCancel() {
      this.clearModal()
      this.$emit('cancel')
    },
    clearModal() {
      this.loading = false
      this.titleInput = null
      this.descriptionInput = null
      this.nameUsed = false
      this.componentKey += 1
      this.dialog = false
    },
    emitCreate() {
      const data = {
        logBookItemName: this.titleInput,
        logBookItemDescription: '',
        logBookItemNoteText: this.descriptionInput,
        logBookItemType: 'NOTE',
      }
      this.nameUsed = this.allItems.find(
        (item) => item.logBookItemName === this.titleInput
      )
      if (
        !this.nameUsed &&
        !!this.titleInput &&
        this.titleInput.length &&
        this.titleInput.length <= 38 &&
        this.descriptionInput.length > 0
      ) {
        this.$emit('create', data)
        this.loading = true
      }
    },
    emitEdit() {
      const data = {
        logBookItemName: this.titleInput,
        logBookItemDescription: '',
        logBookItemNoteText: this.descriptionInput,
        logBookItemType: 'NOTE',
      }
      this.nameUsed = this.allItems.find(
        (item) =>
          item.logBookItemName === this.titleInput &&
          item.logBookItemId !== this.item.logBookItemId
      )
      if (
        !this.nameUsed &&
        !!this.titleInput &&
        this.titleInput.length &&
        this.titleInput.length <= 38 &&
        this.descriptionInput.length > 0
      ) {
        this.$emit('update', data)
        this.loading = true
      }
    },
  },
}
</script>

<style scoped lang="scss">
.v-overlay--active {
  background: rgba(6, 6, 50, 0.4) !important;
}
</style>
