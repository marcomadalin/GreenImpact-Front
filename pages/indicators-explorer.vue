<template>
  <v-container fluid px-8 pt-8>
    <h1 class="blue--text text-h1 mb-10">
      {{ $t('exploreIndicators') }}
    </h1>
    <v-tabs
      v-model="tab"
      icons-and-text
      background-color="white"
      grow
      height="76"
      slider-color="primary"
      color="primary"
      style="max-width: 700px"
    >
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab
        v-for="(item, key) in tabItems"
        :key="item.key"
        class="text-body-2"
        :class="{ 'primary--text': tab === key, 'gray--text': tab !== key }"
        style="text-transform: none"
        @click="
          item.key === 'custom' ? setIndicator('custom') : setIndicator(null)
        "
      >
        {{ $t(item.key) }}
        <v-img
          :src="item.img"
          max-width="22px"
          height="auto"
          max-height="22px"
          contain
          :style="
            key !== tab
              ? 'filter: grayscale(1); -webkit-transform: translateZ(0); -webkit-backface-visibility: hidden;'
              : ''
          "
        ></v-img>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="transparent">
      <v-tab-item key="marco">
        <div class="mt-5">
          <div class="d-flex mb-8">
            <div
              v-for="item in availableIndicators"
              :key="item.key"
              class="pr-5"
            >
              <v-btn
                depressed
                height="160"
                width="160"
                color="white"
                class="mb-2 plain-shadow rounded-sm"
                :class="{ 'btn-selected raised-shadow': selected === item.key }"
                @click="setIndicator(item.key)"
              >
                <v-img :src="item.image" contain width="110" height="110" />
              </v-btn>
              <p
                class="text-h4 text-center"
                style="width: 160px; line-height: 20px"
                :class="{
                  'primary--text': selected === item.key,
                  'blue--text': selected !== item.key,
                }"
              >
                {{ item.title }}
              </p>
            </div>
          </div>
        </div>
      </v-tab-item>
      <v-tab-item key="sector">
        <div class="mt-5">
          <indicator-sector-swiper
            :sectors="sectors"
            :selected="selected"
            @clicked="setIndicator"
          ></indicator-sector-swiper>
        </div>
      </v-tab-item>
      <v-tab-item key="sensor">
        <div class="mt-5">
          <indicator-sensors-swiper
            :sensors="sensors"
            :sensors-select="sensorsSelect"
            :selected="selected"
            :brand-selected="brandSelected"
            @clicked="
              brandSelected = $event
              setIndicator(null)
            "
            @clickedSensor="setIndicator"
          ></indicator-sensors-swiper>
        </div>
      </v-tab-item>
      <v-tab-item key="app">
        <div class="mt-5">
          <indicator-app-swiper
            :apps="apps"
            :selected="selected"
            @clicked="setIndicator"
          ></indicator-app-swiper>
        </div>
      </v-tab-item>
      <v-tab-item key="custom">
        <div class="mt-5">
          <v-text-field
            v-model="search"
            filled
            background-color="transparent"
            height="56"
            style="max-width: 300px"
            :label="$t('searchByKeyword')"
            prepend-inner-icon="mdi-magnify"
            color="primary"
            @input="filterByName"
          ></v-text-field>
          <v-row
            v-if="indicatorLevelList && indicatorLevelList.length"
            no-gutters
            class="mx-n3 transparent"
          >
            <v-col
              v-for="(item, index) in indicatorLevelListSearch"
              :key="`${indicatorLevel}-${index}`"
              cols="6"
              class="py-4 px-3"
            >
              <indicator-explorer-block
                :indicator="item"
                :selected-indicator="
                  selectedIndicator.length
                    ? selectedIndicator[indicatorLevel - 1]
                    : null
                "
                :image="customIndicator.image"
              ></indicator-explorer-block>
            </v-col>
          </v-row>
        </div>
      </v-tab-item>
    </v-tabs-items>
    <v-row v-if="selected && selected !== 'custom' && tab !== 2">
      <v-col v-if="selected === 'feder'" cols="4">
        <v-select
          v-model="federSelected"
          filled
          background-color="white"
          height="56"
          :placeholder="$t('Filtra por tipo de feder')"
          :items="federOptions"
          :disabled="federOptions.length < 1"
          item-value="frameworkId"
          item-text="frameworkName"
          class="rounded-md"
        >
        </v-select>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="indicatorLevel"
          filled
          background-color="white"
          height="56"
          :placeholder="placeholder"
          :items="selectedIndicator"
          :disabled="
            (selected === 'feder' && federOptions.length < 1) ||
            selectedIndicator.length < 1 ||
            (selected !== 'feder' && selectedIndicator.length < 1)
          "
          item-value="levelN_ItemId"
          item-text="levelN_ItemName"
          class="rounded-md"
        >
          <template #item="{ item }">
            <v-img
              v-if="selected === 'ma2030'"
              :src="
                require('~/assets/img/sdg/small/ico-ODS-' +
                  item.levelN_ItemId +
                  '.svg')
              "
              width="28px"
              max-width="28px"
              height="28px"
              aspect-ratio="1"
              class="mr-2"
            ></v-img>
            <v-img
              v-if="selected === 'aue'"
              :src="
                require('~/assets/img/indicators/aue/AUE-obj-estr-' +
                  item.levelN_ItemStrId +
                  '.svg')
              "
              width="28px"
              max-width="28px"
              height="28px"
              aspect-ratio="1"
              class="mr-2"
            ></v-img>
            <span class="text-body-1 darkGray--text">
              <span v-if="selected === 'feder'"
                >{{ item.levelN_ItemId }}.
              </span>
              {{ item.levelN_ItemName }}
            </span>
          </template>
          <template #selection="{ item }">
            <v-img
              v-if="selected === 'ma2030'"
              :src="
                require('~/assets/img/sdg/small/ico-ODS-' +
                  item.levelN_ItemId +
                  '.svg')
              "
              width="28px"
              max-width="28px"
              height="28px"
              aspect-ratio="1"
              class="mr-2"
            ></v-img>
            <v-img
              v-if="selected === 'aue'"
              :src="
                require('~/assets/img/indicators/aue/AUE-obj-estr-' +
                  item.levelN_ItemStrId +
                  '.svg')
              "
              width="28px"
              max-width="28px"
              height="28px"
              aspect-ratio="1"
              class="mr-2"
            ></v-img>
            <span class="text-body-1 darkGray--text text-truncate">
              <span v-if="selected === 'feder'"
                >{{ item.levelN_ItemId }}.
              </span>
              {{ item.levelN_ItemName }}
            </span>
          </template>
        </v-select>
      </v-col>
      <v-col v-if="indicatorLevel" cols="auto">
        <v-text-field
          v-model="search"
          filled
          background-color="transparent"
          height="56"
          style="max-width: 300px"
          :label="$t('searchByKeyword')"
          prepend-inner-icon="mdi-magnify"
          color="primary"
          @input="filterByName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row
      v-if="
        selected &&
        indicatorLevelList &&
        indicatorLevelList.length &&
        selected !== 'custom'
      "
      no-gutters
      class="mx-n3 transparent"
    >
      <v-col
        v-for="(item, index) in indicatorLevelListSearch"
        :key="`${indicatorLevel}-${index}`"
        cols="6"
        class="py-4 px-3"
      >
        <indicator-explorer-block
          :indicator="item"
          :selected-indicator="
            selectedIndicator.length
              ? selectedIndicator[indicatorLevel - 1]
              : null
          "
          :levels="[getIndicatorImage(item)]"
          :image="getIndicatorTypeImage(item)"
        ></indicator-explorer-block>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import API from '~/api/areas'
import { ma2030, aue, feder, custom } from '~/api/indicatorsSources'
import IndicatorAppSwiper from '~/components/IndicatorAppSwiper.vue'
import IndicatorExplorerBlock from '~/components/IndicatorExplorerBlock.vue'
import IndicatorSensorsSwiper from '~/components/IndicatorSensorsSwiper.vue'
import IndicatorSectorSwiper from '~/components/IndicatorSectorSwiper.vue'
export default {
  name: 'AreaIndicator',
  components: {
    IndicatorSensorsSwiper,
    IndicatorExplorerBlock,
    IndicatorAppSwiper,
    IndicatorSectorSwiper,
  },

  asyncData({ $axios, query, i18n }) {
    const tabItems = [
      {
        name: i18n.t('Por marco'),
        img: require('~/assets/img/indicators/Ind-Marco.svg'),
        key: 'marco',
      },
      {
        name: i18n.t('Por sector'),
        img: require('~/assets/img/indicators/Ind-Vertical.svg'),
        key: 'sector',
      },
      {
        name: i18n.t('Por sensor'),
        img: require('~/assets/img/indicators/Ind-Sensor.svg'),
        key: 'sensor',
      },
      {
        name: i18n.t('Por aplicación'),
        img: require('~/assets/img/indicators/Ind-Application.svg'),
        key: 'app',
      },
      {
        name: i18n.t('Personalizados'),
        img: require('~/assets/img/indicators/Ind-Custom.svg'),
        key: 'custom',
      },
    ]

    const sectors = [
      {
        title: i18n.t('Administración pública'),
        id: 'adm_public',
        image: require('~/assets/img/indicators/sectors/vertical-public.png'),
      },
      {
        title: i18n.t('Retail'),
        id: 'retail',
        image: require('~/assets/img/indicators/sectors/vertical-retail.png'),
      },
      {
        title: i18n.t('Salud'),
        id: 'health',
        image: require('~/assets/img/indicators/sectors/vertical-healthcare.png'),
      },
      {
        title: i18n.t('Centro de procesamiento de datos'),
        id: 'datacenter',
        image: require('~/assets/img/indicators/sectors/vertical-datacenter.png'),
      },
      {
        title: i18n.t('Supply chain'),
        id: 'supplychain',
        image: require('~/assets/img/indicators/sectors/vertical-supplychain.png'),
      },
      {
        title: i18n.t('Real estate'),
        id: 'realestate',
        image: require('~/assets/img/indicators/sectors/vertical-realestate.png'),
      },
      {
        title: i18n.t('Farmacéuticas'),
        id: 'pharma',
        image: require('~/assets/img/indicators/sectors/vertical-pharma.png'),
      },
      {
        title: i18n.t('Banca y seguros'),
        id: 'banking',
        image: require('~/assets/img/indicators/sectors/vertical-banking.png'),
      },
    ]

    const sensors = [
      {
        title: i18n.t('Cisco Meraki'),
        id: 'cisco_meraki',
        image: require('~/assets/img/indicators/sensors/sensor-cisco.png'),
      },
      {
        title: i18n.t('Bosch'),
        id: 'bosch',
        image: require('~/assets/img/indicators/sensors/sensor-bosch.png'),
      },
      {
        title: i18n.t('Amazon Web Services'),
        id: 'aws',
        image: require('~/assets/img/indicators/sensors/sensor-aws.png'),
      },
      {
        title: i18n.t('Schneider Electric'),
        id: 'schneider',
        image: require('~/assets/img/indicators/sensors/sensor-schneider.png'),
      },
    ]

    const sensorsSelect = [
      {
        title: i18n.t('Meraki MT10'),
        subtitle: i18n.t('Sensor de temperatura y humedad'),
        id: 'meraki_mt10',
        image: require('~/assets/img/indicators/sensors/sensor-cisco-mt14.png'),
      },
      {
        title: i18n.t('Meraki MT14'),
        subtitle: i18n.t('Sensor de calidad de aire ambiental'),
        id: 'meraki_mt14',
        image: require('~/assets/img/indicators/sensors/sensor-cisco-mt14.png'),
      },
    ]

    const apps = [
      {
        title: i18n.t('Factorial'),
        id: 'factorial',
        image: require('~/assets/img/indicators/apps/app-factorial.png'),
      },
      {
        title: i18n.t('Holded'),
        id: 'holded',
        image: require('~/assets/img/indicators/apps/app-holded.png'),
      },
    ]

    const indicators = {
      ma2030: {
        id: 'B2B_MA2030',
        title: i18n.t('ODS / Agenda 2030'),
        image: require('~/assets/img/indicators/ind-ico-ODS.png'),
        list: [],
      },
      aue: {
        id: 'B2B_AUE',
        title: i18n.t('Agenda Urbana Española'),
        image: require('~/assets/img/indicators/ind-ico-AUE.png'),
        list: [],
      },
      feder: {
        id: 'B2B_AUE_FIISE',
        title: i18n.t('FEDER'),
        image: require('~/assets/img/indicators/logo-ue.png'),
        list: [],
      },
    }

    const customIndicator = {
      id: 'B2B_BASE',
      title: i18n.t('customIndicators'),
      image: require('~/assets/img/indicators/ind_custom.png'),
      list: [],
    }

    return {
      levels: [],
      indicators,
      tabItems,
      sectors,
      selected: null,
      federSelected: null,
      federOptions: [],
      placeholder: 'Filtra por ODS',
      indicatorLevel: null,
      indicatorLevelList: null,
      ok: null,
      overlay: false,
      tab: 'marco',
      sensors,
      sensorsSelect,
      apps,
      customIndicator,
      brandSelected: null,
      search: '',
    }
  },

  computed: {
    availableIndicators() {
      if (!this.indicators) {
        return []
      }

      return Object.keys(this.indicators).map((i) => {
        return {
          key: i,
          title: this.indicators[i].title,
          image: this.indicators[i].image,
          id: this.indicators[i].id,
        }
      })
    },

    selectedIndicator() {
      const notCustom =
        this.sectors.find((sector) => sector.id === this.selected) ||
        this.sensorsSelect.find((sensor) => sensor.id === this.selected) ||
        this.apps.find((app) => app.id === this.selected)
      if (this.selected === 'custom') {
        return this.customIndicator.list.subLevels || []
      } else if (notCustom) {
        return this.indicators.aue.list.subLevels || []
      }
      if (this.selected && this.indicators[this.selected].list) {
        if (this.federSelected === 4) {
          return this.federOptions[1].subLevels || []
        }
        return this.indicators[this.selected].list.subLevels || []
      }
      return []
    },
  },

  watch: {
    async indicatorLevel(value) {
      await this.fetchIndicatorLevelList(value)
    },
    federSelected() {
      this.indicatorLevel = null
      this.indicatorLevel = null
      this.indicatorLevelList = null
      this.indicatorLevelListSearch = null
      this.search = ''
    },
  },

  beforeMount() {
    this.apiIndicators = {
      ma2030: ma2030.init(this.$axios),
      aue: aue.init(this.$axios),
      feder: feder.init(this.$axios),
      custom: custom.init(this.$axios),
    }

    this.api = API.init(this.$axios, this.planUUID)
  },

  methods: {
    getIndicatorImage(item) {
      const indicator = this.selectedIndicator[this.indicatorLevel - 1]
      if (indicator.frameworkId === 1) {
        return require('~/assets/img/indicators/aue/AUE-obj-estr-' +
          indicator.levelN_ItemStrId +
          '.svg')
      } else if (indicator.frameworkId === 2) {
        return require(`/assets/img/sdg/small/ico-ODS-${indicator.levelN_ItemId}.svg`)
      }
    },
    getIndicatorTypeImage(item) {
      if (item.frameworkId === 1) {
        return this.indicators.aue.image
      } else if (item.frameworkId === 2) {
        return this.indicators.ma2030.image
      } else if (item.frameworkId === 3 || item.frameworkId === 4) {
        return this.indicators.feder.image
      }
    },
    filterByName() {
      this.indicatorLevelListSearch = []
      if (this.search === '') {
        this.indicatorLevelListSearch = this.indicatorLevelList.slice(
          0,
          this.indicatorLevelList.length
        )
      } else {
        const searchText = this.search.toLowerCase()
        for (let i = 0; i < this.indicatorLevelList.length; i++) {
          const name =
            this.indicatorLevelList[i].indicatorDTO.indicatorName.toLowerCase()
          if (name.includes(searchText)) {
            this.indicatorLevelListSearch.push(this.indicatorLevelList[i])
          }
        }
      }
    },
    async setIndicator(indicator) {
      this.selected = indicator
      this.indicatorLevel = null
      this.indicatorLevelList = null
      this.indicatorLevelListSearch = null
      this.federSelected = null
      this.search = ''

      if (!indicator) {
        return
      }
      const notCustom =
        this.sectors.find((sector) => sector.id === indicator) ||
        this.sensorsSelect.find((sensor) => sensor.id === indicator) ||
        this.apps.find((app) => app.id === indicator)

      if (this.tab === 2) {
        this.indicatorLevel = 1
      }
      if (indicator === 'ma2030') {
        this.placeholder = this.$t('filterODS')
      } else if (indicator === 'aue') {
        this.placeholder = this.$t('filterGoal')
      } else if (indicator === 'feder') {
        this.placeholder = this.$t('filterFeder')
      } else if (this.sectors.find((sector) => sector.id === indicator)) {
        this.placeholder = this.$t('filterSector')
      } else if (this.apps.find((sector) => sector.id === indicator)) {
        this.placeholder = this.$t('filterApps')
      }

      if (indicator === 'custom') {
        try {
          this.indicatorLevelList = (
            await this.apiIndicators[this.selected].list()
          )
            .flat()
            .map((i) => ({ indicatorDTO: i, indicatorUUID: i.indicatorUUID }))
          this.indicatorLevelListSearch = this.indicatorLevelList.slice(
            0,
            this.indicatorLevelList.length
          )
        } catch (e) {
          console.log(e.response)
        }
      } else if (notCustom) {
        if (indicator === 'meraki_mt14') {
          this.indicatorLevel = 2
          await this.fetchIndicator('ma2030')
        } else {
          await this.fetchIndicator('aue')
        }
      } else {
        await this.fetchIndicator(indicator)
      }
    },

    async fetchIndicatorLevelList(level) {
      let selected = this.selected
      const notCustom =
        this.sectors.find((sector) => sector.id === this.selected) ||
        this.sensorsSelect.find((sensor) => sensor.id === this.selected) ||
        this.apps.find((app) => app.id === this.selected)
      if (notCustom) {
        selected = 'aue'
      }
      try {
        this.indicatorLevelList = await this.apiIndicators[
          selected
        ].getIndicators(level)
        this.indicatorLevelListSearch = this.indicatorLevelList.slice(
          0,
          this.indicatorLevelList.length
        )
        // FALTA API Y PROBAR
        /*
        const indicatorUUIDS = this.indicatorLevelList.map((item) => {
          return item.indicatorUUID
        })

        const indicatorInfo = await common
          .init(this.$axios)
          .getInfoIndicators(indicatorUUIDS)
        indicatorInfo.forEach((item) => {
          const images = []
          item.frameworks.forEach((framework) => {
            images.push(
              framework.subLevels.flatMap((indicator) => {
                if (indicator.frameworkId === 1) {
                  return require('~/assets/img/indicators/aue/AUE-obj-estr-' +
                    indicator.levelN_ItemStrId +
                    '.svg')
                } else if (indicator.frameworkId === 2) {
                  return require(`/assets/img/sdg/small/ico-ODS-${indicator.levelN_ItemId}.svg`)
                }
                return []
              })
            )
          })
          this.levels.push({ indicatorUUID: item.indicatorUUID, images })
        }) */
      } catch (e) {
        console.log(e.response)
      }
    },

    async addIndicator({ indicatorUUID }) {
      const payload = {
        areaId: this.area.areaId,
        areaIndicatorName: this.area.areaName,
        areaIndicatorRecurrenceValue: '1',
        areaIndicatorRecurrenceTimeframe: 'MONTH',
        areaIndicatorStatus: 'PENDING_APPROVAL',
        indicatorUUID,
        objectiveDTOs: null,
        sampleDTOs: null,
      }

      try {
        await this.api.addIndicator(this.area.areaId, payload)
      } catch (e) {
        console.log(e.response)
      }
    },

    /*
    async save() {
      this.overlay = true

      const removedDTOs = this.area.areaIndicatorDTOs
        .filter((i) => {
          return !this.selectedODS.includes(i.indicatorUUID)
        })
        .map((i) => i.areaIndicatorId)

      try {
        await Promise.all(
          removedDTOs.map((i) => this.api.deleteIndicator(this.area.areaId, i))
        )
      } catch (e) {
        console.log(e.response)
      }

      const currentDTOs = this.area.areaIndicatorDTOs.map(
        (i) => i.indicatorUUID
      )
      const addedDTOs = this.selectedODS.filter((j) => !currentDTOs.includes(j))

      const indicatorsHandler = addedDTOs.map((i) => {
        return this.api.addIndicator(this.area.areaId, {
          areaId: this.area.areaId,
          areaIndicatorName: this.area.areaName,
          areaIndicatorRecurrenceValue: '1',
          areaIndicatorRecurrenceTimeframe: 'MONTH',
          areaIndicatorStatus: 'PENDING_APPROVAL',
          indicatorUUID: i,
          objectiveDTOs: null,
          sampleDTOs: null,
        })
      })

      try {
        await Promise.all(indicatorsHandler)
      } catch (e) {
        console.log(e.response)
      }

      this.overlay = false
      this.indicatorLevelList = {}
      this.ok = true
      this.$router.push({
        name: 'area-list',
        params: { plan: this.planUUID },
      })
    },
    */

    async fetchIndicator(indicator) {
      // empty list after fill it
      this.indicators[indicator].list = []

      if (
        Object.keys(this.apiIndicators).includes(indicator) &&
        this.indicators[indicator].list.length < 1
      ) {
        try {
          this.indicators[indicator].list = await this.apiIndicators[
            indicator
          ].list()
          if (indicator === 'feder') {
            const secondaryFramework =
              await this.apiIndicators.feder.secondaryIdsIndicators(4)
            if (this.federOptions.length < 1) {
              this.federOptions = [
                this.indicators.feder.list,
                secondaryFramework,
              ]
            }
            this.federSelected = this.indicators.feder.list.frameworkId
          }
        } catch (e) {
          console.log(e.response)
          this.indicators[indicator].list = []
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-selected {
  border-bottom: 4px solid #3233c1 !important;
}
.text-truncate {
  width: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
