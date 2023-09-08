<template>
  <v-container fluid px-8 pt-8>
    <!-- {{ items[0].planUUID }} -->
    <h1 class="blue--text text-h1 mb-2">{{ $t('plansOnly') }}</h1>
    <p class="text-body-2 blue--text">
      {{ $t('consultPlans') }}
    </p>

    <v-container fluid pl-0 pr-0 pt-4 pb-2 mb-4>
      <v-row no-gutters>
        <v-col cols="6" sm="6" align="left">
          <h2 class="primary--text text-h2"></h2>
        </v-col>
        <!--
        <v-col cols="1" sm="6" align="right">
          <v-btn
            small
            rounded
            text-lowercase
            elevation="0"
            color="primary"
            :to="{ name: 'plan-add' }"
          >
            <svg width="1.15em" height="1.15em" viewBox="0 0 24 24" pl-4>
              <path
                fill="currentColor"
                d="M12 17q.425 0 .713-.288Q13 16.425 13 16v-3h3.025q.425 0 .7-.288Q17 12.425 17 12t-.288-.713Q16.425 11 16 11h-3V7.975q0-.425-.287-.7Q12.425 7 12 7t-.712.287Q11 7.575 11 8v3H7.975q-.425 0-.7.287Q7 11.575 7 12t.287.712Q7.575 13 8 13h3v3.025q0 .425.288.7q.287.275.712.275Zm0 5q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z"
              ></path>
            </svg>
            {{ $t('Generar informe') }}
          </v-btn>
        </v-col>
        -->
      </v-row>
    </v-container>
    <!-- new design -->
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
import { statusEnum } from '~/constants'
import API from '~/api/plans'
import API_MA2030 from '~/api/framework_ma2030'
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
        console.log(e.response)
      }
      items = await API.init($axios).list()
      for (let i = 0; i < items.length; i++) {
        items[i].logbook = null
        planes[i] = items[i].planUUID
        for (let j = 0; j < logbooks.length; ++j) {
          if (
            logbooks[j].logBookType === 'PLAN' &&
            logbooks[j].planUUID === items[i].planUUID
          ) {
            items[i].logbook = logbooks[j]
            break
          }
        }
      }
      const impact = await API_MA2030.init($axios).plansImpact(planes)
      return { items, impact }
    } catch (e) {
      console.log(e.response)
    }
    return { items, impact }
  },

  computed: {
    statusEnum() {
      return statusEnum
    },
  },
}
</script>

<style></style>
