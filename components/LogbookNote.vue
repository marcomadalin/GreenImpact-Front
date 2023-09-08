<template>
  <div>
    <v-container>
      <v-row>
        <v-col
          class="text-center"
          style="max-width: 60px !important; min-width: 60px !important"
        >
          <v-col class="text-center pa-0 ma-0">
            <v-avatar color="#e6e6eb"
              ><img
                class="icon"
                style="padding-top: 1px; padding-bottom: 1px"
                :src="require(`assets/img/icons/Note.svg`)"
            /></v-avatar>
          </v-col>
          <v-divider v-if="show" vertical></v-divider>
        </v-col>
        <v-col style="display: block !important">
          <v-container class="plain-shadow pa-0 rounded-lg white">
            <v-row
              id="noteHeader"
              class="mb-4 ma-0 pl-5 pr-2 body-1 blue--text"
            >
              <v-col cols="auto" class="pa-0 ma-0">
                <p class="mb-0">{{ note.logBookItemName }}</p>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto" class="pa-0 ma-0">
                <v-btn v-if="edit" rounded small color="#e6e6eb" elevation="0">
                  <img
                    class="icon"
                    :src="require(`assets/img/icons/Edit.svg`)"
                    @click="dialogEdit = true"
                  />
                </v-btn>
              </v-col>
              <v-col cols="auto" class="pa-0 ma-0">
                <v-btn v-if="edit" rounded small color="#e6e6eb" elevation="0">
                  <img
                    class="icon"
                    :src="require(`assets/img/icons/Delete.svg`)"
                    @click="dialogDelete = true"
                  />
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="px-2 ma-0">
              <v-col class="ma-0 pa-0">
                <v-textarea
                  class="ma-0 pa-0"
                  :value="note.logBookItemNoteText"
                  solo
                  readonly
                  auto-grow
                  rows="1"
                  no-resize
                />
              </v-col>
            </v-row>
            <v-row class="pr-3 pl-1 ma-0 pb-5 mt-2">
              <v-col cols="auto">
                <v-avatar
                  class="white--text ml-2 caption"
                  width="45px"
                  height="45px"
                  color="#011D89"
                  elevation="0"
                  fab
                >
                  {{
                    firstCapitalized(note.userFirstName) +
                    '' +
                    firstCapitalized(note.userLastName)
                  }}
                </v-avatar>
              </v-col>
              <v-col cols="auto" class="pl-0">
                <p
                  class="body-1 blue--text mb-0"
                  style="
                    font-weight: bold !important;
                    font-size: 14px !important;
                    color: #060632 !important;
                  "
                >
                  {{ note.userFirstName + ' ' + note.userLastName }}
                </p>
                <p
                  class="body-1 blue--text mb-0"
                  style="font-size: 14px !important; color: #060632 !important"
                >
                  {{
                    formatDate(note.logBookItemCreationTime.split('T')[0]) +
                    ' ' +
                    getHour(
                      note.logBookItemCreationTime.split('T')[1].split('.')[0]
                    )
                  }}
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <remove-dialog
      v-model="dialogDelete"
      :item="note"
      title="deleteNoteTitle"
      text="deleteNoteText"
      confirm="deleteNote"
      :close="closeDelete"
      :close-dialog="false"
      @delete="emitDelete"
    ></remove-dialog>
    <logbook-note-dialog
      v-if="note"
      :key="dialogKey"
      v-model="dialogEdit"
      :logbook="logbook"
      :title="note.logBookItemName"
      :description="note.logBookItemNoteText"
      :edit="true"
      :all-items="logbook.folders[0].items"
      :item="note"
      :close="closeNote"
      @update="emitUpdate"
      @cancel="updateDialog"
    >
    </logbook-note-dialog>
  </div>
</template>

<script>
export default {
  props: {
    logbook: {
      type: Object,
      default: null,
    },
    note: {
      type: Object,
      default: () => {},
    },
    show: {
      type: Boolean,
      default: true,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    close: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogKey: 0,
      dialogDelete: false,
      dialogEdit: false,
      closeNote: false,
      closeDelete: false,
    }
  },
  watch: {
    close(oldVal, newVal) {
      if (newVal) {
        this.closeNote = true
        this.closeDelete = true
        this.dialogEdit = false
        this.dialogDelete = false
      }
    },
  },
  methods: {
    updateDialog() {
      this.dialogKey += 1
      this.dialogEdit = false
    },
    getHour(hour) {
      const parts = hour.split(':')
      return parts[0] + ':' + parts[1]
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
    emitUpdate(note) {
      this.$emit('update', note, this.note)
    },
    emitDelete(note) {
      this.$emit('delete', note)
    },
  },
}
</script>

<style lang="scss">
#noteHeader {
  background: #e6e6eb;
  min-height: 48px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  align-items: center;
}
.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  box-shadow: none;
}
.theme--light.v-input input,
.theme--light.v-input textarea {
  color: #060632 !important;
}
.icon {
  width: 28px !important;
  height: 28px !important;
}
</style>
