<template>
  <div>
    <v-stepper v-model="step" vertical elevation="0" class="transparent">
      <v-stepper-step step="1" editable>
        {{ step1Title }}
      </v-stepper-step>
      <v-stepper-content step="1" editable>
        <v-text-field
          v-model="form.name"
          filled
          shaped
          required
          background-color="white"
          :label="step1Label"
          :rules="[(v) => !!v || $t('requiredField')]"
          @change="formNameBad = !form.name"
        />
        <step-buttons-group @next="step = 2" @cancel="$emit('cancel')" />
      </v-stepper-content>

      <v-stepper-step step="2" editable>
        {{ step2Title }}
      </v-stepper-step>
      <v-stepper-content step="2" editable>
        <v-textarea
          v-model="form.description"
          filled
          shaped
          required
          background-color="white"
          :label="step2Label"
        />

        <!-- div key="description">
          <editor
            :flat="false"
            name="description"
            :content="form.planDescription"
            :text.sync="form.planDescription"
            class="mb-4"
          />
        </div -->
        <step-buttons-group @next="step = 3" @cancel="step = 1" />
      </v-stepper-content>

      <v-stepper-step step="3" editable>
        {{ step3Title }}
      </v-stepper-step>
      <v-stepper-content step="3" editable>
        <v-container>
          <v-row>
            <v-col cols="12" lg="6">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.startDate"
                    :label="$t('startDate')"
                    hint="DD-MM-YYYY"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    filled
                    shaped
                    required
                    background-color="white"
                    @blur="startDate = parseDate(form.startDate)"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="startDate"
                  :locale="$auth.user.locale"
                  :first-day-of-week="1"
                  :min="isPlan ? null : minDate"
                  :max="isPlan ? null : endDate === '' ? maxDate : endDate"
                  no-title
                  @change="form.startDate = formatDate(startDate)"
                  @input="menu1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" lg="6">
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.endDate"
                    :label="$t('endDate')"
                    hint="DD-MM-YYYY  "
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    filled
                    shaped
                    required
                    background-color="white"
                    @blur="endDate = parseDate(form.endDate)"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  :first-day-of-week="1"
                  :locale="$auth.user.locale"
                  :min="startDate === '' ? minDate : startDate"
                  :max="isPlan ? null : maxDate"
                  no-title
                  @change="form.endDate = formatDate(endDate)"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
        <step-buttons-group @next="step = 4" @cancel="step = 2" />
      </v-stepper-content>

      <v-stepper-step step="4" editable>
        {{ step4Title }}
      </v-stepper-step>
      <v-stepper-content step="4" editable>
        <v-file-input
          v-model="image"
          accept="image/*"
          small-chips
          filled
          shaped
          required
          background-color="white"
          truncate-length="15"
          prepend-icon="mdi-image"
          :label="$t('selectImage')"
        ></v-file-input>
        <div class="mb-4">
          <img
            v-if="imagePreview"
            :src="imagePreview"
            :style="{ maxWidth: '250px', width: '100%' }"
          />
          <a href="#" class="d-block" @click.prevent="removeImage">{{
            $t('changeImage')
          }}</a>
        </div>
        <v-col class="mx-0 px-0">
          <v-row v-if="!form.id" class="mx-0 px-0" style="margin-top: 20px">
            <v-btn
              :disabled="formNameBad"
              rounded
              depressed
              elevation="0"
              color="primary"
              class="text-body-2 white--text"
              @click="$emit('create')"
            >
              {{ createBtnTitle }}
            </v-btn>

            <v-btn
              rounded
              depressed
              elevation="0"
              class="text-body-2"
              @click="$emit('cancel')"
            >
              {{ $t('cancel') }}
            </v-btn>
          </v-row>
        </v-col>
      </v-stepper-content>
    </v-stepper>

    <div v-if="form.id" class="ml-6">
      <step-buttons-group
        :continue-title="updateBtnTitle"
        continue-color="primary"
        continue-class="white text-body-2"
        @next="$emit('update')"
        @cancel="$emit('cancel')"
      />

      <v-alert outlined color="red" class="mt-12">
        <p class="text-h6 mb-0">{{ $t('dangerZone') }}</p>
        <p class="black--text">
          {{ $t('delete3') }}
        </p>
        <v-btn
          small
          rounded
          elevation="0"
          color="red"
          class="text-body-2 primary--text"
          style="color: white !important"
          @click="dialog = true"
        >
          {{ dialogRemoveActivatorBtnTitle }}
        </v-btn>
        <RemoveDialog
          v-model="dialog"
          :title="dialogRemoveTitle"
          :text="dialogRemoveDescription"
          :confirm="dialogRemoveBtnTitle"
          @delete="$emit('remove')"
        ></RemoveDialog>
      </v-alert>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    isPlan: {
      type: Boolean,
      default: false,
    },
    imagePlan: {
      type: String,
      default: () => null,
    },
    step1Title: {
      type: String,
      default: () => '',
    },
    step1Label: {
      type: String,
      default: () => '',
    },
    step2Title: {
      type: String,
      default: () => '',
    },
    step2Label: {
      type: String,
      default: () => '',
    },
    step3Title: {
      type: String,
      default: () => '',
    },
    step4Title: {
      type: String,
      default: () => '',
    },
    createBtnTitle: {
      type: String,
      default: () => '',
    },
    updateBtnTitle: {
      type: String,
      default: () => '',
    },
    dialogRemoveActivatorBtnTitle: {
      type: String,
      default: () => '',
    },
    dialogRemoveTitle: {
      type: String,
      default: () => '',
    },
    dialogRemoveDescription: {
      type: String,
      default: () => '',
    },
    dialogRemoveBtnTitle: {
      type: String,
      default: () => '',
    },
    minDate: {
      type: String,
      default: () => '',
    },
    maxDate: {
      type: String,
      default: () => '',
    },
  },

  data() {
    return {
      step: 1,
      menu1: false,
      menu2: false,
      dialog: null,
      formNameBad: true,
      startDate:
        this.value.startDate ||
        this.minDate ||
        String(new Date().toISOString().slice(0, 10)),
      endDate:
        this.value.endDate ||
        this.maxDate ||
        String(new Date().toISOString().slice(0, 10)),
      form: {
        id: this.value.id,
        name: this.value.name,
        description: this.value.description,
        startDate:
          this.isPlan && !this.value.id
            ? ''
            : this.formatDate(this.value.startDate) ||
              this.formatDate(this.minDate) ||
              this.formatDate(String(new Date().toISOString().slice(0, 10))),
        endDate:
          this.isPlan && !this.value.id
            ? ''
            : this.formatDate(this.value.endDate) ||
              this.formatDate(this.maxDate) ||
              this.formatDate(String(new Date().toISOString().slice(0, 10))),
      },
      imagePreview: this.imagePlan,
      image: null,
    }
  },

  watch: {
    form: {
      handler(value) {
        this.$emit('input', value)
      },
      deep: true,
    },
    image(value) {
      if (!value) {
        this.imagePreview = null
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(value)
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      this.$emit('add-image', value)
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return null

      const [year, day, month] = date.split('-')
      return `${month}-${day}-${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [day, month, year] = date.split('-')
      return `${year}-${month}-${day}`
    },
    removeImage() {
      this.$emit('remove-image')
      this.imagePreview = null
    },
  },
}
</script>
