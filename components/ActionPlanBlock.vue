<template>
  <v-container
    fluid
    class="white rounded-lg raised-shadow-hover pa-0 text-right plain-shadow"
    style="position: relative"
  >
    <v-img
      class="rounded-lg pa-5"
      :aspect-ratio="6 / 1"
      height="180px"
      :src="imagePlan"
      style="
        border-bottom-left-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      "
      ><v-avatar
        v-if="
          hasLogbook &&
          plan &&
          plan.logbook &&
          plan.logbook.logBookEnabled &&
          plan.logbook.folders[0].items.length > 0
        "
        class="pt-1"
        color="white"
        style="margin-right: -10px; margin-top: -10px"
      >
        <logbook-tooltip :logbook="plan.logbook" :plan="plan"></logbook-tooltip>
      </v-avatar>
      <v-chip-group class="ods-abs pa-0">
        <v-row no-gutters>
          <v-col
            v-for="(item, i) in _impact1"
            :key="i"
            cols="auto"
            class="pr-1"
          >
            <div>
              <v-chip
                small
                :ripple="false"
                color="white"
                class="text-center d-flex justify-center pa-0 ma-0"
                style="height: 28px; width: 28px; border-radius: 0"
              >
                <span>
                  <v-img
                    :src="
                      require(`/assets/img/sdg/small/ico-ODS-${item.dtoReference.theOne.levelN_ItemId}.svg`)
                    "
                    width="28"
                    height="28"
                  />
                </span>
              </v-chip>
            </div>
          </v-col>
          <v-col v-if="_impact.length > 5" cols="auto" class="pr-1">
            <ODSTooltip :impact="_impact"> </ODSTooltip>
          </v-col>
        </v-row>
      </v-chip-group>
      <!-- fi llista de ODS afectats-->
    </v-img>
    <!--
    <div v-if="plan.snapshot" class="bullets-pos">
      <semaphore :value="plan.snapshot" />
    </div>
    -->
    <v-row v-if="plan" no-gutters class="pa-5 text-left">
      <v-col align-self="start">
        <p
          class="blue--text text-h3 plan-title mt-0 mb-0 pb-0 d-flex align-center"
        >
          {{ truncateText(plan.name, 37, '...') }}
        </p>
        <p class="mb-2 blue--text text-h5 mb-2">
          {{ formatDate(plan.startDate) }} -
          {{ formatDate(plan.endDate) }}
        </p>
        <p class="text-body-2 primary--text mb-4">
          {{ plan.areas.length + ' ' + $t('areas') + '' }} |
          {{
            new Set(plan.areas.map((i) => i.indicators.map((f) => f.id)).flat())
              .size
          }}
          {{ $t('indicators') }}
        </p>
        <!-- <v-divider class="mb-3"></v-divider>
        <p class="card-progressbar mb-4">
          <card-progress :value="plan.snapshot" />
        </p>
        -->
        <p
          v-if="showDescription"
          class="darkGray--text mb-4 text-body-1 plan-description mb-0"
        >
          {{ plan.description }}
        </p>
      </v-col>
      <v-col cols="12">
        <v-btn
          depressed
          lg
          color="lightGray"
          rounded
          class="text-body-2 primary--text"
          :to="{
            name: 'area-viewlist',
            params: { plan: plan.id },
          }"
        >
          {{ $t('seePlan') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    plan: {
      type: Object,
      default: () => {},
    },
    impact: {
      type: Array,
      default: () => [],
    },
    showDescription: {
      type: Boolean,
      default: () => true,
    },
  },

  data() {
    return {
      imagePlan: '',
    }
  },

  computed: {
    _impact() {
      return []
      // eslint-disable-next-line no-unreachable
      return this.impact.filter(
        (i) =>
          i.indicatorsConsidered.filter(
            (j) => j.area.plan.planUUID === this.plan.planUUID
          ).length
      )
    },
    _impact1() {
      return []
      // eslint-disable-next-line no-unreachable
      const res = this.impact.filter(
        (i) =>
          i.indicatorsConsidered.filter(
            (j) => j.area.plan.planUUID === this.plan.planUUID
          ).length
      )
      if (res.length > 5) return res.slice(0, 5)
      else return res
    },
  },

  async beforeMount() {
    await this.getImage(this.plan.id)
  },

  methods: {
    truncateText(text, length, suffix) {
      if (!text) {
        return
      }
      if (length < text.length) {
        return text.substring(0, length) + suffix
      } else {
        return text
      }
    },
    formatDate(date) {
      const datePart = date.match(/\d+/g)
      const year = datePart[0]
      const month = datePart[1]
      const day = datePart[2]

      return day + '-' + month + '-' + year
    },
    getImage(planId) {
      try {
        /*
        const path = await this.$axios.$get(`/b2b/plans/${planUUID}/imagePath`)
        this.imagePlan = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`

         */
      } catch (e) {
        console.log(e.response)
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
</style>
