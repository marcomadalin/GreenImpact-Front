<template>
  <div
    style="width: 100% !important; border-radius: 13px"
    class="white plain-shadow"
  >
    <v-col class="px-0 pt-0 mr-0" cols="12">
      <div id="indicatorHeader" class="mb-0 px-4 text-caption blue--text">
        <img
          class="iconIndicator"
          :src="require(`assets/img/icons/indicators.svg`)"
        />
        <span class="blue--text text-body-2 mb-0 pb-0 mr-auto">
          {{ $t('indicator') }}
        </span>
      </div>
      <div class="px-4">
        <span class="gray--text text-caption mb-0 mr-auto">
          {{ $t('plan') + ':' }}
          <a
            class="text-decoration-underline primary--text"
            @click="
              $router.push({
                name: 'area-viewlist',
                params: { plan: indicator.area.plan.planUUID },
              })
            "
          >
            {{ indicator.area.plan.planName }}
          </a>
          &nbsp;|&nbsp;
        </span>
        <span class="gray--text text-caption mb-0 mr-auto">
          {{ $t('area') + ':' }}
          <a
            class="text-decoration-underline primary--text"
            @click="
              $router.push({
                name: 'area-viewlist',
                params: {
                  plan: indicator.area.plan.planUUID,
                  area: indicator.area.areaId,
                },
              })
            "
          >
            {{ indicator.area.areaName }}
          </a>
        </span>
      </div>
      <v-container
        fluid
        class="white lighten-5 text-body-1 darkBlue--text px-4 mt-1 mb-0 pb-2 mt-0 pt-2"
      >
        <p class="text--body-2 mb-2" style="color: #060632">
          {{ indicator.indicatorDTO.indicatorName }}
        </p>
      </v-container>
      <v-container fluid class="white lighten-5 my-0 py-0 px-4">
        <v-row no-gutters style="height: 30px" class="mt-0 pt-0">
          <v-col>
            <div class="text-caption secondary--text">
              <div class="text-caption secondary--text">
                <status-progress-bar :value="indicator"></status-progress-bar>
              </div>
            </div>
          </v-col>
          <v-spacer v-if="show"></v-spacer>
          <v-col v-if="show" cols="auto" class="px-4">
            <v-row id="indicatorIcons">
              <p class="mr-3 gray--text text-caption my-0">
                {{ getIndicatorType(indicator.indicatorDTO.indicatorType) }}
              </p>
              <v-card
                v-for="(imp, j) in impact"
                :key="j"
                index
                width="28px"
                height="28px"
                rounded="0"
                flat
                :ripple="false"
                class="pa-0 mr-2"
              >
                <v-img
                  :src="require(`/assets/img/sdg/small/ico-ODS-${imp}.svg`)"
                  aspect-ratio="1"
                  height="100%"
                  weight="100%"
                />
              </v-card>
              <v-card
                width="28px"
                height="28px"
                rounded="0"
                flat
                :ripple="false"
                class="pa-0"
              >
                <v-img
                  :src="require('~/assets/img/indicators/ind-ico-ODS.png')"
                  aspect-ratio="1"
                  height="100%"
                  weight="100%"
                />
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </div>
</template>
<script>
import StatusProgressBar from '~/components/StatusProgressBar.vue'

export default {
  components: { StatusProgressBar },
  props: {
    indicator: {
      type: Object,
      default: () => {},
    },
    show: {
      type: Boolean,
      default: () => true,
    },
    impact: {
      type: Array,
      default: () => [],
    },
    semaphore: {
      type: String,
      default: () => 'RED',
    },
  },
  methods: {
    getIndicatorType(type) {
      const parts = type.toLowerCase().split('_')
      let result = ''
      if (parts.length > 1)
        result =
          parts[0] + parts[1].charAt(0).toUpperCase() + parts[1].substring(1)
      else result = parts[0]
      return this.$t(result)
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
  height: 46px;
  border-top-right-radius: 13px;
  border-top-left-radius: 13px;
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
.full-width-div {
  position: absolute;
  width: 100%;
  left: 0;
}
.iconIndicator {
  width: 18px;
  height: 18px;
}
</style>
