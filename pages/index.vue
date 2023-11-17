<!-- eslint-disable prettier/prettier -->
<template>
  <v-container fluid pb-5 pt-8 px-8>
    <h1 class="blue--text text-h1 mb-6">
      {{ $t('ma2030Summary') }}
    </h1>
    <!--
    <nuxt-link
      class="text-caption text-decoration-none"
      :to="{ name: 'summary-aue' }"
      >Ver resumen ejecutivo para la Agenda Urbana Española (AUE)</nuxt-link
    >
    -->
    <v-container fluid pb-5 pt-0 px-0>
      <v-row no-gutters>
        <v-col class="pb-4" lg="6" md="9" sm="12" xl="6">
          <v-row
            class="white rounded-lg pa-5 mb-0 plain-shadow"
            fluid
            no-gutters
          >
            <v-col cols="auto ">
              <v-list-item-avatar
                class="my-0"
                height="100%"
                max-height="75px"
                max-width="75px"
                width="100%"
              >
                <v-img :src="entityImage" />
              </v-list-item-avatar>
            </v-col>
            <v-col>
              <p
                class="text-body-2 darkBlue--text mb-2"
                style="color: #011d89 !important"
              >
                {{ $t('sustainableEntity') }}
              </p>
              <p class="text-h2 blue--text" style="height: 40px">
                {{ orgName }}
              </p>
            </v-col>
          </v-row>
          <v-col
            v-if="listplanimpact.length > 0"
            class="white rounded-lg plain-shadow"
            no-gutters
            style="height: 405px; margin-top: 20px; margin-bottom: 20px"
          >
            <v-chart :key="chartKey" :option="pie" />
          </v-col>
          <v-col
            v-else
            class="white rounded-lg mt-4 justify-center align-center d-flex"
            no-gutters
          >
            <p
              class="text-body-2 d-flex align-center text-center"
              style="height: 100px"
            >
              {{ $t('noDataPie') }}
            </p>
          </v-col>
        </v-col>
        <v-col class="ml-0" lg="6" md="3" sm="0" xl="6">
          <v-row no-gutters>
            <v-col class="mb-3" style="margin-left: 20px; margin-bottom: 20px">
              <IndicatorReview
                :indicators="upToDateIndicators"
                :listplanimpact="listplanimpact"
                :total-indicators="allIndicators.length"
                :up-to-date="true"
              />
            </v-col>
            <v-col style="margin-left: 20px; margin-bottom: 20px">
              <IndicatorReview
                :indicators="riskIndicators"
                :listplanimpact="listplanimpact"
                :total-indicators="allIndicators.length"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid pt-0 px-0>
      <div
        v-if="listplanimpact.length < 1 || items.length < 1"
        class="d-flex align-center justify-center text-center"
        style="height: 450px"
      >
        <v-container class="px-0 pt-0 mt-0 pb-7" fluid>
          <div v-if="items.length < 1">
            <div>
              <p class="text-body-2">
                {{ $t('noPlans') }}
              </p>
            </div>
            <div v-if="isAdminRole || isEditorRole || isSuperAdminRole">
              <v-btn
                :to="{ name: 'plan-add' }"
                class="mt-10"
                color="primary"
                elevation="0"
                rounded
                small
              >
                {{ $t('createPlan') }}
              </v-btn>
            </div>
          </div>
          <div v-else>
            <p class="text-body-2">
              {{ $t('noIndicators') }}
            </p>
          </div>
        </v-container>
      </div>
      <div v-else>
        <v-container class="px-0 pt-0 mt-0 pb-7" fluid>
          <v-row no-gutters>
            <v-col align="left" cols="6" sm="6">
              <h2 class="blue--text text-h2">
                {{ $t('odsAffected') }}
              </h2>
            </v-col>
          </v-row>
          <v-slide-group
            v-model="odsSelected"
            active-class="success"
            class="pa-0 d-flex align-center"
            mandatory
            style="margin-left: -10px"
          >
            <v-slide-item
              v-for="(item, i) in listplanimpact"
              :key="i"
              v-slot="{ active, toggle }"
            >
              <v-col cols="auto" style="cursor: pointer" @click="toggle">
                <summary-ods-list :ods="item" :selected="active" />
              </v-col>
            </v-slide-item>
          </v-slide-group>
          <v-expand-transition>
            <div v-if="odsSelected != null" class="ml-10">
              <h3 class="blue--text text-h3 mb-5 ml-1">
                {{
                  $t('indicatorSDGHeading') +
                  ' ' +
                  listplanimpact[odsSelected].dtoReference.theOne.levelN_ItemId
                }}
              </h3>
              <v-row
                v-for="(item, i) in odsIndicators"
                :key="i"
                class="rounded-lg my-4 px-0 py-0 ml-1"
                style="margin-top: 4px !important"
              >
                <indicator-block
                  :impact="getIndicatorImpact(item.indicatorUUID)"
                  :indicator="item"
                  :show="true"
                />
              </v-row>
            </div>
          </v-expand-transition>
        </v-container>
      </div>
    </v-container>
    <v-container v-if="items.length > 0" class="mx-0" fluid>
      <h2 class="blue--text text-h2 mb-5">
        {{ $t('entityPlans') }}
      </h2>
      <v-row fluid>
        <v-col
          v-for="(actionPlan, key) in items.slice(0, Math.min(items.length, 4))"
          :key="key"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <action-plan-block
            :impact="impact"
            :plan="actionPlan"
            :show-description="false"
            class="mb-4"
            style="box-shadow: none !important"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import IndicatorReview from '~/components/IndicatorReview.vue'
import API_USERS from '~/api/users'
import API_MA2030 from '~/api/framework_ma2030'
import API from '~/api/plans'

use([
  CanvasRenderer,
  PieChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])
export default {
  components: { IndicatorReview, VChart },
  provide: {
    [THEME_KEY]: 'light',
  },
  async asyncData({ $axios }) {
    const plans = {}
    let listplanimpact = []
    const items = []
    let impact = []
    const planes = []
    const allIndicators = []
    let upToDateIndicators = []
    let riskIndicators = []
    let pie = {}
    try {
      const plans = await API.init($axios).list()

      for (let i = 0; i < plans.length; i++) items.push(plans[i])

      const result = plans.map((i) => i.planUUID)

      const totalAreas = plans.flatMap((i) =>
        i.areaDTOs.map((j) => j.areaId)
      ).length

      const totalIndicators = plans.flatMap((i) =>
        i.areaDTOs.flatMap((j) =>
          j.areaIndicatorDTOs.map((k) => k.indicatorUUID)
        )
      ).length

      const totalObjectives = plans.flatMap((i) =>
        i.areaDTOs.flatMap((j) =>
          j.areaIndicatorDTOs.flatMap((k) =>
            k.objectiveDTOs.map((l) => l.objectiveId)
          )
        )
      ).length

      try {
        listplanimpact = await API_MA2030.init($axios).plansImpact(result)
      } catch (e) {
        console.log(e.response)
      }

      for (let i = 0; i < Math.min(items.length, 4); i++) {
        planes[i] = items[i].planUUID
      }
      impact = listplanimpact

      for (const p of plans) {
        for (const a of p.areaDTOs) {
          for (const i of a.areaIndicatorDTOs) {
            allIndicators.push(i)
          }
        }
      }

      upToDateIndicators = allIndicators.filter((i) => i.status === 'GREEN')
      riskIndicators = allIndicators.filter((i) => i.status === 'RED')

      const sdgColors = [
        '#ff0000',
        '#d3a029',
        '#279b48',
        '#c31f33',
        '#ef402b',
        '#00aed9',
        '#fdb713',
        '#8f1838',
        '#f36d25',
        '#e11484',
        '#f99d26',
        '#cf8d2a',
        '#48773e',
        '#007dbc',
        '#3eb049',
        '#02558b',
        '#183668',
      ]

      pie = {
        stillShowZeroSum: false,
        tooltip: {
          trigger: 'item',
        },
        legend: {
          bottom: '10%',
          right: '10%',
          orient: 'vertical',
        },
        series: [
          {
            tooltip: {
              valueFormatter: (value) => value + ' %',
            },
            animation: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 8,
            },
            center: ['45%', '50%'],
            type: 'pie',
            radius: ['50%', '90%'],
            avoidLabelOverlap: true,
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: [],
            color: [],
          },
        ],
      }

      let totalIndicatorsImpact = 0

      for (let i = 0; i < listplanimpact.length; ++i)
        totalIndicatorsImpact += listplanimpact[i].indicatorsConsidered.length

      for (let i = 0; i < listplanimpact.length; ++i) {
        const num =
          (listplanimpact[i].indicatorsConsidered.length /
            totalIndicatorsImpact) *
          100
        const data = { value: '', name: '' }
        data.value = Math.round(num * 100) / 100
        data.name =
          listplanimpact[i].dtoReference.theOne.levelN_ItemStrId
            .replace('-', ' ')
            .split(' ')[0] +
          ' ' +
          listplanimpact[i].dtoReference.theOne.levelN_ItemId
        /* data.name = listplanimpact[i].dtoReference.theOne.levelN_ItemName

            if (data.name.length >= 50)
              data.name = data.name.split('').slice(0, 45).join('') + '...'

             */
        pie.series[0].data.push(data)
        pie.series[0].color.push(
          sdgColors[listplanimpact[i].dtoReference.theOne.levelN_ItemId - 1]
        )
      }
      if (pie.series[0].data.length > 13) {
        pie.series[0].center = ['35%', '50%']
        pie.legend = {
          bottom: '10%',
          right: '5%',
          orient: 'vertical',
        }
      }

      return {
        pie,
        allIndicators,
        upToDateIndicators,
        riskIndicators,
        plans,
        listplanimpact,
        totalAreas,
        totalIndicators,
        totalObjectives,
        items,
        impact,
      }
    } catch (e) {
      console.log(e.response)
    }
    return {
      pie,
      plans,
      items,
      impact,
      allIndicators,
      upToDateIndicators,
      riskIndicators,
    }
  },
  data() {
    return {
      chartKey: 0,
      entityImage: null,
      orgName: null,
      odsSelected: 0,
      chartUpdated: false,
    }
  },
  computed: {
    odsIndicators() {
      return this.listplanimpact[this.odsSelected].indicatorsConsidered
    },
  },
  created() {
    window.addEventListener('resize', () => {
      this.chartKey++
    })
  },
  async beforeMount() {
    await this.getImage()
    await this.getOrgName()
  },
  mounted() {
    this.updateComponentSize()
    window.addEventListener('resize', this.updateComponentSize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateComponentSize)
  },
  methods: {
    updateComponentSize() {
      if (this.pie.series[0].data.length > 13 && window.innerWidth > 1680) {
        this.pie.series[0].center = ['45%', '50%']
        this.pie.legend = {
          bottom: '10%',
          right: '10%',
          orient: 'vertical',
        }
        this.chartKey += 1
        this.chartUpdated = true
      } else if (this.chartUpdated && this.pie.series[0].data.length > 13) {
        this.pie.series[0].center = ['35%', '50%']
        this.pie.legend = {
          bottom: '10%',
          right: '5%',
          orient: 'vertical',
        }
        this.chartKey += 1
        this.chartUpdated = false
      }
    },
    getIndicatorAreas(indicatorUUID) {},
    truncateString(data) {
      if (data.length < 50) return data
      else return data.split('').slice(0, 45).join('') + '...'
    },
    getIndicatorImpact(indicatorUUID) {
      const impact = []
      for (let i = 0; i < this.listplanimpact.length; i++) {
        const ods = this.listplanimpact[i]
        for (let j = 0; j < ods.indicatorsConsidered.length; j++) {
          const indicator = ods.indicatorsConsidered[j]
          if (indicator.indicatorUUID === indicatorUUID) {
            impact.push(ods.dtoReference.theOne.levelN_ItemId)
            break
          }
        }
      }
      return impact
    },
    getIndicatorType(type) {
      const parts = type.toLowerCase().split('_')
      let result = ''
      if (parts.length > 1)
        result =
          parts[0] + parts[1].charAt(0).toUpperCase() + parts[1].substring(1)
      else result = parts[0]
      return this.$t(result)
    },
    async getImage() {
      try {
        const orgUUID = this.$auth.user.loggedOrganizationUuid
        const path = await this.$axios.$get(`/b2b/${orgUUID}/getImagePath`)
        this.entityImage = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
      } catch (e) {
        console.log(e.response)
      }
    },
    async getOrgName() {
      try {
        const organizations = await API_USERS.init(
          this.$axios,
          this.$auth.user.loggedOrganizationUuid
        ).getOrganizations()
        for (let i = 0; i < organizations.length; i++) {
          if (
            this.$auth.user.loggedOrganizationUuid ===
            organizations[i].organization.organizationUUID
          ) {
            this.orgName = organizations[i].organization.organizationName
            break
          }
        }
      } catch (e) {
        console.log(e.response)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.header-number {
  font-size: 36px !important;
}

#indicatorHeader {
  background: #e8e4ec;
  height: 40px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  align-items: center;
}

#indicatorIcons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

#planblock {
  box-shadow: none !important;
}
</style>
