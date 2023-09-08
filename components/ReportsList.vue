<template>
  <v-container fluid class="pa-0 text-right" style="position: relative">
    <v-img
      class="rounded-lg pa-5"
      :aspect-ratio="6 / 1"
      height="180px"
      :src="imagePlan"
    >
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
    <v-row v-if="plan" no-gutters class="text-left">
      <v-col align-self="start">
        <p
          class="blue--text text-h3 plan-title mt-0 mb-0 pb-0 d-flex align-center"
        >
          {{ truncateText(plan.planName, 37, '...') }}
        </p>
        <p class="mb-2 blue--text text-h5 mb-3 mt-0 pt-0">
          {{ plan.planStartDate.substring(0, 4) }} -
          {{ plan.planEndDate.substring(0, 4) }}
        </p>
      </v-col>
      <v-col cols="12">
        <!-- filtered by framework -->
        <v-btn
          block
          depressed
          lg
          rounded
          :loading="loading1"
          :disabled="loading1"
          class="text-h4 primary--text mb-2 justify-start"
          color="white"
          @click.prevent="report_standard(plan.planUUID), (loader = 'loading1')"
        >
          <img
            class="iconDrawer mr-3"
            :src="require(`assets/img/icons/reports.svg`)"
          />
          {{ $t('standard') }}
        </v-btn>
        <v-btn
          v-if="$auth.user.productAcronyms.includes('B2B_AUE')"
          block
          depressed
          lg
          rounded
          :loading="loading2"
          :disabled="loading2"
          class="text-h4 primary--text mb-2 justify-start"
          color="white"
          @click.prevent="report_aue(plan.planUUID), (loader = 'loading2')"
        >
          <v-img
            :src="require('~/assets/img/indicators/ind-ico-AUE.png')"
            max-width="24"
            height="24"
            class="mr-3"
          ></v-img>
          Agenda Urbana Española
        </v-btn>
        <v-btn
          v-if="$auth.user.productAcronyms.includes('B2B_MA2030')"
          block
          depressed
          lg
          rounded
          :loading="loading3"
          :disabled="loading3"
          class="text-h4 primary--text mb-2 justify-start"
          color="white"
          @click.prevent="
            report_agenda2030(plan.planUUID), (loader = 'loading3')
          "
        >
          <v-img
            :src="require('~/assets/img/indicators/ind-ico-ODS.png')"
            max-width="24"
            height="24"
            class="mr-3"
          ></v-img>
          {{ $t('Agenda2030') }}
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
  },

  data() {
    return {
      tooManyODS: false,
      imagePlan: '',
      loader: null,
      loading1: false,
      loading2: false,
      loading3: false,
    }
  },

  computed: {
    _impact() {
      return this.impact.filter(
        (i) =>
          i.indicatorsConsidered.filter(
            (j) => j.area.plan.planUUID === this.plan.planUUID
          ).length
      )
    },
    _impact1() {
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
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 5000)

      this.loader = null
    },
  },

  async beforeMount() {
    await this.getImage(this.plan.planUUID)
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
    async getImage(planUUID) {
      try {
        const path = await this.$axios.$get(`/b2b/plans/${planUUID}/imagePath`)
        this.imagePlan = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
      } catch (e) {
        console.log(e.response)
      }
    },
    async report_standard(planUUID) {
      await this.$axios({
        url: `/b2b/reporting/standard/${planUUID}`,
        method: 'GET',
        responseType: 'blob',
      }).then((res) => {
        const FILE = window.URL.createObjectURL(new Blob([res.data]))

        const docUrl = document.createElement('a')
        docUrl.href = FILE
        docUrl.setAttribute('download', 'report_std.pdf')
        document.body.appendChild(docUrl)
        docUrl.click()
      })
    },
    async report_aue(planUUID) {
      await this.$axios({
        url: `/b2b/reporting/aue/${planUUID}`,
        method: 'GET',
        responseType: 'blob',
      }).then((res) => {
        const FILE = window.URL.createObjectURL(new Blob([res.data]))

        const docUrl = document.createElement('a')
        docUrl.href = FILE
        docUrl.setAttribute('download', 'report_aue.pdf')
        document.body.appendChild(docUrl)
        docUrl.click()
      })
    },
    async report_agenda2030(planUUID) {
      await this.$axios({
        url: `/b2b/reporting/ma2030/${planUUID}`,
        method: 'GET',
        responseType: 'blob',
      }).then((res) => {
        const FILE = window.URL.createObjectURL(new Blob([res.data]))

        const docUrl = document.createElement('a')
        docUrl.href = FILE
        docUrl.setAttribute('download', 'report_a2030.pdf')
        document.body.appendChild(docUrl)
        docUrl.click()
      })
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
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
