<template>
  <div>
    <v-bottom-sheet
      v-model="sheet"
      content-class="rounded-lg"
      overlay-color="darkBlue"
      overlay-opacity="0.6"
    >
      <template #activator="{ on, attrs }">
        <v-row
          v-if="entity"
          style="margin-bottom: -7px !important; padding-bottom: 0px !important"
        >
          <v-col
            cols="auto"
            style="
              margin-bottom: 0px !important;
              padding-bottom: 0px !important;
            "
          >
            <img
              v-bind="attrs"
              class="icon"
              :src="
                logbookEnabled
                  ? require(`assets/img/icons/logbook-active.svg`)
                  : isAdminRole
                  ? require(`assets/img/icons/logbook-disable.svg`)
                  : require(`assets/img/icons/logbook-inactive.svg`)
              "
              v-on="on"
              @click="initLogbook"
            />
          </v-col>
          <v-col
            cols="auto"
            class="ml-0 pl-0"
            style="
              margin-left: -7px !important;
              margin-bottom: 0px !important;
              padding-bottom: 0px !important;
              margin-top: 5px !important;
            "
          >
            <a
              v-bind="attrs"
              class="text-body-2"
              style="color: black !important"
              v-on="on"
              @click="initLogbook"
              >{{ $t('viewLogbook') }}
            </a>
          </v-col>
        </v-row>
        <img
          v-else
          v-bind="attrs"
          class="icon"
          :src="
            logbookEnabled
              ? require(`assets/img/icons/logbook-active.svg`)
              : isAdminRole
              ? require(`assets/img/icons/logbook-disable.svg`)
              : require(`assets/img/icons/logbook-inactive.svg`)
          "
          v-on="on"
          @click="initLogbook"
        />
      </template>
      <v-card
        :key="componentKey"
        flat
        class="pa-10 rounded-lg rounded-b-0 logbookContainer"
      >
        <div class="text-right">
          <v-btn depressed icon color="primary" @click="sheet = false">
            <v-icon>mdi-close</v-icon></v-btn
          >
        </div>
        <v-container fluid class="logbookContainer" style="width: 90%">
          <p v-if="entity" class="body-1 blue--text">
            {{ $t('entity') }}
          </p>
          <p v-else-if="plan" class="body-1 blue--text">
            {{ $t('plan') }}
          </p>
          <p v-else-if="area" class="body-1 blue--text">
            {{ $t('area') }}
          </p>
          <p v-else class="body-1 blue--text">
            {{ $t('indicator') }}
          </p>
          <h1 v-if="entity" class="blue--text text-h1">
            {{ entity.organizationName }}
          </h1>
          <h1 v-else-if="plan" class="blue--text text-h1">
            {{ plan.planName }}
          </h1>
          <h1 v-else-if="area" class="blue--text text-h1">
            {{ area.areaName }}
          </h1>
          <h1 v-else class="blue--text text-h1">
            {{ indicator.indicatorDTO.indicatorName }}
          </h1>
          <v-row v-if="edit">
            <v-col cols="auto" align-self="center" class="pr-1">
              <v-switch
                v-model="logbookEnabled"
                :readonly="isEditorRole"
                color="primary"
                @change="toggleLogbook"
              ></v-switch>
            </v-col>
            <v-col cols="auto" align-self="center" class="px-1">
              <img
                class="icon"
                :src="
                  logbookEnabled
                    ? require(`assets/img/icons/logbook-active.svg`)
                    : require(`assets/img/icons/logbook-inactive.svg`)
                "
              />
            </v-col>
            <v-col cols="auto" align-self="center" class="px-1">
              <p v-if="logbookEnabled" class="body-1 darkGray--text mb-2">
                {{ $t('logbookActive') }}
              </p>
              <p v-else class="body-1 darkGray--text mb-2">
                {{ $t('logbookInactive') }}
              </p>
            </v-col>
            <v-col cols="auto" align-self="center" class="px-1">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <img
                    class="icon"
                    :src="require(`assets/img/icons/Question.svg`)"
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <div
                  class="py-1 text-body-2 white--text"
                  style="max-width: 270px"
                >
                  {{
                    logbookEnabled ? $t('tooltipEnable') : $t('tooltipDisable')
                  }}
                </div>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-divider :style="edit ? '' : 'margin-top: 20px'"></v-divider>
          <v-row
            v-if="!logbookEnabled"
            class="mt-6 disableContainer"
            align-content="center"
          >
            <v-col class="text-center">
              <div>
                <img
                  style="height: 80px; width: 80px"
                  :src="require(`assets/img/icons/logbook-inactive.svg`)"
                />
              </div>
              <p
                class="text-body-1 grey-text mb-1 mx-auto"
                style="max-width: 180px; color: #838399 !important"
              >
                {{ $t('activateLogbook') }}
              </p>
            </v-col>
          </v-row>
          <v-row v-else class="mt-6">
            <v-col cols="6">
              <v-row>
                <v-col align-self="center">
                  <h3
                    class="heading3 primary--text mt-0"
                    style="
                      font-family: 'Lexend' !important;
                      font-style: normal !important;
                      font-weight: 500 !important;
                      font-size: 20px !important;
                      color: #011d89 !important;
                    "
                  >
                    {{ $t('docs') }}
                  </h3>
                </v-col>
                <v-spacer></v-spacer>
                <v-col v-if="edit" class="text-right">
                  <v-btn
                    rounded
                    depressed
                    elevation="0"
                    color="primary"
                    class="text-body-2 white--text"
                    @click="dialogFile = true"
                  >
                    <img
                      class="icon"
                      :src="require(`assets/img/icons/New-file.svg`)"
                    />
                    {{ $t('newDoc') }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-col
                v-if="files.length > 0"
                class="mt-7 px-1 logbookComponentContainer"
              >
                <v-row>
                  <v-col v-for="(item, i) in files" :key="i" cols="auto">
                    <logbook-file
                      v-if="logbookItem && logbookItem.folders.length"
                      :logbook="logbookItem"
                      :file="item"
                      :edit="edit"
                      @delete="deleteFile"
                      @download="downloadFile"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-row
                v-else
                class="px-1 logbookComponentContainer text-center"
                align-content="center"
              >
                <v-col v-if="init">
                  <div>
                    <img
                      style="height: 80px; width: 80px"
                      :src="require(`assets/img/icons/File.svg`)"
                    />
                  </div>
                  <p
                    class="text-body-1 darkGrey-text mb-1 mx-auto"
                    style="max-width: 180px"
                  >
                    {{ $t('noFiles') }}
                  </p>
                  <!--
                  <a
                    class="text-body-1 blue-text"
                    style="text-decoration: underline"
                    @click="dialogFile = true"
                    >{{ $t('addFirstFile') }}</a
                  >
                  -->
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col align-self="center">
                  <h3
                    class="heading3 primary--text mt-0"
                    style="
                      font-family: 'Lexend' !important;
                      font-style: normal !important;
                      font-weight: 500 !important;
                      font-size: 20px !important;
                      color: #011d89 !important;
                    "
                  >
                    {{ $t('notes') }}
                  </h3>
                </v-col>
                <v-spacer></v-spacer>
                <v-col v-if="edit" class="text-right">
                  <v-btn
                    rounded
                    depressed
                    elevation="0"
                    color="primary"
                    class="text-body-2 white--text"
                    @click="dialogNote = true"
                  >
                    <img
                      class="icon mr-1"
                      :src="require(`assets/img/icons/New-Note.svg`)"
                    />{{ $t('newNote') }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-col
                v-if="notes.length > 0"
                class="mt-7 px-1 logbookComponentContainer"
              >
                <div v-for="(item, i) in notes" :key="i">
                  <logbook-note
                    v-if="logbookItem && logbookItem.folders.length"
                    :logbook="logbookItem"
                    :note="item"
                    :show="i !== notes.length - 1"
                    :edit="edit"
                    :close="closeEditNote"
                    @delete="deleteNote"
                    @update="updateNote"
                  />
                </div>
              </v-col>
              <v-row
                v-else
                class="px-1 logbookComponentContainer text-center"
                align-content="center"
              >
                <v-col v-if="init">
                  <div>
                    <img
                      style="height: 80px; width: 80px"
                      :src="require(`assets/img/icons/NoteGrey.svg`)"
                    />
                  </div>
                  <p
                    class="text-body-1 darkGrey-text mb-1 mx-auto"
                    style="max-width: 180px"
                  >
                    {{ $t('noNotes') }}
                  </p>
                  <!--
                  <a
                    class="text-body-1 blue-text"
                    style="text-decoration: underline"
                    @click="dialogNote = true"
                    >{{ $t('addFirstNote') }}</a
                  >
                  -->
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <v-snackbar
          v-model="ok"
          style="margin-top: 70px"
          :color="colorSnackbar"
          min-width="0px"
          :top="true"
          fixed
          timeout="1500"
        >
          <v-icon>mdi-check-circle-outline</v-icon>
          <span class="ml-3">{{ $t(successText) }}</span>
        </v-snackbar>
      </v-card>
    </v-bottom-sheet>
    <logbook-note-dialog
      v-if="logbookItem && logbookItem.folders.length"
      :key="componentKeyNote"
      v-model="dialogNote"
      :logbook="logbookItem"
      :all-items="logbookItem.folders[0].items"
      :close="closeNote"
      @create="createNote"
    ></logbook-note-dialog>
    <logbook-file-dialog
      v-if="logbookItem && logbookItem.folders.length"
      :key="componentKeyDialog"
      v-model="dialogFile"
      :logbook="logbookItem"
      :all-items="logbookItem.folders[0].items"
      :close="closeFile"
      @upload="uploadFile"
    ></logbook-file-dialog>
  </div>
</template>
<script>
import LogbookNote from '~/components/LogbookNote.vue'
import API_LOGBOOK from '~/api/logbook'
import API_USERS from '~/api/users'
import { roles } from '~/constants'

export default {
  components: { LogbookNote },
  props: {
    logbook: {
      type: Object,
      default: null,
    },
    entity: {
      type: Object,
      default: null,
    },
    plan: {
      type: Object,
      default: null,
    },
    area: {
      type: Object,
      default: null,
    },
    indicator: {
      type: Object,
      default: null,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      componentKey: 0,
      componentKeyNote: 1,
      componentKeyDialog: 2,
      height: Math.ceil(window.innerHeight - 400),
      dialogNote: false,
      dialogFile: false,
      ok: null,
      successText: null,
      sheet: false,
      logbookEnabled: this.logbook ? !!this.logbook.logBookEnabled : true,
      logbookItem: null,
      colorSnackbar: '#12BB6A',
      files: [],
      notes: [],
      closeFile: false,
      closeNote: false,
      closeEditNote: false,
      init: false,
    }
  },
  mounted() {
    this.updateComponentSize()
    window.addEventListener('resize', this.updateComponentSize)
    document.documentElement.style.setProperty(
      '--window-height',
      `${window.innerHeight}px`
    )
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateComponentSize)
    document.documentElement.style.setProperty(
      '--window-height',
      `${window.innerHeight}px`
    )
  },
  methods: {
    updateComponentSize() {
      document.documentElement.style.setProperty(
        '--window-height',
        `${window.innerHeight}px`
      )
    },
    async initLogbook() {
      this.init = false
      this.notes = []
      this.files = []
      if (!(this.logbook || this.logbookItem)) {
        try {
          const data = {
            logBookOrganizationUUID: this.$auth.user.loggedOrganizationUuid,
            logBookOwnerUUID: this.$auth.user.userUuid,
            logBookEnabled: true,
            logBookProtected: false,
          }
          if (this.indicator) {
            data.planUUID = this.indicator.area.plan.planUUID
            data.areaId = this.indicator.area.areaId
            data.areaIndicatorId = this.indicator.areaIndicatorId
            data.logBookType = 'AREA_INDICATOR'
          } else if (this.area) {
            data.planUUID = this.area.plan.planUUID
            data.areaId = this.area.areaId
            data.logBookType = 'AREA'
          } else if (this.plan) {
            data.planUUID = this.plan.planUUID
            data.logBookType = 'PLAN'
          } else {
            data.logBookType = 'ORGANIZATION'
          }
          this.logbookItem = await API_LOGBOOK.init(this.$axios).createLogbook(
            data
          )
        } catch (e) {
          console.log(e.response)
        }
      } else if (this.logbook && !this.logbookItem)
        this.logbookItem = structuredClone(this.logbook)
      else {
        try {
          this.logbookItem = await API_LOGBOOK.init(this.$axios).getLogbook(
            this.logbookItem.logBookId
          )
        } catch (e) {
          console.log(e.response)
        }
      }
      this.logbookEnabled = this.logbookItem.logBookEnabled
      if (this.logbookEnabled) {
        let userAPI = null
        try {
          userAPI = await API_USERS.init(
            this.$axios,
            this.$auth.user.loggedOrganizationUuid
          )
        } catch (e) {
          console.log(e.response)
        }
        this.logbookItem.folders[0].items.sort((a, b) => {
          return (
            new Date(b.logBookItemCreationTime) -
            new Date(a.logBookItemCreationTime)
          )
        })

        for (let i = 0; i < this.logbookItem.folders[0].items.length; ++i) {
          let user = null
          try {
            user = await userAPI.getUser(
              this.logbookItem.folders[0].items[i].logBookUserUUID
            )
          } catch (e) {
            console.log(e.response)
          }
          this.logbookItem.folders[0].items[i].userFirstName = user.firstName
          this.logbookItem.folders[0].items[i].userLastName = user.lastName
          if (this.logbookItem.folders[0].items[i].logBookItemType === 'NOTE')
            this.notes.push(this.logbookItem.folders[0].items[i])
          else if (
            this.logbookItem.folders[0].items[i].logBookItemType === 'FILE'
          )
            this.files.push(this.logbookItem.folders[0].items[i])
        }
        this.sheet = true
      } else if (
        this.$auth.user.roles.includes(roles.SUPER_ADMIN) ||
        this.$auth.user.roles.includes(roles.ADMIN)
      )
        this.sheet = true
      this.init = true
    },
    async getNewItem(response, name, type) {
      let item = null

      for (let i = 0; i < response.folders[0].items.length; ++i) {
        if (
          response.folders[0].items[i].logBookItemType === type &&
          response.folders[0].items[i].logBookItemName === name
        ) {
          item = response.folders[0].items[i]
          break
        }
      }
      const user = await API_USERS.init(
        this.$axios,
        this.$auth.user.loggedOrganizationUuid
      ).getUser(item.logBookUserUUID)
      item.userFirstName = user.firstName
      item.userLastName = user.lastName
      return item
    },
    deleteItem(item, type) {
      const items = type === 'FILE' ? this.files : this.notes
      const index = items.indexOf(item)
      if (index > -1) items.splice(index, 1)
    },
    async toggleLogbook() {
      try {
        this.logbookItem.logBookEnabled = !this.logbookItem.logBookEnabled
        if (this.logbookEnabled)
          await API_LOGBOOK.init(this.$axios)
            .enableLogbook(this.logbookItem.logBookId)
            .then(async () => {
              if (this.logbookItem.folders.length <= 0) {
                await this.initLogbook().then(() => {
                  this.componentKey += 1
                  this.componentKeyNote += 1
                  this.componentKeyDialog += 1
                })
              }
            })
        else
          await API_LOGBOOK.init(this.$axios).disableLogbook(
            this.logbookItem.logBookId
          )
      } catch (e) {
        console.log(e.response)
      }
    },
    async createNote(note) {
      try {
        const response = await API_LOGBOOK.init(this.$axios).createNote(
          this.logbookItem.logBookId,
          note
        )
        this.notes = [
          await this.getNewItem(response, note.logBookItemName, 'NOTE'),
        ].concat(this.notes)

        this.closeNote = true
        this.successText = 'noteCreated'
        this.colorSnackbar = '#12BB6A'
        this.closeNote = false
        this.dialogNote = false
        this.ok = true
        this.componentKey += 1
        this.componentKeyNote += 1
        this.componentKeyDialog += 1
      } catch (e) {
        console.log(e.response)
      }
    },
    async deleteNote(note) {
      try {
        await API_LOGBOOK.init(this.$axios).deleteNote(
          this.logbookItem.logBookId,
          note.logBookItemId
        )
        this.deleteItem(note, 'NOTE')
        this.successText = 'noteDeleted'
        this.colorSnackbar = '#12BB6A'
        this.ok = true
        this.componentKey += 1
        this.componentKeyNote += 1
        this.componentKeyDialog += 1
      } catch (e) {
        console.log(e.response)
      }
    },
    async updateNote(newNote, oldNote) {
      try {
        const response = await API_LOGBOOK.init(this.$axios).updateNote(
          this.logbookItem.logBookId,
          oldNote.logBookItemId,
          newNote
        )
        this.successText = 'noteUpdated'
        this.ok = true

        let updatedNote = null
        for (let i = 0; i < response.folders[0].items.length; ++i) {
          if (
            response.folders[0].items[i].logBookItemType === 'NOTE' &&
            response.folders[0].items[i].logBookItemId === oldNote.logBookItemId
          ) {
            updatedNote = response.folders[0].items[i]
            break
          }
        }
        const user = await API_USERS.init(
          this.$axios,
          this.$auth.user.loggedOrganizationUuid
        ).getUser(updatedNote.logBookUserUUID)

        updatedNote.userFirstName = user.firstName
        updatedNote.userLastName = user.lastName

        const index = this.notes.indexOf(oldNote)
        if (index > -1) this.notes[index] = updatedNote

        this.closeEditNote = true
        this.successText = 'noteUpdated'
        this.colorSnackbar = '#12BB6A'
        this.closeEditNote = false
        this.ok = true
        this.componentKey += 1
        this.componentKeyNote += 1
        this.componentKeyDialog += 1
      } catch (e) {
        console.log(e.response)
      }
    },
    async uploadFile(response, name) {
      try {
        this.files = [await this.getNewItem(response, name, 'FILE')].concat(
          this.files
        )
        this.closeFile = true
        this.successText = 'fileUploaded'
        this.colorSnackbar = '#12BB6A'
        this.closeFile = false
        this.dialogFile = false
        this.ok = true
        this.componentKey += 1
        this.componentKeyNote += 1
        this.componentKeyDialog += 1
      } catch (e) {
        console.log(e.response)
      }
    },
    async downloadFile(file) {
      try {
        const download = await API_LOGBOOK.init(this.$axios).getFile(
          this.logbookItem.logBookId,
          file.logBookItemId
        )

        const FILE = window.URL.createObjectURL(new Blob([download]))

        const docUrl = document.createElement('a')
        docUrl.href = FILE
        docUrl.setAttribute('download', file.logBookItemFileName)
        document.body.appendChild(docUrl)
        docUrl.click()
      } catch (e) {
        console.log(e.response)
      }
    },
    async deleteFile(file) {
      try {
        await API_LOGBOOK.init(this.$axios).deleteFile(
          this.logbookItem.logBookId,
          file.logBookItemId
        )
        this.deleteItem(file, 'FILE')
        this.successText = 'fileDeleted'
        this.colorSnackbar = '#12BB6A'
        this.ok = true
        this.componentKey += 1
        this.componentKeyNote += 1
        this.componentKeyDialog += 1
      } catch (e) {
        console.log(e.response)
      }
    },
  },
}
</script>
<style lang="scss">
.heading3 {
  color: #011d89 !important;
  margin-top: 40px !important;
}
.icon {
  width: 25px;
  height: 25px;
}

:root {
  --component-height: calc(var(--window-height) - 420px);
  --disabled-height: calc(var(--window-height) - 350px);
  --logbook-height: calc(var(--window-height) - 80px);
}

.logbookComponentContainer {
  overflow-y: scroll !important;
  overflow-x: clip !important;
  height: var(--component-height) !important;
}

.disableContainer {
  height: var(--disabled-height) !important;
}

.logbookContainer {
  height: var(--logbook-height) !important;
}
</style>
