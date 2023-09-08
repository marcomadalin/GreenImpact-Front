<template>
  <a
    :id="anchorTo ? anchorTo : null"
    class="text-decoration-none"
    @click="goTo(anchor)"
  >
    <v-container
      fluid
      :class="`white rounded-lg plain-shadow ${
        hover ? 'raised-shadow-hover' : ''
      } pa-0 text-right min-height-card`"
      style="position: relative"
    >
      <div
        class="white--text mb-0 text-body-2 blue rounded-lg text-left pa-3 rounded-bl-0 rounded-br-0"
      >
        <svg
          width="16px"
          height="16px"
          viewBox="0 0 24 24"
          class="icon-correction-margin mr-1"
        >
          <path
            fill="currentColor"
            d="M8 17q.425 0 .713-.288Q9 16.425 9 16t-.287-.713Q8.425 15 8 15t-.713.287Q7 15.575 7 16t.287.712Q7.575 17 8 17Zm0-4q.425 0 .713-.288Q9 12.425 9 12t-.287-.713Q8.425 11 8 11t-.713.287Q7 11.575 7 12t.287.712Q7.575 13 8 13Zm0-4q.425 0 .713-.288Q9 8.425 9 8t-.287-.713Q8.425 7 8 7t-.713.287Q7 7.575 7 8t.287.712Q7.575 9 8 9Zm3 8h6v-2h-6Zm0-4h6v-2h-6Zm0-4h6V7h-6ZM5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h14q.825 0 1.413.587Q21 4.175 21 5v14q0 .825-.587 1.413Q19.825 21 19 21Zm0-2h14V5H5v14ZM5 5v14V5Z"
          ></path>
        </svg>
        {{ $t('actionArea') }}
      </div>
      <v-img
        class="rounded-0 mt-0"
        height="155"
        :src="imagePath"
        style="
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        "
      >
        <v-avatar
          v-if="
            hasLogbook &&
            area &&
            area.logbook &&
            area.logbook.logBookEnabled &&
            area.logbook.folders[0].items.length > 0
          "
          color="white"
          class="mt-3 mr-3 pt-1"
        >
          <logbook-tooltip
            class="mt-1"
            :logbook="area.logbook"
            :area="area"
          ></logbook-tooltip>
        </v-avatar>
        <!-- fi llista de ODS afectats-->
      </v-img>
      <v-row no-gutters class="pa-5 text-left">
        <v-col align-self="start">
          <p class="blue--text mb-2 text-h3 plan-title mb-2">
            {{ title }}
          </p>
          <p v-if="startDate" class="blue--text mb-2">
            {{ formatDate(startDate) }} - {{ formatDate(endDate) }}
          </p>
          <p class="text-body-2 darkBlue--text mb-3 mt-1">
            {{ indicators }} {{ $t('indicators').toLowerCase() }}
          </p>
          <p v-if="description" class="darkBlue--text text-body-1 mb-3">
            {{ description }}
          </p>
          <div>
            <v-avatar
              v-for="item in ods"
              :key="item.levelN_ItemStrId"
              tile
              size="28"
              class="mr-1 mt-1"
            >
              <v-img
                :src="
                  require(`/assets/img/sdg/small/ico-ODS-${item.levelN_ItemId}.svg`)
                "
                width="28"
                height="28"
              />
            </v-avatar>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </a>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
    },
    hover: {
      type: Boolean,
      default: true,
    },
    indicators: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: null,
    },
    imagePathInfo: {
      type: String,
      default: null,
    },
    anchor: {
      type: String,
      default: null,
    },
    anchorTo: {
      type: String,
      default: null,
    },
    ods: {
      type: Array,
      default: () => [],
    },
    startDate: {
      type: String,
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
    area: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      imagePath: null,
      options: { duration: 300, offset: 70, easing: 'easeInOutCubic' },
    }
  },
  watch: {
    imagePathInfo: {
      immediate: true,
      handler(val, oldVal) {
        this.getImage(val)
      },
    },
  },
  methods: {
    formatDate(date) {
      const datePart = date.match(/\d+/g)
      const year = datePart[0]
      const month = datePart[1]
      const day = datePart[2]

      return day + '-' + month + '-' + year
    },
    getImage(imagePathInfo) {
      try {
        this.$axios
          .$get(`/b2b/plans/${imagePathInfo}/imagePath`)
          .then((path) => {
            this.imagePath = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
          })
      } catch (e) {
        console.log(e.response)
      }
    },
    goTo(anchor) {
      if (anchor) {
        this.$vuetify.goTo('#' + anchor, this.options)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.v-expansion-panel::before {
  box-shadow: none !important;
}
.ods-bottom {
  position: relative;
  bottom: -70px;
}
.plan-title {
  height: 50px;
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
.plan-description {
  height: 140px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  @supports (-webkit-line-clamp: 7) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial !important;
    display: -webkit-box;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
  }
}
/*.plan-description::before {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, white 50%);
    content: '\200C';
    display: block;
    position: absolute;
    right: 0;
    bottom: -9px;
    width: 100%;
    text-align: center;
  }*/
.ods-icon-abs {
  position: absolute;
  bottom: 0;
  right: 7px;
}
.ods-abs {
  position: absolute;
  bottom: -4px;
  left: 16px;
}
.bullets-pos {
  position: absolute;
  top: 164px;
  right: 20px;
}
.trend-bullet {
  position: absolute;
  top: 137px;
  right: 10px;
}
.ods-icon-abs i {
  width: 24px;
  height: 24px;
}
.min-height-card {
  min-height: 375px;
}
</style>
