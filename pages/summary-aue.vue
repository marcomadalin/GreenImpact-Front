<!-- eslint-disable prettier/prettier -->
<template>
  <v-container fluid px-8 pt-8>
    <h1 class="primary--text text-h1">{{ $t('aueSummary') }}</h1>
    <nuxt-link
      class="text-caption text-decoration-none"
      :to="{ name: 'summary' }"
      >{{ $t('seeMA2030Summary') }}</nuxt-link
    >
    <v-container fluid pl-0 pr-0 pt-4 pb-2>
      <v-row no-gutters> </v-row>
    </v-container>
    <v-container px-0 py-5>
      <v-row no-gutters>
        <v-col cols="6" class="pr-1">
          <v-row class="white rounded-lg pa-5" no-gutters>
            <v-col cols="auto">
              <v-list-item-avatar
                  height="100%"
                  width="100%"
                  max-width="75px"
                  max-height="75px"
                  class="my-0"
                >
                <v-img
                  :src="`/b2b/${$auth.user.loggedOrganizationUuid}/getImage`"
                  height="100"
                />
                </v-list-item-avatar>
              </v-col>
            <v-col>
              <p class="text-body-2 darkGray--text mb-2">
                {{ $t('sustainableEntity') }}:
              </p>
              <p class="text-h2 primary--text">
                {{
                  // $auth.user.userOrganizations[0].organization.organizationName
                  $auth.user.loggedOrganizationUuid
                }}
              </p>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" class="pl-1">
          <v-row class="white rounded-lg pa-5" no-gutters>
            <v-col class="text-center">
              <p class="text-caption darkGray--text mb-1">{{ $t('plansOnly') }}</p>
              <p class="text-h1 primary--text header-number mb-1">{{ plans.length}}</p>
              <nuxt-link
                class="text-caption text-decoration-none"
                :to="{ name: 'ActionPlanPage' }"
                >ver planes</nuxt-link
              >
            </v-col>
            <v-divider vertical></v-divider>
            <v-col class="text-center">
              <p class="text-caption darkGray--text mb-1">{{ $t('areas') }}</p>
              <p class="text-h1 primary--text header-number mb-1">{{ totalAreas }}</p>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col class="text-center">
              <p class="text-caption darkGray--text mb-1">
                {{ $t('indicators') }}
              </p>
              <p class="text-h1 primary--text header-number mb-1">{{ totalIndicators }}</p>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col class="text-center">
              <p class="text-caption darkGray--text mb-1">
                {{ $t('objectives') }}
              </p>
              <p class="text-h1 primary--text header-number mb-1">{{ totalObjectives }}</p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <!-- container ods stuff -->
    <v-container fluid px-8 pt-8>
    <div
      v-if="listplanimpact.length < 1"
      class="d-flex align-center justify-center text-center"
      style="height: 450px"
    >
      <div>
        <p>
          {{
            $t('noIndicators')
          }}
        </p>
        <v-btn
          small
          rounded
          elevation="0"
          color="primary"
          :to="{ name: 'plan-add' }"
        >
          {{ $t('createPlan') }}
        </v-btn>
      </div>
    </div>
    <div v-else>

      <v-container fluid pl-0 pr-0 pt-4 pb-2>
        <v-row no-gutters>
          <v-col cols="6" sm="6" align="left">
            <h2 class="primary--text text-h2">
              {{ $t('odsFollowup') }}
            </h2>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-row no-gutters style="height: 150px;">
          <v-col v-for="(item, i) in listplanimpact" :key="i" cols="1">
            <summary-ods-list :ods="item" />
          </v-col>
        </v-row>
      </v-container>

      <!-- areas list -->
      <v-list v-if="listplanimpact.length" color="transparent">
        <div v-for="(item, i) in listplanimpact" :key="i">
          <summary-list-item :ods="item" />
        </div>
      </v-list>

      <!-- ods impacted summary list -->
      <!--
      <v-list v-if="listplanimpact.length" color="transparent">
        <div v-for="(item, i) in listplanimpact" :key="i">
          <summary-ods-list :ods="item" />
        </div>
      </v-list>
      -->

    </div>
    <!--
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    -->
  </v-container>

  <!--
    <v-list v-if="listplanimpact.length" color="transparent">
        <v-list-item v-for="(item, i) in listplanimpact" :key="i">
        </v-list-item>
    </v-list>
  -->
  </v-container>
</template>

<script>
import API from '~/api/plans'
import API_AUE from '~/api/framework_aue'
export default {
  async asyncData({ $axios }) {
    const plans = {}
    const result = []
    let totalAreas = 0
    let totalIndicators = 0
    let totalObjectives = 0

    try {
      const plans = await API.init($axios).list()
      let i = 0
      let ii = 0
      let iii = 0
      let iv = 0

      while (i < plans.length) {
        result[i] = plans[i].planUUID
        // count areaDTs - areas
        while (ii < plans[i].areaDTOs.length) {
          // count areaIndicators - indicadores
          while (iii < plans[i].areaDTOs[ii].areaIndicatorDTOs.length) {
            while (
              iv <
              plans[i].areaDTOs[ii].areaIndicatorDTOs[iii].objectiveDTOs.length
            ) {
              iv++
            }
            iii++
          }
          ii++
        }
        i++
      }

      totalAreas = ii
      totalIndicators = iii
      totalObjectives = iv

      const listplanimpact = await API_AUE.init($axios).plansImpact(result)
      return {
        plans,
        listplanimpact,
        totalAreas,
        totalIndicators,
        totalObjectives,
      }
    } catch (e) {
      console.log(e.response)
    }
    return { plans }
  },
}
</script>

<style></style>
