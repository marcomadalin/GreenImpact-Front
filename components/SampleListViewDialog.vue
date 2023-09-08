<template>
  <div>
    <v-bottom-sheet
      v-model="sheet"
      width="720"
      content-class="rounded-lg"
      overlay-color="darkBlue"
      overlay-opacity="0.6"
    >
      <template #activator="{ on, attrs }">
        <a
          href="#!"
          class="text-body-2 primary--text text-decoration-none d-block"
          v-bind="attrs"
          v-on="on"
          >{{ $t('viewSamples') }}</a
        >
      </template>
      <v-card
        flat
        class="pa-10 rounded-lg rounded-b-0"
        min-height="50vh"
        max-height="110vh"
      >
        <div
          class="text-right"
          style="position: absolute; top: 30px; right: 40px"
        >
          <v-btn depressed icon color="primary" @click="sheet = false">
            <v-icon>mdi-close</v-icon></v-btn
          >
        </div>
        <p class="text-h2 blue--text mb-5">
          {{ $t('samples') }}
        </p>
        <p
          class="text-body-1 darkBlue--text mb-10"
          v-text="indicator ? indicator.indicatorName : ''"
        ></p>
        <v-data-table
          :headers="headers"
          :items="getSamples(samples, indicator)"
          item-key="date-value-dimension"
          sort-by="date"
          class="elevation-0 sample-table"
          :items-per-page="100"
          :footer-props="{
            'items-per-page-options': [100],
            'items-per-page-text': null,
          }"
          fixed-header
          fixed-footer
        >
          <template
            #[`footer.page-text`]="{ pageStart, pageStop, itemsLength }"
          >
            <div>
              {{ pageStart }}-{{ pageStop }} {{ $t('of') }} {{ itemsLength }}
            </div>
          </template>
          <template #[`item.value`]="{ item }">
            <span
              class="pa-1 px-2 white--text"
              style="border-radius: 1000px"
              :class="item.status.toLowerCase()"
              >{{ item.value }}</span
            >
          </template>
        </v-data-table>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
<script>
export default {
  props: {
    samples: {
      type: Array,
      default: () => [],
    },
    indicator: {
      type: Object,
      default: () => {},
    },
    measurementUnit: {
      type: String,
      default: null,
    },
  },
  data() {
    const headers = []
    let isDimensional = false
    if (
      this.$props.indicator.indicatorDTOType === 'QUALITATIVE_DIMENSIONAL' ||
      this.$props.indicator.indicatorDTOType === 'QUANTITATIVE_DIMENSIONAL'
    ) {
      isDimensional = true
      headers.push({
        text: this.$t('date'),
        align: 'start',
        value: 'date',
        groupable: false,
      })
      headers.push({
        text: this.$t('dimensions'),
        align: 'start',
        value: 'name',
        groupable: false,
      })
    } else {
      headers.push({
        text: this.$t('date'),
        align: 'start',
        value: 'date',
        groupable: false,
      })
    }
    let valueHeader = this.$t('value')
    if (this.$props.measurementUnit) {
      valueHeader += ` (${this.$props.measurementUnit})`
    }
    headers.push({
      text: valueHeader,
      align: 'start',
      value: 'value',
      groupable: false,
    })
    return {
      sheet: false,
      headers,
      isDimensional,
    }
  },
  methods: {
    getDimensionalHeader(dimensionOrder, indicator) {
      const header = indicator.dimensionalType.dimensionValues.find(
        (i) => dimensionOrder === i.dimensionValueOrder
      )
      if (header) {
        return header.dimensionValueName
      }
    },
    stressTest(samples, indicator) {
      let results = []
      for (let i = 0; i < 50; i++) {
        results = results.concat(this.getSamples(samples, indicator))
      }
      return results
    },
    getSamples(samples, indicator) {
      return samples.map((sample) => {
        let value
        let dimensionOrder
        if (
          sample.sampleType === 'QUANTITATIVE' ||
          sample.sampleType === 'QUANTITATIVE_DIMENSIONAL'
        ) {
          if (sample.sampleValue) {
            value = sample.sampleValue.quantitativeValue
          } else {
            value = sample.quantitativeValue
          }
        }
        if (
          sample.sampleType === 'QUALITATIVE' ||
          sample.sampleType === 'QUALITATIVE_DIMENSIONAL'
        ) {
          if (sample.sampleValue) {
            value = sample.sampleValue.qualitativeValue
          } else {
            value = sample.qualitativeValue
          }
        }
        if (sample.sampleType === 'QUALITATIVE_DIMENSIONAL') {
          dimensionOrder = sample.qualitativeDimensionOrder
        }
        if (sample.sampleType === 'QUANTITATIVE_DIMENSIONAL') {
          dimensionOrder = sample.quantitativeDimensionOrder
        }
        if (dimensionOrder) {
          return {
            date: this.formatDate(sample.sampleDate.split('T')[0]),
            name: this.getDimensionalHeader(dimensionOrder, indicator),
            value,
            status: sample.status,
          }
        } else {
          return {
            date: this.formatDate(sample.sampleDate.split('T')[0]),
            value,
            status: sample.status,
          }
        }
      })
    },
    formatDate(date) {
      if (!date) return null

      const [year, day, month] = date.split('-')
      return `${month}-${day}-${year}`
    },
  },
}
</script>
