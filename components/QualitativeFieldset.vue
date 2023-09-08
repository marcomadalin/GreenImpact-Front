<template>
  <v-stepper v-model="step" vertical elevation="0" class="transparent">
    <v-stepper-step step="1" editable>
      {{ $t('titleGoal') }}
    </v-stepper-step>
    <v-stepper-content step="1" editable>
      <!-- component -->
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model.number="form.startObjectiveValue"
              :items="indicatorItemsStart"
              filled
              shaped
              required
              background-color="white"
              :label="$t('startValue')"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model.number="form.endObjectiveValue"
              :items="indicatorItemsEnd"
              filled
              shaped
              required
              background-color="white"
              :label="$t('endValue')"
            />
          </v-col>
        </v-row>
      </v-container>
      <step-buttons-group @next="step = 2" @cancel="$emit('cancel')" />
    </v-stepper-content>
    <v-stepper-step step="2" editable>
      {{ $t('dateGoal') }}
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
                :first-day-of-week="1"
                :locale="$auth.user.locale"
                :allowed-dates="allowedDates"
                :min="minDate"
                :max="endDate === '' ? maxDate : endDate"
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
                  hint="DD-MM-YYYY"
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
                :allowed-dates="allowedDates"
                :min="startDate === '' ? minDate : startDate"
                :max="maxDate"
                no-title
                @change="form.endDate = formatDate(endDate)"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>

      <div v-if="form.id" class="ml-6">
        <step-buttons-group
          :continue-title="$t('updateGoal')"
          continue-color="primary"
          continue-class="white text-body-2"
          @next="$emit('update')"
          @cancel="$emit('cancel')"
        />

        <v-alert outlined color="red">
          <p class="text-h6 mb-0">{{ $t('dangerZone') }}</p>
          <p class="black--text">
            {{ $t('delete3') }}
          </p>
          <v-dialog v-model="dialog" width="500">
            <template #activator="{ on, attrs }">
              <v-btn
                small
                rounded
                elevation="0"
                color="red"
                class="white--text"
                v-bind="attrs"
                v-on="on"
              >
                {{ $t('deleteGoal') }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h6 red--text mb-0">
                {{ $t('deleteGoal') }}
              </v-card-title>

              <v-card-text class="black--text">
                {{ $t('deleteGoalConf') }}
              </v-card-text>

              <v-card-actions>
                <v-btn
                  small
                  rounded
                  elevation="0"
                  color="red"
                  class="white--text"
                  @click="$emit('remove')"
                >
                  {{ $t('deleteGoal') }}
                </v-btn>

                <v-btn small rounded elevation="0" @click="dialog = false">
                  {{ $t('cancel') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-alert>
      </div>

      <step-buttons-group
        v-else
        :continue-title="$t('createGoal')"
        continue-color="primary"
        continue-class="white text-body-2"
        @next="$emit('create')"
        @cancel="$emit('cancel')"
      />
    </v-stepper-content>
  </v-stepper>
</template>

<script>
export default {
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
    dates: {
      type: Array,
      default: null,
    },
  },

  data() {
    console.log(this.dates)
    return {
      step: 1,
      menu1: false,
      menu2: false,
      dialog: null,
      startDate: this.value.startDate || this.minDate,
      endDate: this.value.endDate || this.maxDate,
      form: {
        id: this.value.id || null,
        startObjectiveValue: this.value.startQualitativeValue || null,
        endObjectiveValue: this.value.endQualitativeValue || null,
        startDate:
          this.formatDate(this.value.startDate) ||
          this.formatDate(this.minDate),
        endDate:
          this.formatDate(this.value.endDate) || this.formatDate(this.maxDate),
        objectiveType: 'QUALITATIVE',
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

    indicatorItemsEnd() {
      return this.indicatorDto.qualitativeTypeDTO.weightedValues.map((i) => {
        return {
          value: {
            qualitativeWeightedValueId: i.qualitativeWeightedValueId,
            qualitativeTypeId: i.qualitativeTypeId,
            qualitativeValue: 'APPROVED',
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
  methods: {
    allowedDates(date) {
      const actDate = new Date(date)
      const minDate = new Date(this.minDate)
      const maxDate = new Date(this.maxDate)

      if (actDate >= minDate && actDate <= maxDate) {
        for (let i = 0; i < this.dates.length; i++) {
          if (actDate >= this.dates[i].start && actDate <= this.dates[i].end)
            return false
        }
        return true
      }
      return false
    },
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
  },
}
</script>

<style></style>
