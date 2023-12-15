<template>
  <v-container :key="componentKey" fluid px-8 pt-8>
    <h1 class="blue--text text-h1 mb-2">{{ plan.planName }}</h1>
    <p class="text-body-2 blue--text">
      {{ $t('managePlan') }}
    </p>
    <div
      v-if="allAreas.length < 1"
      class="d-flex align-center justify-center text-center"
      style="height: 450px"
    >
      <div>
        <p>
          {{ $t('emptyPlan') }}
        </p>
        <v-btn
          small
          rounded
          elevation="0"
          color="primary"
          :to="{ name: 'area-add', params: { plan: plan.planUUID } }"
        >
          {{ $t('createArea') }}
        </v-btn>
      </div>
    </div>
    <div v-else>
      <plan-description-card :plan="plan" :impact="impact" />

      <v-container fluid pl-0 pr-0 pt-4 pb-3>
        <v-row no-gutters>
          <v-col cols="6" sm="6" align="left">
            <h2 class="blue--text text-h3 mb-0">
              {{ $t('areasIndicators') }}
            </h2>
          </v-col>
          <v-col cols="1" sm="6" align="right">
            <v-btn
              rounded
              elevation="0"
              color="primary"
              class="text-body-2"
              :to="{
                name: 'area-add',
                params: { plan: plan.planUUID },
              }"
            >
              <img
                style="width: 20px; height: 20px"
                class="mr-1"
                :src="require(`assets/img/icons/add-white.svg`)"
              />
              {{ $t('newArea') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <!-- areas list -->
      <v-list v-if="allAreas.length" color="transparent" class="pa-0">
        <v-list-item v-for="(item, i) in allAreas" :key="i" class="pa-0">
          <area-list-item
            :area-item="item"
            :impact="impact"
            @remove="remove"
            @remove-objective="removeObjective"
            @remove-sample="removeSample"
            @update="componentKey += 1"
          />
        </v-list-item>
      </v-list>
    </div>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import API_PLAN from '~/api/plans'
import APIAreas from '~/api/areas'
import API_LOGBOOK from '~/api/logbook'
export default {
  name: 'AreaList',
  middleware: ['asset-management-role'],

  async asyncData({ $axios, $auth, params, query }) {
    let plan = {}
    let impact = {}

    const id = params.plan || query.plan

    if (id) {
      try {
        plan = await API_PLAN.init($axios).get(id)
      } catch (e) {
        console.log(e.response)
      }

      try {
        impact = [] // await APIMa2030.init($axios).plansImpact([id])
      } catch (e) {
        console.log(e.response)
      }
    }

    let logbooks = []
    try {
      logbooks = await API_LOGBOOK.init($axios).getAreaLogbooks(
        $auth.user.loggedOrganizationUuid,
        id
      )
    } catch (e) {
      // console.log(e.response)
    }
    const allAreas = plan.areas || []

    for (let i = 0; i < allAreas.length; i++) {
      allAreas[i].logbook = null
      for (let j = 0; j < logbooks.length; ++j) {
        if (
          logbooks[j].logBookType === 'AREA' &&
          logbooks[j].planUUID === allAreas[i].plan.planUUID &&
          logbooks[j].areaId === allAreas[i].areaId
        ) {
          allAreas[i].logbook = logbooks[j]
          break
        }
      }
    }
    return {
      planUUID: id,
      allAreas,
      plan,
      impact,
      ok: null,
      overlay: false,
      componentKey: 0,
    }
  },
  beforeMount() {
    this.apiAreas = APIAreas.init(this.$axios, this.planUUID)
  },

  methods: {
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
