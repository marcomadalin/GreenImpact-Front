<template>
  <v-container fluid px-8 pt-8>
    <h1 class="blue--text text-h1 mb-3">{{ $t('managementPanel') }}</h1>
    <p class="text-body-2 blue--text">
      {{ $t('entityPlan') }}
    </p>

    <v-container fluid pl-0 pr-0 pt-4 pb-2>
      <v-row no-gutters>
        <v-col cols="6" sm="6" align="left">
          <h2 class="blue--text text-h2">{{ $t('planList') }}</h2>
        </v-col>
        <v-col cols="1" sm="6" align="right">
          <v-btn
            rounded
            text-lowercase
            elevation="0"
            color="primary"
            class="text-body-2"
            :to="{ name: 'plan-add' }"
          >
            <img
              style="width: 20px; height: 20px"
              class="mr-1"
              :src="require(`assets/img/icons/add-white.svg`)"
            />
            {{ $t('newPlan') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-list v-if="items.length" color="transparent">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        class="rounded-sm mb-2 white px-0"
      >
        <v-container fluid class="pl-0 py-0">
          <v-fade-transition mode="out-in">
            <v-row no-gutters>
              <v-col cols="auto" class="pr-6">
                <v-card flat style="border-radius: 12px 0px 0px 12px">
                  <v-img
                    :src="imagePlan[item.planUUID]"
                    style="border-radius: 12px 0px 0px 12px"
                    aspect-ratio="1"
                    width="110"
                    height="auto"
                  />
                </v-card>
              </v-col>
              <v-col class="py-4">
                <v-row no-gutters>
                  <v-col lg="3" md="3" class="d-flex justify-start">
                    <div class="ml-0 mr-2">
                      <p class="grey--text mb-0 text-caption">
                        {{ $t('planName') }}
                      </p>
                      <p class="body-2 darkGray--text">{{ item.name }}</p>
                    </div>
                  </v-col>
                  <!-- v-col>
                <p class="grey--text mb-0 text-caption">
                  {{ $t('Áreas activas') }}
                </p>
                <p class="body-2">
                  {{
                    item.areaDTOs.filter(
                      (i) => i.areaStatus === statusEnum.APPROVED.value
                    ).length
                  }}
                </p>
              </v-col -->
                  <v-col>
                    <p class="grey--text mb-0 text-caption">
                      {{ $t('totalAreas') }}
                    </p>
                    <p class="body-2 darkGray--text">
                      {{ item.areas.length }}
                    </p>
                  </v-col>
                  <v-col>
                    <p class="grey--text mb-0 text-caption">
                      {{ $t('indicators') }}
                    </p>
                    <p class="body-2 darkGray--text">
                      {{
                        new Set(
                          item.areas
                            .map((i) => i.indicators.map((f) => f.id))
                            .flat()
                        ).size
                      }}
                    </p>
                  </v-col>
                  <v-col>
                    <p class="grey--text mb-0 text-caption">
                      {{ $t('startDate') }}
                    </p>
                    <p class="body-2 darkGray--text">
                      {{ formatDate(item.startDate) }}
                    </p>
                  </v-col>
                  <v-col>
                    <p class="grey--text mb-0 text-caption">
                      {{ $t('endDate') }}
                    </p>
                    <p class="body-2 darkGray--text">
                      {{ formatDate(item.endDate) }}
                    </p>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="auto">
                    <v-btn
                      color="lightGray"
                      class="text-body-2 primary--text mr-3"
                      rounded
                      small
                      elevation="0"
                      :to="{
                        name: 'area-list',
                        params: { plan: item.id },
                      }"
                      >{{ $t('planManagement') }}</v-btn
                    >
                  </v-col>
                  <v-col v-if="hasLogbook" class="text-center" cols="auto">
                    <logbook-tooltip
                      :logbook="item.logbook"
                      :plan="item"
                      :edit="true"
                    ></logbook-tooltip>
                  </v-col>
                  <v-col class="text-center" cols="auto">
                    <v-btn
                      class="primary--text"
                      rounded
                      small
                      color="white"
                      elevation="0"
                      :to="{
                        name: 'plan-update',
                        params: { id: item.id },
                      }"
                    >
                      <img
                        class="iconDrawer"
                        :src="require(`assets/img/icons/Edit.svg`)"
                    /></v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-fade-transition>
        </v-container>
      </v-list-item>
    </v-list>
    <v-alert v-else> {{ $t('noPlan') }} </v-alert>
  </v-container>
</template>

<script>
import API_PLANS from '~/api/plans'
import API_LOGBOOK from '~/api/logbook'
export default {
  middleware: ['asset-management-role'],
  async asyncData({ $axios, $auth }) {
    let items = []
    let logbooks = []
    const imagePlan = {}
    try {
      try {
        logbooks = await API_LOGBOOK.init($axios).getPlanLogbooks(
          $auth.user.loggedOrganization.id
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
      items.forEach((i) => {
        imagePlan[
          i.planUUID
        ] = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/images/plans/${
          i.id
        }?${Math.random()}`
      })
    } catch (e) {
      // console.log(e.response)
    }
    return { items, imagePlan }
  },
  methods: {
    formatDate(date) {
      const datePart = date.match(/\d+/g)
      const year = datePart[0]
      const month = datePart[1]
      const day = datePart[2]

      return day + '-' + month + '-' + year
    },
  },
}
</script>
