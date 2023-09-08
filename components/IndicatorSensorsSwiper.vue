<template>
  <div>
    <div v-swiper:mySwiper="settingsModified()">
      <div class="swiper-wrapper">
        <div v-for="item in sensors" :key="item.id" class="swiper-slide">
          <v-btn
            depressed
            height="160"
            width="160"
            color="white"
            class="mb-2 plain-shadow rounded-sm pa-0"
            :class="{ 'btn-selected raised-shadow': brandSelected === item.id }"
            @click="$emit('clicked', item.id)"
          >
            <v-img :src="item.image" contain width="160" height="auto" />
          </v-btn>
          <p
            class="text-h4 text-center"
            style="width: 160px; line-height: 20px"
            :class="{
              'primary--text': brandSelected === item.id,
              'blue--text': brandSelected !== item.id,
            }"
          >
            {{ item.title }}
          </p>
        </div>
      </div>
    </div>
    <div style="position: relative" class="arrows-position">
      <div
        v-show="$vuetify.breakpoint.mdAndUp"
        :class="'swiper-button-prev swiper-button-prev-brands'"
      ></div>
      <div
        v-show="$vuetify.breakpoint.mdAndUp"
        :class="'swiper-button-next swiper-button-next-brands'"
      ></div>
    </div>
    <div v-show="brandSelected" v-swiper2:mySwiper2="settingsModified2()">
      <div class="swiper-wrapper">
        <div v-for="item in sensorsSelect" :key="item.id" class="swiper-slide">
          <v-btn
            depressed
            height="160"
            width="160"
            color="white"
            class="mb-2 plain-shadow rounded-sm pa-0"
            :class="{ 'btn-selected raised-shadow': selected === item.id }"
            @click="$emit('clickedSensor', item.id)"
          >
            <v-img :src="item.image" contain width="160" height="auto" />
          </v-btn>
          <p
            class="text-h4 text-center"
            style="width: 160px; line-height: 20px"
            :class="{
              'primary--text': selected === item.id,
              'blue--text': selected !== item.id,
            }"
          >
            {{ item.title }}
          </p>
          <p
            style="width: 160px; line-height: 20px"
            class="text-body-2 text-center"
            :class="{
              'primary--text': selected === item.id,
              'blue--text': selected !== item.id,
            }"
          >
            {{ item.subtitle }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-show="brandSelected"
      style="position: relative"
      class="arrows-position"
    >
      <div
        v-show="$vuetify.breakpoint.mdAndUp"
        :class="'swiper-button-prev swiper-button-prev-sensors'"
      ></div>
      <div
        v-show="$vuetify.breakpoint.mdAndUp"
        :class="'swiper-button-next swiper-button-next-sensors'"
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
    swiper2: { ...directive },
  },
  props: {
    customArrowClass: {
      type: String,
      default: '',
    },
    sensors: {
      type: Array,
      default: null,
    },
    sensorsSelect: {
      type: Array,
      default: null,
    },
    selected: {
      type: String,
      default: null,
    },
    brandSelected: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    settings,
  }),

  methods: {
    settingsModified() {
      const settingsModified = { ...this.settings }
      settingsModified.navigation = {
        nextEl: '.swiper-button-next-brands',
        prevEl: '.swiper-button-prev-brands',
      }
      settingsModified.allowTouchMove = false
      return settingsModified
    },
    settingsModified2() {
      const settingsModified = { ...this.settings }
      settingsModified.navigation = {
        nextEl: '.swiper-button-next-sensors',
        prevEl: '.swiper-button-prev-sensors',
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
