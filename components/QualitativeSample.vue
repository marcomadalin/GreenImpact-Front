<template>
  <div>
    <v-stepper v-model="step" vertical elevation="0" class="transparent">
      <v-stepper-step step="1" editable>
        {{ $t('valueSample') }}
      </v-stepper-step>
      <v-stepper-content step="1" editable>
        <!-- component -->
        <v-container>
          <v-row>
            <v-col cols="12" lg="6">
              <v-select
                v-model="form.sampleValue"
                :items="indicatorItemsStart"
                filled
                shaped
                required
                background-color="white"
                :label="$t('value')"
              />
            </v-col>
          </v-row>
        </v-container>
        <step-buttons-group @next="step = 2" @cancel="$emit('cancel')" />
      </v-stepper-content>
      <v-stepper-step step="2" editable>
        {{ $t('dateSample') }}
      </v-stepper-step>
      <v-stepper-content step="2" editable>
        <!-- component -->
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
                    v-model="form.sampleDate"
                    :label="$t('dateSample2')"
                    hint="DD-MM-YYYY"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    filled
                    shaped
                    required
                    background-color="white"
                    @blur="sampleDate = parseDate(form.sampleDate)"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="sampleDate"
                  :first-day-of-week="1"
                  :locale="$auth.user.locale"
                  :min="minDate"
                  :max="maxDate"
                  no-title
                  @change="form.sampleDate = formatDate(sampleDate)"
                  @input="menu1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <step-buttons-group
            v-if="form.sampleId === null"
            :continue-title="$t('addSample')"
            continue-color="primary"
            continue-class="white text-body-2"
            @next="$emit('create')"
            @cancel="$emit('cancel')"
          />
          <step-buttons-group
            v-else
            :continue-title="$t('updateSample')"
            continue-color="primary"
            continue-class="white text-body-2"
            @next="$emit('update')"
            @cancel="$emit('cancel')"
          />
        </v-container>
      </v-stepper-content>
    </v-stepper>
    <!--
    <div v-if="form.sampleId" class="ml-6">
      <step-buttons-group
        :continue-title="$t('updateSample')"
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
          class="white--text"
          @click="dialog = true"
        >
          {{ $t('deleteSample') }}
        </v-btn>
        <RemoveDialog
          v-model="dialog"
          :title="$t('deleteSample')"
          :text="$t('deleteSampleConf')"
          :confirm="$t('deleteSample')"
          @delete="$emit('remove')"
        ></RemoveDialog>
      </v-alert>
    </div>
    -->
  </div>
</template>

<script>
import StepButtonsGroup from '~/components/StepButtonsGroup.vue'

export default {
  components: { StepButtonsGroup },
  props: {
    indicatorDto: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Object,
      default: () => ({}),
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
      dialog: null,
      sampleDate: this.value.sampleDate
        ? this.value.sampleDate.split('T')[0]
        : this.minDate
        ? this.minDate
        : null,
      form: {
        sampleId: this.value.sampleId || null,
        sampleValue: null,
        sampleDate: !this.value.sampleId
          ? ''
          : this.value.sampleDate
          ? this.formatDate(this.value.sampleDate.split('T')[0])
          : this.minDate
          ? this.formatDate(this.minDate)
          : null,
        sampleType: 'QUALITATIVE',
      },
    }
  },

  computed: {
    indicatorItemsStart() {
      return this.indicatorDto.qualitativeTypeDTO.weightedValues.map((i) => {
        return {
          value: {
            qualitativeWeightedValueId: i.qualitativeWeightedValueId,
            qualitativeTypeId: i.qualitativeTypeId,
            qualitativeValue: 'PENDING',
          },
          text: i.label,
        }
      })
    },
  },

  watch: {
    form: {
      handler(value) {
        this.$emit('input', value)
      },
      deep: true,
    },
  },

  mounted() {
    if (this.form.sampleId !== null) {
      const items = this.indicatorItemsStart
      this.form.sampleValue = items.find(
        (it) => it.text === this.value.sampleValue.qualitativeValue
      )
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return null

      const [year, day, month] = date.split('-')
      return `${month}-${day}-${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [day, month, year] = date.split('T')[0].split('-')
      return `${year}-${month}-${day}`
    },
  },
}
</script>

<style></style>
