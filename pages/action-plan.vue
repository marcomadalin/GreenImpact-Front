<template>
  <v-container fluid px-8 pt-8>
    <h1 class="blue--text text-h1 mb-2">{{ $t('plansOnly') }}</h1>
    <p class="text-body-2 blue--text">
      {{ $t('consultPlans') }}
    </p>
    <v-row>
      <v-col
        v-for="(actionPlan, key) in items"
        :key="key"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <action-plan-block :plan="actionPlan" :impact="impact" class="mb-4" />
      </v-col>
    </v-row>
    <!-- end new design -->
  </v-container>
</template>

<script>
import API_PLANS from '~/api/plans'
import API_LOGBOOK from '~/api/logbook'
export default {
  async asyncData({ $axios, $auth }) {
    let items = []
    const impact = []
    const planes = []
    let logbooks = []
    try {
      try {
        logbooks = await API_LOGBOOK.init($axios).getPlanLogbooks(
          $auth.user.loggedOrganizationUuid
        )
      } catch (e) {
        logbooks = []
        // console.log(e.response)
      }
      items = await API_PLANS.init($axios).list(
        $auth.user.loggedOrganization.id
      )
      for (let i = 0; i < items.length; i++) {
        items[i].logbook = null
        planes[i] = items[i].id
        impact.push([])
        for (let j = 0; j < logbooks.length; ++j) {
          if (
            logbooks[j].logBookType === 'PLAN' &&
            logbooks[j].planId === items[i].id
          ) {
            items[i].logbook = logbooks[j]
            break
          }
        }
      }
      //  const impact = await API_MA2030.init($axios).plansImpact(planes)
      return { items, impact }
    } catch (e) {
      console.log(e.response)
    }
    return { items, impact }
  },
}
</script>

<style></style>
