<template>
  <div>
    <div class="mx-0">
      <v-container class="rounded-lg fileContainer plain-shadow">
        <v-row class="mt-1" justify="end">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <img
                v-bind="attrs"
                class="icon"
                :src="require(`assets/img/icons/info-logbook.svg`)"
                v-on="on"
              />
            </template>
            <div class="pa-1 ma-0 py-2" style="color: white">
              <p
                class="body-1 mb-1"
                style="font-weight: bold; max-width: 270px"
              >
                {{ file.logBookItemName }}
              </p>
              <p class="body-2 mb-0 mr-3" style="max-width: 270px">
                {{ file.logBookItemDescription }}
              </p>
              <v-row class="ma-0 pa-0">
                <v-col
                  align-self="center"
                  class="ml-0 pl-0 mb-0 pb-0"
                  cols="auto"
                >
                  <v-avatar
                    class="white--text ml-2 caption"
                    width="50px"
                    height="50px"
                    color="#011D89"
                    elevation="0"
                    fab
                  >
                    {{
                      firstCapitalized(file.userFirstName) +
                      firstCapitalized(file.userLastName)
                    }}
                  </v-avatar>
                </v-col>
                <v-col cols="auto" class="pl-0 mb-0 pb-0 mr-0 pr-0">
                  <p
                    class="body-1 mb-0"
                    style="font-size: 12px !important; font-weight: bold"
                  >
                    {{ $t('created') }}
                  </p>
                  <p class="body-1 mb-0" style="font-size: 12px !important">
                    {{ file.userFirstName + ' ' + file.userLastName }}
                  </p>
                  <p class="body-1 mb-0" style="font-size: 12px !important">
                    {{
                      formatDate(file.logBookItemCreationTime.split('T')[0]) +
                      ' ' +
                      file.logBookItemCreationTime.split('T')[1].split('.')[0]
                    }}
                  </p>
                </v-col>
              </v-row>
            </div>
          </v-tooltip>
          <v-btn v-if="edit" rounded small color="#e6e6eb" elevation="0">
            <img
              class="icon"
              :src="require(`assets/img/icons/Delete.svg`)"
              @click="dialog = true"
            />
          </v-btn>
          <div v-else class="mr-3"></div>
        </v-row>
        <div class="text-center mt-6 mb-1">
          <img
            style="height: 54px; width: 54px"
            :src="require(`assets/img/icons/${fileExtension}.svg`)"
          />
        </div>
        <v-row justify="end">
          <v-btn
            class="mr-3 mt-1"
            width="44px"
            height="44px"
            color="white"
            fab
            style="box-shadow: none !important"
            @click="emitDownload"
          >
            <img
              class="icon"
              :src="require(`assets/img/icons/Download.svg`)"
            /> </v-btn
        ></v-row>
      </v-container>
      <v-list-item-title class="body-1 darkGray--text mt-2">
        {{ truncateText(getFileName(file.logBookItemFileName), 13, '...') }}
      </v-list-item-title>
      <p class="caption" style="color: #838399">
        {{ '.' + file.logBookItemFileName.split('.').slice(-1) }}
      </p>
    </div>
    <remove-dialog
      v-model="dialog"
      :item="file"
      title="deleteFileTitle"
      text="deleteFileText"
      confirm="deleteFile"
      :close="closeDelete"
      :close-dialog="false"
      @delete="emitDelete"
    ></remove-dialog>
  </div>
</template>

<script>
export default {
  props: {
    logbook: {
      type: Object,
      default: null,
    },
    file: {
      type: Object,
      default: () => {},
    },
    edit: {
      type: Boolean,
      default: () => false,
    },
    close: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      closeDelete: false,
      extension: this.file.logBookItemFileName.split('.').slice(-1)[0],
    }
  },
  computed: {
    fileExtension() {
      if (this.extension === 'pdf') return 'file-pdf'
      else if (this.file.logBookItemFileMime.split('/')[0] === 'image')
        return 'file-image'
      else if (
        this.extension === 'doc' ||
        this.extension === 'docx' ||
        this.extension === 'txt'
      )
        return 'file-doc'
      else if (this.extension.includes('xl')) return 'file-excel'
      else return 'file-general'
    },
  },
  watch: {
    close(oldVal, newVal) {
      if (newVal) {
        this.closeDelete = true
        this.dialog = false
      }
    },
  },

  methods: {
    getFileName(name) {
      const parts = name.split('.')
      let result = parts[0]
      for (let i = 1; i < parts.length - 1; ++i) result += '.' + parts[i]
      return result
    },
    truncateText(text, length, suffix) {
      if (!text) {
        return
      }
      if (length < text.length) {
        return text.substring(0, length) + suffix
      } else {
        return text
      }
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}-${month}-${year}`
    },
    firstCapitalized(name) {
      const capitalizedFirst = name[0].toUpperCase()
      return capitalizedFirst
    },
    emitDownload() {
      this.$emit('download', this.file)
    },
    emitDelete(file, name) {
      this.$emit('delete', file, name)
    },
  },
}
</script>

<style lang="scss">
.fileContainer {
  background-color: #e6e6eb;
  width: 165px;
  height: 165px;
}
.v-tooltip__content {
  background-color: rgba(6, 6, 50, 0.85) !important;
}
</style>
