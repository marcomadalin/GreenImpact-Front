<template>
  <div>
    <div v-swiper:mySwiper="settingsModified()">
      <div class="swiper-wrapper">
        <div v-for="item in sectors" :key="item.id" class="swiper-slide">
          <v-btn
            depressed
            height="160"
            width="160"
            color="white"
            class="mb-2 plain-shadow rounded-sm pa-0"
            :class="{ 'btn-selected raised-shadow': selected === item.id }"
            @click="$emit('clicked', item.id)"
          >
            <v-img :src="item.image" contain width="110" height="110" />
          </v-btn>
          <p
            class="text-h4 text-center"
            style="width: 160px; line-height: 20px"
            :class="{
              'primary--text': selected === item.id,
              'blue--text': selected !== item.id,
            }"
          >
            {{ $t(item.id) }}
          </p>
        </div>
      </div>
    </div>
    <div style="position: relative" class="arrows-position">
      <div
        v-show="$vuetify.breakpoint.mdAndUp"
        :class="
          'swiper-button-prev swiper-button-prev-sector-' + customArrowClass
        "
      ></div>
      <div
        v-show="$vuetify.breakpoint.mdAndUp"
        :class="
          'swiper-button-next swiper-button-next-sector-' + customArrowClass
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
    sectors: {
      type: Array,
      default: null,
    },
    selected: {
      type: String,
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
        nextEl: '.swiper-button-next-sector-' + this.customArrowClass,
        prevEl: '.swiper-button-prev-sector-' + this.customArrowClass,
      }
      settingsModified.allowTouchMove = false
      return settingsModified
    },
  },
}
</script>
<style scoped>
.btn-selected {
  border-bottom: 4px solid #3233c1 !important;
}
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
  width: 170px;
}
</style>
