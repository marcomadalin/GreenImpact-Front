<template>
  <v-container rounded class="px-0 white rounded-lg mx-0 plain-shadow">
    <v-container class="pt-0 mt-0 px-5">
      <v-row class="py-2 d-flex align-center">
        <img
          class="iconDrawer"
          :src="
            upToDate
              ? indicators.length > 0
                ? require(`assets/img/icons/Indicators-uptodate.svg`)
                : require(`assets/img/icons/no-indicadores.svg`)
              : indicators.length > 0
              ? require(`assets/img/icons/Indicators-risk.svg`)
              : require(`assets/img/icons/no-indicadores.svg`)
          "
        />
        <p class="text-body-2 blue--text my-0 py-0 ml-4">
          {{ upToDate ? $t('goodIndicators') : $t('riskIndicators') }}
        </p>
      </v-row>
    </v-container>
    <v-container id="background">
      <h1
        v-if="indicators.length > 0"
        id="textColor"
        style="
          font-family: Lexend !important;
          font-size: 44px !important;
          font-weight: 500 !important;
        "
        class="ml-2 percentage"
      >
        {{ Math.round((indicators.length / totalIndicators) * 100).toString()
        }}<span style="font-size: 30px !important">%</span>
      </h1>
      <h1
        v-else
        id="textColor"
        style="
          font-family: Lexend !important;
          font-size: 44px !important;
          font-weight: 500 !important;
        "
        class="ml-2"
      >
        0<span style="font-size: 30px !important">%</span>
      </h1>
      <p
        v-if="indicators.length === 0 && !upToDate"
        id="textColor"
        class="text-body-1 mx-2 mb-0 pb-0 font-weight-bold"
      >
        {{ $t('indicatorReviewSubNone') }}
      </p>
      <p
        v-if="indicators.length === 0 && !upToDate"
        id="textColor"
        class="text-body-1 mx-2 mt-0 pt-0"
      >
        {{ $t('indicatorReviewSubNone2') }}
      </p>
      <p
        v-if="indicators.length === 0 && upToDate"
        id="textColor"
        class="text-body-1 mx-2 mb-0 pb-0 font-weight-bold"
      >
        {{ $t('indicatorReviewSubNone3') }}
      </p>
      <p
        v-if="indicators.length === 0 && upToDate"
        id="textColor"
        class="text-body-1 mx-2 mt-0 pt-0"
      >
        {{ $t('indicatorReviewSubNone4') }}
      </p>
      <p v-if="indicators.length > 0" id="textColor" class="text-body-1 mx-2">
        {{ $t('indicatorReviewSub') + ' (' }}
        <span class="font-weight-bold">{{ indicators.length }}</span>
        {{ '/ ' + totalIndicators + ' )' }}
      </p>
    </v-container>
    <v-container v-if="indicators.length !== 0" id="scroll" class="pb-0">
      <v-virtual-scroll
        :items="
          indicators.slice(0, indicators.length < 5 ? indicators.length : 5)
        "
        :item-height="90"
        height="300"
      >
        <template #default="{ item, index }">
          <v-list-item>
            <v-list-item-content class="mb-2">
              <p class="text--body-2" style="color: #060632; font-size: 14px">
                <!--<span style="color: #838399">{{ '2.3.44' + ' | ' }}</span> -->
                {{ truncateString(item.indicatorDTO.indicatorName) }}
              </p>
              <v-row class="my-2 px-3">
                <v-card
                  width="28px"
                  height="28px"
                  rounded="0"
                  flat
                  :ripple="false"
                  class="pa-0"
                  style="margin-right: 5px"
                >
                  <v-img
                    :src="require('~/assets/img/indicators/ind-ico-ODS.png')"
                    aspect-ratio="1"
                    height="100%"
                    weight="100%"
                  />
                </v-card>
                <v-card
                  v-for="(impact, i) in getIndicatorImpact(item.indicatorUUID)"
                  :key="i"
                  width="28px"
                  height="28px"
                  rounded="0"
                  flat
                  :ripple="false"
                  class="pa-0"
                  style="margin-right: 5px"
                >
                  <v-img
                    :src="
                      require(`/assets/img/sdg/small/ico-ODS-${impact}.svg`)
                    "
                    aspect-ratio="1"
                    height="100%"
                    weight="100%"
                  />
                </v-card>
              </v-row>
              <v-divider
                v-if="
                  index <
                  indicators.slice(
                    0,
                    indicators.length < 5 ? indicators.length : 5
                  ).length -
                    1
                "
                class="mt-1"
              ></v-divider>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-container>
    <v-container class="text-right">
      <v-btn
        id="indicatorButton"
        depressed
        lg
        color="lightGray"
        rounded
        class="text-body-2 primary--text"
        :disabled="indicators.length === 0"
        :to="
          upToDate
            ? { name: 'indicators-uptodate' }
            : { name: 'indicators-at-risk' }
        "
      >
        {{ upToDate ? $t('seeOkIndicators') : $t('seeBadIndicators') }}
      </v-btn>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'IndicatorReview',
  props: {
    upToDate: {
      type: Boolean,
      default: () => false,
    },
    indicators: {
      type: Array,
      default: () => [],
    },
    totalIndicators: {
      type: Number,
      default: () => 0,
    },
    listplanimpact: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      backgroundColor:
        this.indicators.length === 0
          ? '#e6e6eb'
          : this.upToDate
          ? '#e7f8f0'
          : '#fee0e8',
      textColor:
        this.indicators.length === 0
          ? '#060632'
          : this.upToDate
          ? '#12bb6a'
          : '#f8003b',
    }
  },
  methods: {
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
  },
}
</script>

<style lang="scss">
#background {
  background: v-bind(backgroundColor);
}
#textColor {
  color: v-bind(textColor);
}

#scroll {
  box-shadow: inset 0 -10px 15px -7px rgba(0, 0, 0, 0.05);
}
#indicatorButton:disabled {
  background: #bb1313 !important;
  color: #bb1b1b !important;
}
#indicatorButton.v-btn.v-btn--disabled.v-btn--has-bg.v-btn--rounded.v-btn--router.theme--light.v-size--small {
  background: #f7f7f8 !important;
}
#indicatorButton.v-btn.v-btn--disabled.v-btn--has-bg.v-btn--rounded.v-btn--router.theme--light.v-size--small
  .v-btn__content {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #c7c7c7;
}
#percentage {
  font-family: 'Lexend' !important;
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 44px !important;
  line-height: 55px !important;
}
</style>
