<template>
  <v-dialog :key="componentKey" v-model="dialog" width="800">
    <v-card class="pa-8 rounded-lg">
      <v-card-title class="blue--text text-h1 px-3 mb-8">
        {{ $t('createFile') }}
      </v-card-title>

      <v-file-input
        v-model="file"
        class="mx-4"
        filled
        shaped
        required
        clearable
        truncate-length="15"
        :rules="[
          (v) => !!v || $t('requiredField'),
          (v) => (!!v && v.size <= 1e7) || $t('maxSize'),
        ]"
        prepend-icon="mdi-paperclip"
        :label="$t('uploadFile')"
        @click:clear="maxSize = false"
      ></v-file-input>

      <v-text-field
        v-model="title"
        class="mx-4"
        clearable
        shaped
        filled
        :rules="[
          (v) => !!v || $t('requiredField'),
          !nameUsed || $t('nameRepeatFile'),
        ]"
        :label="$t('fileTitle')"
      ></v-text-field>

      <v-textarea
        v-model="description"
        class="mx-4"
        filled
        clearable
        shaped
        no-resize
        rows="5"
        :label="$t('fileDescription')"
      ></v-textarea>

      <v-card-actions>
        <v-btn
          rounded
          depressed
          elevation="0"
          color="primary"
          class="text-body-2 white--text px-4"
          :loading="loading"
          @click="emitUpload"
        >
          {{ $t('createFile') }}
        </v-btn>

        <v-btn
          rounded
          depressed
          elevation="0"
          class="text-body-2 px-4"
          @click="clearModal"
        >
          {{ $t('cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import API_LOGBOOK from '~/api/logbook'

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
      dialog: this.value,
      title: null,
      description: null,
      file: null,
      nameUsed: false,
      maxSize: false,
      componentKey: 0,
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

    close(newVal) {
      console.log('called')
      if (newVal) this.clearModal()
      if (!newVal) this.loading = false
    },
  },
  methods: {
    clearModal() {
      this.loading = false
      this.title = null
      this.description = null
      this.file = null
      this.maxSize = false
      this.componentKey += 1
      this.dialog = false
    },
    async emitUpload() {
      const dto = {
        logBookItemName: this.title,
        logBookItemDescription: this.description,
        logBookItemType: 'FILE',
      }
      const json = JSON.stringify(dto)
      const blob = new Blob([json], {
        type: 'application/json',
      })
      const data = new FormData()
      data.set('file', this.file)
      data.set('newLogBookItem_FileDTO', blob)

      this.nameUsed = this.allItems.find(
        (item) => item.logBookItemName === this.title
      )
      this.maxSize = this.file.size > 1e7
      if (
        !this.nameUsed &&
        !this.maxSize &&
        !!this.title &&
        this.title.length
      ) {
        try {
          this.loading = true
          const response = await API_LOGBOOK.init(this.$axios).createFile(
            this.logbook.logBookId,
            data
          )
          this.$emit('upload', response, this.title)
        } catch (e) {
          console.log(e.response)
          this.loading = false
        }
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
