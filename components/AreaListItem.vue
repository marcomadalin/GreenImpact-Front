<template>
  <v-container :key="componentKey" fluid class="pl-0">
    <v-fade-transition mode="out-in">
      <v-row no-gutters class="rounded-sm mb-1 white py-0 pr-5">
        <v-col cols="auto" class="ml-0 mr-6">
          <v-img
            :src="imagePath"
            style="border-radius: 8px 0px 0px 8px"
            aspect-ratio="1"
            width="115"
            height="100%"
          />
        </v-col>
        <v-col class="d-flex justify-start mr-4 py-4">
          <div class="ml-0">
            <div
              class="blue--text mb-0 text-caption"
              style="display: flex; align-items: center"
            >
              <img
                class="mr-1"
                width="17px"
                height="17px"
                :src="require(`assets/img/icons/Area.svg`)"
              />
              {{ $t('actionArea') }}
            </div>
            <p class="text-body-1 darkGray--text mb-2">{{ area.areaName }}</p>
            <p class="text-body-2 darkGray--text mb-0 description-text">
              {{ area.areaDescription }}
            </p>
          </div>
        </v-col>
        <v-col cols="auto" class="pr-8 py-4">
          <p class="grey--text mb-0 text-caption">
            {{ $t('indicators') }}
          </p>
          <p class="body-2 darkGray--text">
            {{
              area.areaIndicatorDTOs.filter(
                (i) => i.indicatorDTO.indicatorEnabled
              ).length
            }}
          </p>
        </v-col>
        <v-col cols="auto" class="pr-8 py-4">
          <p class="grey--text mb-0 text-caption">
            {{ $t('startDate') }}
          </p>
          <p class="body-2 darkGray--text">
            {{ formatDate(area.areaStartDate) }}
          </p>
        </v-col>
        <v-col cols="auto" class="pr-10 py-4">
          <p class="grey--text mb-0 text-caption">
            {{ $t('endDate') }}
          </p>
          <p class="body-2 darkGray--text">
            {{ formatDate(area.areaEndDate) }}
          </p>
        </v-col>
        <v-col cols="auto" class="pr-3 py-4">
          <v-btn
            class="text-body-2 primary--text"
            rounded
            small
            elevation="0"
            :to="{
              name: 'area-indicators-add',
              params: { plan: area.plan.planUUID, id: area.areaId },
            }"
          >
            <img
              class="mr-1 icon-correction-margin"
              style="width: 18px; height: 18px"
              :src="require(`assets/img/icons/indicators.svg`)"
            />
            {{ $t('addIndicatorButton') }}</v-btn
          >
        </v-col>
        <v-col class="text-center pt-4" cols="auto">
          <logbook-tooltip
            v-if="hasLogbook && init && area"
            :logbook="area.logbook"
            :area="area"
            :edit="true"
          ></logbook-tooltip>
        </v-col>
        <v-col cols="auto" class="pr-5 py-4">
          <v-btn
            class="primary--text"
            rounded
            small
            color="white"
            elevation="0"
            :to="{
              name: 'area-update',
              params: { plan: area.plan.planUUID, id: area.areaId },
            }"
            ><img
              class="iconDrawer"
              :src="require(`assets/img/icons/Edit.svg`)"
          /></v-btn>
        </v-col>
      </v-row>
    </v-fade-transition>

    <!-- areas indicator list -->
    <v-container v-if="area.areaIndicatorDTOs.length" fluid class="pa-0">
      <v-row
        v-for="(item, i) in area.areaIndicatorDTOs"
        :key="i"
        class="rounded-sm mb-0 white ml-16 pa-4 mb-1"
        no-gutters
      >
        <v-col cols="12" class="d-flex">
          <p class="blue--text text-caption mb-0 mr-auto">
            <svg width="16px" height="16px" viewBox="0 0 24 24" class="mb-n1">
              <path
                fill="currentColor"
                d="M5 5h8.423l1.154 2H19v9h-6l-1.155-2H6v7H5V5Zm13 10V8h-4l-1.155-2H6v7h6.423l1.154 2H18Z"
              ></path>
            </svg>
            {{ $t('indicator') }}
          </p>

          <logbook-tooltip
            v-if="hasLogbook && init"
            :logbook="item.logbook"
            :indicator="item"
            :edit="true"
          ></logbook-tooltip>
          <v-btn
            class="primary--text"
            rounded
            small
            color="white"
            elevation="0"
            @click="
              () => {
                dialogIndicator = true
                deleteAreaIndicatorId = item.areaIndicatorId
              }
            "
            ><img
              class="iconDrawer"
              :src="require(`assets/img/icons/Delete.svg`)"
          /></v-btn>

          <v-btn
            v-if="item.objectiveDTOs.length > 0"
            class="primary--text"
            rounded
            small
            color="white"
            elevation="0"
            @click="() => togglePanel(i)"
            ><v-icon>mdi-chevron-down</v-icon></v-btn
          >
        </v-col>
        <v-col cols="7" class="pr-5">
          <p class="body-1 darkGray--text">
            {{ item.indicatorDTO.indicatorName }}
          </p>
          <status-progress-bar :value="item" />
        </v-col>
        <v-col cols="3">
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
            size="22"
            class="mr-2"
          >
            <v-img
              :src="
                require(`/assets/img/sdg/small/ico-ODS-${imp.levelN_ItemId}.svg`)
              "
              width="22px"
              height="22px"
            />
          </v-avatar>

          <p class="text-caption mt-2">
            {{ $t(item.indicatorDTO.indicatorType) }}
          </p>

          <!-- TODO -->
          <!--
          <img
            v-for="imp in frameworks"
            :key="`${i}-${imp}`"
            :src="`/b2b/${imp === 1 ? 'ma2030' : 'aue'}/image`"
            style="width: 28px"
          />
          -->
        </v-col>
        <v-col cols="2">
          <v-btn
            small
            class="text-body-2 primary--text mb-1"
            color="primary--text"
            rounded
            depressed
            :to="{
              name: 'area-samples-add',
              params: {
                plan: area.plan.planUUID,
                area: area.areaId,
                indicator: item.areaIndicatorId,
              },
            }"
          >
            <img
              class="mr-1 icon-correction-margin"
              style="width: 18px; height: 18px"
              :src="require(`assets/img/icons/Sample.svg`)"
            />
            {{ $t('addSample') }}</v-btn
          >
          <v-btn
            small
            class="text-body-2 primary--text"
            color="primary--text"
            rounded
            depressed
            :to="{
              name: 'area-objectives-add',
              params: {
                plan: area.plan.planUUID,
                area: area.areaId,
                indicator: item.areaIndicatorId,
                dates: getUsedDates(item),
              },
            }"
          >
            <img
              class="mr-1 icon-correction-margin"
              style="width: 18px; height: 18px"
              :src="require(`assets/img/icons/Goal.svg`)"
            />
            {{ $t('addGoal') }}</v-btn
          >
        </v-col>
        <v-col cols="12" class="d-flex">
          <v-expansion-panels
            :key="`panel-${i}`"
            v-model="graphPanel[i].panel"
            flat
            class="px-0"
          >
            <v-expansion-panel class="px-0">
              <v-expansion-panel-content class="px-0 custom-panel">
                <v-container class="px-0 py-0" fluid>
                  <v-row
                    v-for="(obj, j, k) in getObjectiveDTOs(item)"
                    :key="`${i}-${j}`"
                    no-gutters
                    class="mb-8"
                  >
                    <v-col cols="12" class="blue--text mb-6">
                      <img
                        class="mr-1 icon-correction-margin"
                        style="width: 20px; height: 20px"
                        :src="require(`assets/img/icons/Goal.svg`)"
                      />
                      <span class="text-caption"
                        >{{ $t('objective') }}
                        {{ typeof j === 'string' ? k + 1 : j + 1 }}</span
                      >
                      <v-btn
                        class="primary--text"
                        rounded
                        x-small
                        color="white"
                        elevation="0"
                        @click="
                          () => {
                            dialogObjective = true
                            deleteAreaIndicatorId = item.areaIndicatorId
                            deleteObjectiveId = obj.objectiveId
                          }
                        "
                      >
                        <img
                          class="iconDrawer"
                          :src="require(`assets/img/icons/Delete.svg`)"
                        />
                      </v-btn>
                    </v-col>
                    <!--
                    <v-col v-if="item.indicatorDTO.dimensionalType" cols="12">
                      {{ item.indicatorDTO.dimensionalType.dimensionTypeName }}

                      {{
                        item.indicatorDTO.dimensionalType.dimensionValues.length
                          ? item.indicatorDTO.dimensionalType.dimensionValues.filter(
                              (i) =>
                                i.dimensionValueOrder ===
                                obj.quantitativeDimensionOrder
                            )[0].dimensionValueName
                          : null
                      }}
                    </v-col>
                    -->
                    <v-col cols="12" md="1">
                      <div>
                        <p class="text-right">
                          <span class="gray--text text-caption d-block">{{
                            $t('startValue')
                          }}</span>
                          <span class="text-body-2 darkGray--text">
                            {{ getStartValue(obj) }}
                            {{ getMeasurementUnit(item) }}
                          </span>
                        </p>
                        <p class="text-right">
                          <span class="gray--text text-caption d-block">{{
                            $t('endValue')
                          }}</span>
                          <span class="text-body-2 darkGray--text">
                            {{ getEndValue(obj) }}
                            {{ getMeasurementUnit(item) }}
                          </span>
                        </p>
                        <p class="text-right">
                          <span class="gray--text text-caption d-block">{{
                            $t('startDate')
                          }}</span>
                          <span class="text-body-2 darkGray--text">{{
                            formatDate(getStartDate(obj))
                          }}</span>
                        </p>
                        <p class="text-right">
                          <span class="gray--text text-caption d-block">{{
                            $t('endDate')
                          }}</span>
                          <span class="text-body-2 darkGray--text">{{
                            formatDate(getEndDate(obj))
                          }}</span>
                        </p>
                      </div>
                    </v-col>
                    <v-col cols="12" lg="auto">
                      <!-- CHAR -->
                      <!------------------------------------------------------->
                      <v-chart
                        :option="chartOption(obj, item.indicatorDTO)"
                        class="chart pl-4"
                      />
                      <!------------------------------------------------------->
                    </v-col>
                    <v-col cols="12" lg="">
                      <v-sheet
                        color="white"
                        class="pa-5 sheet-border samples-sheet-scroll"
                        rounded
                      >
                        <v-container>
                          <v-row no-gutters class="mb-2">
                            <v-col cols="3" class="gray--text text-caption">{{
                              $t('date')
                            }}</v-col>
                            <v-col
                              v-if="isObjectiveDimensional(obj)"
                              cols="4"
                              class="gray--text text-caption"
                            >
                              {{ $t('dimension') }}
                            </v-col>
                            <v-col cols="4" class="gray--text text-caption">{{
                              $t('value')
                            }}</v-col>
                          </v-row>
                          <v-row
                            v-for="sample in getSamples(obj)"
                            :key="`list-sample-${sample.sampleId}`"
                            no-gutters
                            class="mb-2"
                          >
                            <v-col
                              cols="3"
                              class="text-body-2 darkGray--text"
                              >{{
                                formatDate(sample.sampleDate.split('T')[0])
                              }}</v-col
                            >
                            <v-col
                              v-if="
                                getValue(sample, item.indicatorDTO).dimension
                              "
                              cols="4"
                              class="text-body-2 darkGray--text"
                              >{{
                                getValue(sample, item.indicatorDTO).dimension
                              }}</v-col
                            >
                            <v-col
                              v-if="sample.sampleType == 'QUALITATIVE'"
                              :cols="
                                getValue(sample, item.indicatorDTO).dimension
                                  ? '3'
                                  : '5'
                              "
                              class="text-body-2 darkGray--text"
                              >{{ getValue(sample).valuedata }}</v-col
                            >
                            <v-col
                              v-else
                              :cols="
                                getValue(sample, item.indicatorDTO).dimension
                                  ? '3'
                                  : '5'
                              "
                              class="text-body-2 darkGray--text"
                            >
                              {{ getValue(sample).value }}
                            </v-col>
                            <v-col cols="2" class="d-flex">
                              <v-btn
                                class="primary--text px-0"
                                x-small
                                color="white"
                                elevation="0"
                                :to="{
                                  name: 'area-samples-update',
                                  params: {
                                    plan: area.plan.planUUID,
                                    area: area.areaId,
                                    indicator: item.areaIndicatorId,
                                    id: sample.sampleId,
                                  },
                                }"
                              >
                                <img
                                  class="iconDrawer"
                                  :src="require(`assets/img/icons/Edit.svg`)"
                                />
                              </v-btn>
                              <v-btn
                                class="primary--text"
                                rounded
                                x-small
                                color="white"
                                elevation="0"
                                @click="
                                  () => {
                                    dialogSample = true
                                    deleteAreaIndicatorId = item.areaIndicatorId
                                    deleteSampleId = sample.sampleId
                                  }
                                "
                              >
                                <img
                                  class="iconDrawer"
                                  :src="require(`assets/img/icons/Delete.svg`)"
                              /></v-btn>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-sheet>
                    </v-col>
                    <!--
                    <v-col cols="auto" class="pr-0">
                      <v-btn
                        class="primary--text"
                        rounded
                        small
                        color="white"
                        elevation="0"
                        :to="{
                          name: 'area-objectives-update',
                          params: {
                            plan: area.plan.planUUID,
                            area: area.areaId,
                            indicator: item.areaIndicatorId,
                            objective: obj.objectiveId,
                          },
                        }"
                      >
                        <v-icon>mdi-pencil</v-icon></v-btn
                      >
                    </v-col>
                    -->
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
    <RemoveDialog
      v-model="dialogSample"
      :title="$t('deleteSample')"
      :text="$t('deleteSample')"
      :confirm="$t('deleteSample')"
      @delete="removeSample"
    ></RemoveDialog>
    <RemoveDialog
      v-model="dialogIndicator"
      :title="$t('deleteIndicatorTitle')"
      :text="$t('deleteIndicatorConfirmation')"
      :confirm="$t('deleteIndicatorTitle')"
      @delete="removeIndicator"
    ></RemoveDialog>
    <RemoveDialog
      v-model="dialogObjective"
      :title="$t('deleteObjectiveTitle')"
      :text="$t('deleteObjectiveConfirmation')"
      :confirm="$t('deleteGoal')"
      @delete="removeObjective"
    ></RemoveDialog>
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
      deleteAreaIndicatorId: null,
      deleteSampleId: null,
      deleteObjectiveId: null,
      dialogIndicator: null,
      dialogSample: null,
      dialogObjective: null,
      // impact: [],
      graphPanel: this.areaItem.areaIndicatorDTOs.map((i) => ({
        panel: null,
      })),
      imagePath: null,
      area,
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
    await this.getImage(this.area.plan.planUUID, this.area.areaId)
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
    if (this.init) this.componentKey += 1
  },

  methods: {
    getUsedDates(indicator) {
      const dates = []
      for (let i = 0; i < indicator.objectiveDTOs.length; ++i)
        dates.push({
          start: new Date(indicator.objectiveDTOs[i].startDate),
          end: new Date(indicator.objectiveDTOs[i].endDate),
        })
      return dates
    },
    formatDate(date) {
      const datePart = date.split('-')
      const year = datePart[0]
      const month = datePart[1]
      const day = datePart[2]

      return day + '-' + month + '-' + year
    },
    removeIndicator() {
      this.$emit('remove', {
        area: this.area,
        areaIndicatorId: this.deleteAreaIndicatorId,
      })
      this.dialogIndicator = false
      this.$emit('update')
    },

    removeSample() {
      this.$emit('remove-sample', {
        area: this.area,
        areaIndicatorId: this.deleteAreaIndicatorId,
        sampleId: this.deleteSampleId,
      })
      this.dialogSample = false
      this.$emit('update')
    },

    removeObjective() {
      this.$emit('remove-objective', {
        area: this.area,
        areaIndicatorId: this.deleteAreaIndicatorId,
        objectiveId: this.deleteObjectiveId,
      })
      this.dialogObjective = false
      this.$emit('update')
    },

    async getImage(planUUID, areaId) {
      try {
        const path = await this.$axios.$get(
          `/b2b/plans/${planUUID}/${areaId}/imagePath`
        )
        this.imagePath = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
      } catch (e) {
        console.log(e.response)
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
      if (obj.objectiveType === 'QUANTITATIVE') {
        return obj.startQuantitativeValue
      }

      if (obj.objectiveType === 'QUALITATIVE') {
        // return obj.startObjectiveValue.qualitativeWeight
        return obj.startObjectiveValue.qualitativeValue
      }

      return Math.min(...obj.map((a) => a.startQuantitativeValue))
    },

    getEndValue(obj) {
      if (obj.objectiveType === 'QUANTITATIVE') {
        return obj.endQuantitativeValue
      }

      if (obj.objectiveType === 'QUALITATIVE') {
        // return obj.endObjectiveValue.qualitativeWeight
        return obj.endObjectiveValue.qualitativeValue
      }

      return Math.max(...obj.map((a) => a.endQuantitativeValue))
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
          sampleDate: obj.sampleDate,
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
          sampleDate: obj.sampleDate,
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
          sampleDate: obj.sampleDate,
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
          .flatMap((i) =>
            i.samplesPerObjective.map((s) => ({
              ...s,
              objectiveId: i.objectiveId,
            }))
          )
          .sort((a, b) => new Date(a.sampleDate) - new Date(b.sampleDate))
      }
      return obj.samplesPerObjective
    },

    getObjectiveDTOs(obj) {
      if (obj.indicatorDTO.indicatorType === 'QUANTITATIVE_DIMENSIONAL') {
        return obj.objectiveDTOs.reduce((items, obj) => {
          const key = `${obj.startDate}:${obj.endDate}`
          const curr = items[key] ?? []
          return { ...items, [key]: [...curr, obj] }
        }, {})
      }
      return obj.objectiveDTOs
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
  },
}
</script>
<style lang="scss" scoped>
.chart {
  height: 400px;
  width: 600px;
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
body .custom-panel .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
