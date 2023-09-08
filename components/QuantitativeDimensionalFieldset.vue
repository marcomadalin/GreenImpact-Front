<template>
  <v-stepper v-model="step" vertical elevation="0" class="transparent">
    <v-stepper-step step="1" editable>
      {{ $t('titleGoal') }}
    </v-stepper-step>
    <v-stepper-content step="1" editable>
      <!-- component -->
      <v-container
        v-for="(item, index) in indicatorDto.dimensionalType.dimensionValues"
        :key="index"
      >
        <v-row>
          {{ item.dimensionValueName }}
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="form[index].startQuantitativeValue"
              type="number"
              :suffix="
                indicatorDto.quantitativeMeasurementUnitDTO
                  .quantitativeMeasurementUnit
              "
              filled
              shaped
              required
              background-color="white"
              :label="$t('startValue')"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="form[index].endQuantitativeValue"
              type="number"
              :suffix="
                indicatorDto.quantitativeMeasurementUnitDTO
                  .quantitativeMeasurementUnit
              "
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
                  v-model="startDate"
                  :label="$t('startDate')"
                  hint="DD-MM-YYYY"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  filled
                  shaped
                  required
                  background-color="white"
                  @blur="displayStartDate = parseDate(startDate)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="displayStartDate"
                :first-day-of-week="1"
                :locale="$auth.user.locale"
                :allowed-dates="allowedDates"
                :min="minDate"
                :max="displayEndDate == null ? maxDate : displayEndDate"
                no-title
                @change="startDate = formatDate(displayStartDate)"
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
                  v-model="endDate"
                  :label="$t('endDate')"
                  hint="DD-MM-YYYY"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  filled
                  shaped
                  required
                  background-color="white"
                  @blur="displayEndDate = parseDate(endDate)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="displayEndDate"
                :first-day-of-week="1"
                :locale="$auth.user.locale"
                :allowed-dates="allowedDates"
                :min="displayStartDate == null ? minDate : displayStartDate"
                :max="maxDate"
                no-title
                @change="endDate = formatDate(displayEndDate)"
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
      type: Array,
      default: () => [],
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
    const form = this.indicatorDto.dimensionalType.dimensionValues.map((i) => {
      return {
        label: i.dimensionValueName,
        quantitativeDimensionOrder: i.dimensionValueOrder,
        startQuantitativeValue: null,
        endQuantitativeValue: null,
        startDate: this.formatDate(this.minDate),
        endDate: this.formatDate(this.maxDate),
        objectiveType: 'QUANTITATIVE_DIMENSIONAL',
      }
    })

    return {
      step: 1,
      menu1: false,
      menu2: false,
      dialog: null,
      startDate: this.formatDate(this.minDate),
      endDate: this.formatDate(this.maxDate),
      displayStartDate: this.parseDate(this.minDate),
      displayEndDate: this.parseDate(this.maxDate),
      form,
    }
  },

  watch: {
    form: {
      handler(value) {
        this.$emit('input', value)
      },
      deep: true,
    },
    startDate(value) {
      // update all items date
      this.form.forEach((i) => (i.startDate = value))
    },
    endDate(value) {
      // update all items date
      this.form.forEach((i) => (i.endDate = value))
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
