<template>
  <v-container :key="componentKey" fluid class="pl-0 pb-10">
    <v-row no-gutters>
      <v-col cols="auto" style="max-width: 310px">
        <area-action-card
          :area="area"
          :title="area.areaName"
          :description="area.areaDescription"
          :hover="false"
          :indicators="
            area.areaIndicatorDTOs.filter(
              (i) => i.indicatorDTO.indicatorEnabled
            ).length
          "
          :start-date="area.areaStartDate"
          :end-date="area.areaEndDate"
          :image-path-info="area.plan.planUUID + '/' + area.areaId"
          :anchor-to="'anchor-' + area.areaId"
          :ods="getOds(area)"
        ></area-action-card>
      </v-col>
      <v-col class="pl-5">
        <!-- areas indicator list -->
        <v-container v-if="area.areaIndicatorDTOs.length" fluid class="pa-0">
          <div v-for="(item, i) in area.areaIndicatorDTOs" :key="i">
            <div class="rounded-lg mb-0 white pa-0 plain-shadow">
              <v-row no-gutters class="pt-0">
                <v-col cols="12" class="darkBlue10 pa-3 rounded-lg rounded-b-0">
                  <v-icon size="18" class="mr-1 mt-n1" color="blue"
                    >mdi-flag-outline</v-icon
                  >
                  <span class="blue--text text-body-2 mb-0 mr-auto">
                    {{ $t('indicator') }}
                  </span>
                </v-col>
              </v-row>
              <v-row class="px-4 pt-3 pb-4 mt-0" no-gutters>
                <v-col class="pr-3">
                  <p class="body-1 darkGray--text mb-0">
                    {{ item.indicatorDTO.indicatorName }}
                  </p>
                </v-col>
                <v-col
                  v-if="
                    hasLogbook &&
                    init &&
                    item.logbook &&
                    item.logbook.logBookEnabled &&
                    item.logbook.folders[0].items.length > 0
                  "
                  cols="auto"
                >
                  <logbook-tooltip
                    :logbook="item.logbook"
                    :indicator="item"
                  ></logbook-tooltip>
                </v-col>
                <v-col v-if="item.objectiveDTOs.length > 0" cols="auto">
                  <v-btn
                    class="primary--text"
                    rounded
                    small
                    color="white"
                    elevation="0"
                    @click="() => togglePanel(i)"
                    ><v-icon>mdi-chevron-down</v-icon></v-btn
                  >
                </v-col>
              </v-row>
              <v-row class="px-4 pb-4 mt-0" no-gutters>
                <v-col cols="6" class="pr-5">
                  <status-progress-bar :value="item" />
                </v-col>
                <v-col class="text-right pr-2">
                  <span class="text-caption mt-2 darkBlue50--text mr-1">
                    {{ $t(item.indicatorDTO.indicatorType) }}
                  </span>
                </v-col>
                <v-col cols="auto">
                  <v-avatar
                    v-for="(imp, ix) in _impact
                      .flatMap((i) =>
                        i.dtoReference.theMany.filter(
                          (j) => j.indicatorUUID === item.indicatorUUID
                        ).length
                          ? i.dtoReference.theOne
                          : null
                      )
                      .filter((i) => i)"
                    :key="ix"
                    tile
                    size="28"
                    class="mr-1"
                  >
                    <v-img
                      :src="
                        require(`/assets/img/sdg/small/ico-ODS-${imp.levelN_ItemId}.svg`)
                      "
                      width="28px"
                      height="28px"
                    />
                  </v-avatar>
                </v-col>
                <v-col cols="auto" class="text-right">
                  <v-img
                    v-for="imp in frameworks"
                    :key="`${i}-${imp}`"
                    :src="getImageFramework(imp)"
                    width="28"
                  ></v-img>
                </v-col>
              </v-row>
            </div>
            <v-row no-gutters>
              <v-col cols="12" class="mt-5">
                <v-expansion-panels
                  :key="`panel-${i}`"
                  v-model="graphPanel[i].panel"
                  flat
                >
                  <v-expansion-panel class="lightGray">
                    <v-expansion-panel-content class="px-0 custom-panel">
                      <v-container class="px-0 py-0" fluid>
                        <v-row
                          v-for="(obj, j, k) in getObjectiveDTOs(item)"
                          :key="`${i}-${j}`"
                          no-gutters
                          class="mb-5"
                        >
                          <v-col
                            cols="auto"
                            class="white rounded-lg plain-shadow"
                          >
                            <v-row no-gutters style="max-width: 310px">
                              <v-col cols="12" class="pa-3">
                                <v-icon size="16" class="mr-2 mb-1" color="blue"
                                  >mdi-chart-timeline-variant</v-icon
                                >
                                <span
                                  class="blue--text text-body-2 mb-0 mr-auto"
                                  >{{ $t('objective') + ' ' }}
                                  {{
                                    typeof j === 'string' ? k + 1 : j + 1
                                  }}</span
                                >
                              </v-col>
                              <v-col cols="12">
                                <v-divider></v-divider>
                              </v-col>
                              <v-col cols="12" class="pa-4">
                                <div>
                                  <v-card
                                    class="rounded-md pa-3 text-right w-full mx-lg-auto mb-5 elevation-0"
                                    color="lightGray"
                                  >
                                    <v-row align="center" no-gutters>
                                      <v-col cols="auto" class="pr-4">
                                        <span>
                                          <v-icon size="22" color="gray"
                                            >mdi-calendar-today-outline</v-icon
                                          >
                                        </span>
                                      </v-col>
                                      <v-col cols="auto" class="text-left">
                                        <p
                                          class="darkBlue50--text text-caption mb-1"
                                        >
                                          {{ $t('startDate') }}
                                        </p>
                                        <p
                                          class="text-body-2 darkGray--text mb-0"
                                        >
                                          {{ formatDate(getStartDate(obj)) }}
                                        </p>
                                      </v-col>
                                      <v-col
                                        cols="auto"
                                        class="px-4 text-center"
                                      >
                                        <v-divider
                                          style="height: 32px"
                                          vertical
                                          class="darkBlue20"
                                        ></v-divider>
                                      </v-col>
                                      <v-col cols="auto" class="text-left">
                                        <p
                                          class="darkBlue50--text text-caption mb-1"
                                        >
                                          {{ $t('endDate') }}
                                        </p>
                                        <p
                                          class="text-body-2 darkGray--text mb-0"
                                        >
                                          {{ formatDate(getEndDate(obj)) }}
                                        </p>
                                      </v-col>
                                    </v-row>
                                  </v-card>
                                  <v-expansion-panels
                                    v-if="Array.isArray(obj)"
                                    flat
                                  >
                                    <v-expansion-panel
                                      v-for="(objMulti, key) in obj"
                                      :key="key"
                                    >
                                      <v-expansion-panel-header
                                        class="text-body-2 blue--text px-0 expansion-header-blue-icon"
                                      >
                                        {{
                                          getDimensionalHeader(objMulti, item)
                                        }}
                                      </v-expansion-panel-header>
                                      <v-expansion-panel-content>
                                        <v-card
                                          class="rounded-md pa-4 text-left mb-1"
                                          flat
                                          color="primary"
                                        >
                                          <v-row no-gutters align="center">
                                            <v-col cols="auto">
                                              <v-icon color="white" class="mr-2"
                                                >mdi-arrow-left</v-icon
                                              >
                                            </v-col>
                                            <v-col>
                                              <p
                                                class="lightGray--text text-caption mb-1"
                                              >
                                                {{ $t('startValue') }}
                                              </p>
                                              <p
                                                class="text-body-1 white--text mb-0 font-weight-bold"
                                              >
                                                {{ getStartValue(objMulti) }}
                                                {{ getMeasurementUnit(item) }}
                                              </p>
                                            </v-col>
                                          </v-row>
                                        </v-card>
                                        <v-card
                                          class="rounded-md pa-4 text-left"
                                          flat
                                          color="green"
                                        >
                                          <v-row no-gutters align="center">
                                            <v-col cols="auto">
                                              <v-icon color="white" class="mr-2"
                                                >mdi-arrow-right</v-icon
                                              >
                                            </v-col>
                                            <v-col>
                                              <p
                                                class="white--text text-caption mb-1"
                                              >
                                                {{ $t('Valor final') }}
                                              </p>
                                              <p
                                                class="text-body-1 white--text mb-0 font-weight-bold"
                                              >
                                                {{ getEndValue(objMulti) }}
                                                {{ getMeasurementUnit(item) }}
                                              </p></v-col
                                            >
                                          </v-row>
                                        </v-card>
                                      </v-expansion-panel-content>
                                    </v-expansion-panel>
                                  </v-expansion-panels>
                                  <template v-else>
                                    <v-card
                                      class="rounded-md pa-4 text-left mb-1"
                                      flat
                                      color="primary"
                                    >
                                      <v-row no-gutters align="center">
                                        <v-col cols="auto">
                                          <v-icon color="white" class="mr-2"
                                            >mdi-arrow-left</v-icon
                                          >
                                        </v-col>
                                        <v-col>
                                          <p
                                            class="lightGray--text text-caption mb-1"
                                          >
                                            {{ $t('startValue') }}
                                          </p>
                                          <p
                                            class="text-body-1 white--text mb-0 font-weight-bold"
                                          >
                                            {{ getStartValue(obj) }}
                                            {{ getMeasurementUnit(item) }}
                                          </p>
                                        </v-col>
                                      </v-row>
                                    </v-card>
                                    <v-card
                                      class="rounded-md pa-4 text-left"
                                      flat
                                      color="green"
                                    >
                                      <v-row no-gutters align="center">
                                        <v-col cols="auto">
                                          <v-icon color="white" class="mr-2"
                                            >mdi-arrow-right</v-icon
                                          >
                                        </v-col>
                                        <v-col>
                                          <p
                                            class="white--text text-caption mb-1"
                                          >
                                            {{ $t('endValue') }}
                                          </p>
                                          <p
                                            class="text-body-1 white--text mb-0 font-weight-bold"
                                          >
                                            {{ getEndValue(obj) }}
                                            {{ getMeasurementUnit(item) }}
                                          </p></v-col
                                        >
                                      </v-row>
                                    </v-card>
                                  </template>
                                </div>
                              </v-col>
                              <v-col
                                v-if="item.indicatorDTO.dimensionalType"
                                cols="12"
                              >
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col
                            class="white rounded-lg plain-shadow text-right ml-5 pb-8 py-8 pb-8"
                            style="height: 100%"
                          >
                            <!-- CHAR -->
                            <!------------------------------------------------------->
                            <v-chart
                              :option="chartOption(obj, item.indicatorDTO)"
                              :autoresize="true"
                              class="chart"
                            />
                            <div class="mr-8">
                              <sample-list-view-dialog
                                :samples="getSamples(obj)"
                                :indicator="item.indicatorDTO"
                                :measurement-unit="getMeasurementUnit(item)"
                              ></sample-list-view-dialog>
                            </div>
                            <!------------------------------------------------------->
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { statusEnum } from '~/constants'
import API_LOGBOOK from '~/api/logbook'

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

export default {
  name: 'AreaListItem',
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: 'light',
  },
  props: {
    areaItem: {
      type: Object,
      default: () => ({}),
    },
    impact: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    const area = this.areaItem
    return {
      area,
      dialog: null,
      // impact: [],
      graphPanel: this.areaItem.areaIndicatorDTOs.map((i) => ({
        panel: null,
      })),
      imagePath: null,
      init: false,
      componentKey: 0,
    }
  },

  computed: {
    statusEnum() {
      return statusEnum
    },
    _impact() {
      return this.impact.filter(
        (i) =>
          i.dtoReference.theMany.filter(
            (j) =>
              this.area.areaIndicatorDTOs.filter(
                (k) => k.indicatorUUID === j.indicatorUUID
              ).length > 0
          ).length > 0
      )
    },
    frameworks() {
      return Array.from(
        new Set(this._impact.map((i) => i.dtoReference.theOne.frameworkId))
      )
    },
  },

  async beforeMount() {
    let logbooks = []
    if (this.hasLogbook) {
      try {
        logbooks = await API_LOGBOOK.init(this.$axios).getIndicatorLogbooks(
          this.$auth.user.loggedOrganizationUuid,
          this.area.plan.planUUID,
          this.area.areaId
        )
      } catch (e) {
        console.log(e.response)
      }
    }
    for (let i = 0; i < this.area.areaIndicatorDTOs.length; i++) {
      this.area.areaIndicatorDTOs[i].logbook = null
      for (let j = 0; j < logbooks.length; ++j) {
        if (
          logbooks[j].logBookType === 'AREA_INDICATOR' &&
          logbooks[j].planUUID === this.area.plan.planUUID &&
          logbooks[j].areaId === this.area.areaId &&
          logbooks[j].areaIndicatorId ===
            this.area.areaIndicatorDTOs[i].areaIndicatorId
        ) {
          this.area.areaIndicatorDTOs[i].logbook = logbooks[j]
          break
        }
      }
    }
    this.init = true
    this.componentKey += 1
  },

  methods: {
    formatDate(date) {
      const datePart = date.match(/\d+/g)
      const year = datePart[0]
      const month = datePart[1]
      const day = datePart[2]

      return day + '-' + month + '-' + year
    },
    remove(item) {
      this.$emit('remove', item)
      this.dialog = false
    },
    getImageFramework(imp) {
      switch (imp) {
        case 1:
          return require('~/assets/img/frameworks/aue_icon.png')
        case 2:
          return require('~/assets/img/indicators/ind_2030.png')
      }
    },
    getMeasurementUnit(item) {
      if (item.indicatorDTO.indicatorType === 'QUALITATIVE') {
        // return '%'
        return ''
      }
      return item.indicatorDTO.quantitativeMeasurementUnitDTO
        .quantitativeMeasurementUnit
    },

    getStartValue(obj) {
      if (
        obj.objectiveType === 'QUANTITATIVE' ||
        obj.objectiveType === 'QUANTITATIVE_DIMENSIONAL'
      ) {
        return obj.startQuantitativeValue
      }

      if (
        obj.objectiveType === 'QUALITATIVE' ||
        obj.objectiveType === 'QUALITATIVE_DIMENSIONAL'
      ) {
        // return obj.startObjectiveValue.qualitativeWeight
        return obj.startObjectiveValue.qualitativeValue
      }
      return Math.min(...obj.map((a) => a.startQuantitativeValue))
    },

    getEndValue(obj) {
      if (
        obj.objectiveType === 'QUANTITATIVE' ||
        obj.objectiveType === 'QUANTITATIVE_DIMENSIONAL'
      ) {
        return obj.endQuantitativeValue
      }

      if (
        obj.objectiveType === 'QUALITATIVE' ||
        obj.objectiveType === 'QUALITATIVE_DIMENSIONAL'
      ) {
        // return obj.endObjectiveValue.qualitativeWeight
        return obj.endObjectiveValue.qualitativeValue
      }

      return Math.max(...obj.map((a) => a.endQuantitativeValue))
    },

    getDimensionalHeader(objMulti, item) {
      const header = item.indicatorDTO.dimensionalType.dimensionValues.find(
        (i) => objMulti.quantitativeDimensionOrder === i.dimensionValueOrder
      )
      if (header) {
        return header.dimensionValueName
      }
    },

    getValue(obj, indicator) {
      let color

      switch (obj.status.toLowerCase()) {
        case 'red':
          color = '#F8003B'
          break
        case 'yellow':
          color = '#CAA628'
          break
        case 'green':
          color = '#12BB6A'
          break
      }
      if (obj.sampleType === 'QUANTITATIVE') {
        return {
          value: obj.quantitativeValue,
          itemStyle: {
            color,
            borderColor: '#FFFFFF',
            borderWidth: 2,
          },
        }
      }
      if (obj.sampleType === 'QUANTITATIVE_DIMENSIONAL') {
        return {
          value: obj.quantitativeValue,
          itemStyle: {
            color,
            borderColor: '#FFFFFF',
            borderWidth: 2,
          },
          dimension: indicator
            ? indicator.dimensionalType.dimensionValues.find(
                (i) => i.dimensionValueOrder === obj.quantitativeDimensionOrder
              ).dimensionValueName
            : null,
        }
      }
      if (obj.sampleType === 'QUALITATIVE') {
        return {
          value: obj.sampleValue.qualitativeWeight,
          valuedata: obj.sampleValue.qualitativeValue,
          itemStyle: {
            color,
            borderColor: '#FFFFFF',
            borderWidth: 2,
          },
        }
      }
    },

    getStartDate(obj) {
      if (Array.isArray(obj)) {
        return obj[0].startDate
      }
      return obj.startDate
    },

    getEndDate(obj) {
      if (Array.isArray(obj)) {
        return obj[0].endDate
      }
      return obj.endDate
    },
    isObjectiveDimensional(obj) {
      let objectiveType
      if (Array.isArray(obj)) {
        objectiveType = obj[0].objectiveType
      } else {
        objectiveType = obj.objectiveType
      }
      return (
        objectiveType === 'QUANTITATIVE_DIMENSIONAL' ||
        objectiveType === 'QUALITATIVE_DIMENSIONAL'
      )
    },

    getSamples(obj) {
      if (Array.isArray(obj)) {
        return obj
          .flatMap((i) => i.samplesPerObjective)
          .sort((a, b) => new Date(a.sampleDate) - new Date(b.sampleDate))
      }
      return obj.samplesPerObjective
    },

    getObjectiveDTOs(obj) {
      if (obj.indicatorDTO.indicatorType === 'QUANTITATIVE') {
        return obj.objectiveDTOs
      }
      if (obj.indicatorDTO.indicatorType === 'QUANTITATIVE_DIMENSIONAL') {
        return obj.objectiveDTOs.reduce((items, obj) => {
          const key = `${obj.startDate}:${obj.endDate}`
          const curr = items[key] ?? []
          return { ...items, [key]: [...curr, obj] }
        }, {})
      }
      if (obj.indicatorDTO.indicatorType === 'QUALITATIVE') {
        return obj.objectiveDTOs
      }
    },

    chartOption(item, indicator) {
      let series = []
      let dates = []
      let min = null
      let max = null
      if (Array.isArray(item)) {
        series = item.map((j) => {
          return {
            symbol: 'circle',
            symbolSize: 12,
            name: indicator
              ? indicator.dimensionalType.dimensionValues.find(
                  (i) => i.dimensionValueOrder === j.quantitativeDimensionOrder
                ).dimensionValueName
              : null,
            type: 'line',
            lineStyle: {
              width: 4,
            },
            connectNulls: true,
            data: j.samplesPerObjective
              .map((i) => this.getValue(i))
              .sort((a, b) => new Date(a.sampleDate) - new Date(b.sampleDate)),
          }
        })
        const arrMin = []
        const arrMax = []
        for (let i = 0; i < series.length; i++) {
          arrMin.push(...series[i].data.map((o) => o.value))
          arrMax.push(...series[i].data.map((o) => o.value))
        }
        min = Math.min(...arrMin)
        max = Math.max(...arrMax)

        dates = Array.from(
          new Set(
            item
              .flatMap((i) =>
                i.samplesPerObjective.map((j) =>
                  this.formatDate(j.sampleDate.split('T')[0])
                )
              )
              .sort((a, b) => new Date(a) - new Date(b))
          )
        )
      } else {
        series = {
          symbol: 'circle',
          symbolSize: 12,
          name: 'Valor',
          type: 'line',
          step: item.objectiveType === 'QUALITATIVE' ? 'end' : false,
          connectNulls: true,
          lineStyle: {
            color: '#2BB8C8',
            width: 4,
          },
          data: item.samplesPerObjective
            .map((i) => this.getValue(i))
            .sort((a, b) => new Date(a.sampleDate) - new Date(b.sampleDate)),
        }
        min = Math.min(...series.data.map((o) => o.value))
        max = Math.max(...series.data.map((o) => o.value))

        dates = Array.from(
          new Set(
            item.samplesPerObjective
              .map((j) => this.formatDate(j.sampleDate.split('T')[0]))
              .sort((a, b) => new Date(a) - new Date(b))
          )
        )
      }
      return {
        grid: { top: 20 },
        textStyle: {
          fontFamily: 'Inter',
          color: '#060632',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          data: dates,
        },
        yAxis: {
          max,
          min,
        },
        series,
      }
    },
    togglePanel(i) {
      this.graphPanel[i].panel = this.graphPanel[i].panel === 0 ? null : 0
    },
    getOds(area) {
      let ods = this.$props.impact.filter(
        (i) =>
          i.dtoReference.theMany.filter(
            (j) =>
              area.areaIndicatorDTOs.filter(
                (k) => k.indicatorUUID === j.indicatorUUID
              ).length > 0
          ).length > 0
      )
      ods = ods.flatMap((dtoLevel) => {
        return dtoLevel.dtoReference.theOne
      })
      return ods
    },
  },
}
</script>
<style lang="scss" scoped>
.chart {
  height: 400px;
  max-height: 400px;
  width: 100%;
}
.description-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  @supports (-webkit-line-clamp: 2) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
