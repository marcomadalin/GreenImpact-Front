<template>
  <div>
    <div v-swiper:mySwiper="settingsModified()">
      <div class="swiper-wrapper">
        <div
          v-for="area in areas"
          :key="customArrowClass + '-area-slide' + area.areaId"
          class="swiper-slide"
        >
          <area-action-card
            :area="area"
            :title="area.areaName"
            :indicators="
              area.areaIndicatorDTOs.filter(
                (i) => i.indicatorDTO.indicatorEnabled
              ).length
            "
            :image-path-info="area.plan.planUUID + '/' + area.areaId"
            :anchor="'anchor-' + area.areaId"
            :ods="getOds(area)"
          ></area-action-card>
        </div>
      </div>
    </div>
    <div style="position: relative" class="arrows-position">
      <div
        v-show="$vuetify.breakpoint.mdAndUp"
        :class="
          'swiper-button-prev swiper-button-prev-video-' + customArrowClass
        "
      ></div>
      <div
        v-show="$vuetify.breakpoint.mdAndUp"
        :class="
          'swiper-button-next swiper-button-next-video-' + customArrowClass
        "
      ></div>
    </div>
  </div>
</template>
<script>
import { directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import { settings } from '~/constants/sliderSettings.ts'

export default {
  directives: {
    swiper: directive,
  },
  props: {
    customArrowClass: {
      type: String,
      default: '',
    },
    areas: {
      type: Array,
      default: null,
    },
    impact: {
      type: Array,
      default: null,
    },
  },
  data: () => ({
    settings,
  }),

  methods: {
    settingsModified() {
      const settingsModified = Object.assign({}, this.settings)
      settingsModified.navigation = {
        nextEl: '.swiper-button-next-video-' + this.customArrowClass,
        prevEl: '.swiper-button-prev-video-' + this.customArrowClass,
      }
      return settingsModified
    },
    getType(video) {
      if (video.discipline) {
        return video.discipline.name
      } else {
        return null
      }
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
<style scoped>
@media (min-width: 992px) {
  .arrows-position {
    top: -187.5px !important;
  }
}
@media (min-width: 1440px) {
  .arrows-position {
    top: -187.5px !important;
  }
}
.swiper-slide {
  width: 310px;
}
</style>
