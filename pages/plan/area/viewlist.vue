<template>
  <v-container fluid px-8 pt-8>
    <h1 class="blue--text text-h1 mb-6">{{ plan.name }}</h1>
    <div
      v-if="allAreas.length < 1"
      class="d-flex align-center justify-center text-center"
      style="height: 450px"
    >
      <div>
        <p>
          {{ $t('emptyPlan') }}
        </p>
      </div>
    </div>
    <div v-else>
      <plan-description-view-card
        v-if="plan"
        :plan="plan"
        :impact="impact"
        class="mb-8"
      />
      <h2 v-if="allAreas.length > 1" class="blue--text text-h3 mb-5">
        {{ $t('planActionAreas') }}
      </h2>
      <area-action-slider
        v-if="allAreas.length > 1"
        :areas="allAreas"
        :impact="impact"
      ></area-action-slider>
      <v-container fluid pl-0 pr-0 pt-4 pb-3>
        <v-row no-gutters>
          <v-col cols="6" sm="6" align="left">
            <h2 class="blue--text text-h3 mb-0">
              {{ $t('areasIndicators') }}
            </h2>
          </v-col>
        </v-row>
      </v-container>

      <!-- areas list -->
      <v-list v-if="allAreas.length" color="transparent" class="pa-0">
        <v-list-item v-for="(item, i) in allAreas" :key="i" class="pa-0">
          <area-list-view-item
            :id="'area-' + item.id"
            :area-item="item"
            :impact="impact"
            @remove="remove"
            @remove-objective="removeObjective"
            @remove-sample="removeSample"
          />
        </v-list-item>
      </v-list>
    </div>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-btn
      v-show="showGoToTop"
      v-scroll="onScroll"
      class="md-5 mr-3 elevation-21"
      dark
      fab
      button
      right
      bottom
      color="white"
      fixed
      @click="
        $vuetify.goTo('#app', {
          duration: 300,
          offset: 70,
          easing: 'easeInOutCubic',
        })
      "
    >
      <v-icon color="primary">mdi-arrow-up</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import API_PLANS from '~/api/plans'
import APIAreas from '~/api/areas'
import APIMa2030 from '~/api/framework_ma2030'
import API_LOGBOOK from '~/api/logbook'
export default {
  name: 'AreaViewList',
  async asyncData({ $axios, $auth, params, query }) {
    let plan = {}
    let impact = {}
    const allAreas = []

    const id = params.plan || query.plan

    if (id) {
      try {
        plan = await API_PLANS.init($axios).get(id)
      } catch (e) {
        console.log(e.response)
      }

      try {
        impact = await APIMa2030.init($axios).plansImpact([id])
      } catch (e) {
        impact = []
        // console.log(e.response)
      }

      let logbooks = []
      try {
        logbooks = await API_LOGBOOK.init($axios).getPlanLogbooks(
          $auth.user.loggedOrganizationUuid
        )
      } catch (e) {
        // console.log(e.response)
      }
      plan.logbook = null
      for (let j = 0; j < logbooks.length; ++j) {
        if (
          logbooks[j].logBookType === 'PLAN' &&
          logbooks[j].planUUID === plan.planUUID
        ) {
          plan.logbook = logbooks[j]
          break
        }
      }
      let logbooksAreas = []
      try {
        logbooksAreas = await API_LOGBOOK.init($axios).getAreaLogbooks(
          $auth.user.loggedOrganizationUuid,
          id
        )
      } catch (e) {
        // console.log(e.response)
      }

      for (let i = 0; i < plan.areas.length; ++i) {
        allAreas.push(plan.areas[i])
        allAreas[i].logbook = null
        for (let j = 0; j < logbooksAreas.length; ++j) {
          if (
            logbooksAreas[j].logBookType === 'AREA' &&
            logbooksAreas[j].planId === allAreas[i].plan.id &&
            logbooksAreas[j].areaId === allAreas[i].id
          ) {
            allAreas[i].logbook = logbooksAreas[j]
            break
          }
        }
      }
      console.log(allAreas)
    }
    return {
      planUUID: id,
      plan,
      impact,
      ok: null,
      overlay: false,
      allAreas,
    }
  },
  data() {
    return {
      offsetTop: 0,
    }
  },

  computed: {
    showGoToTop() {
      return this.offsetTop > 200
    },
  },

  beforeMount() {
    this.apiAreas = APIAreas.init(this.$axios, this.planUUID)
  },

  mounted() {
    if (this.$route.params.area) {
      setTimeout(
        () =>
          document
            .getElementById('area-' + this.$route.params.area)
            .scrollIntoView({ behavior: 'smooth' }),
        500
      )
    }
  },

  methods: {
    onScroll(e) {
      this.offsetTop = event.target.scrollingElement.scrollTop
    },

    reloadPage() {
      this.$router.app.refresh()
    },

    async remove({ area, areaIndicatorId }) {
      this.overlay = true
      try {
        await this.apiAreas.deleteIndicator(area.id, areaIndicatorId)
        this.overlay = false
        this.reloadPage()
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },

    async removeObjective({ area, areaIndicatorId, objectiveId }) {
      this.overlay = true
      try {
        await this.apiAreas.removeIndicatorObjective(
          area.id,
          areaIndicatorId,
          objectiveId
        )
        this.overlay = false
        this.reloadPage()
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },

    async removeSample({ area, areaIndicatorId, sampleId }) {
      this.overlay = true
      try {
        await this.apiAreas.removeIndicatorSample(
          area.id,
          areaIndicatorId,
          sampleId
        )
        this.overlay = false
        this.reloadPage()
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },
  },
}
</script>
