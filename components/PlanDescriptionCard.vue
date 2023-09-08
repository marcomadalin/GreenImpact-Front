<template>
  <v-container fluid px-0>
    <v-row>
      <v-col md="4" xl="3" cols="12">
        <v-card flat class="rounded-md">
          <v-img :src="imagePath" class="text-right image-3-2">
            <v-avatar v-if="hasLogbook" color="white" class="mt-3 mr-3 pt-1">
              <logbook-tooltip
                v-if="init"
                :logbook="logbook"
                :plan="plan"
                :edit="true"
              ></logbook-tooltip>
            </v-avatar>
          </v-img>
        </v-card>
      </v-col>
      <v-col md="8" xl="9" cols="12">
        <v-card class="pa-5 rounded-md" flat>
          <v-btn
            class="primary--text edit-pencil-pos"
            rounded
            small
            color="white"
            elevation="0"
            :to="{ name: 'plan-update', params: { id: plan.planUUID } }"
            ><img
              class="iconDrawer"
              :src="require(`assets/img/icons/Edit.svg`)"
          /></v-btn>
          <p class="grey--text mb-2 text-caption">
            {{ $t('planDescription') }}
          </p>
          <p class="body-1 darkBlue--text mt-2 mb-5">
            {{ plan.planDescription }}
          </p>
          <p class="grey--text mb-0 text-caption mb-2">
            {{ $t('planStatus') }}
          </p>
          <status-progress-bar class="mb-5" :value="plan.snapshot" />

          <div>
            <p class="grey--text mb-0 text-caption mb-2">
              {{ $t('impactedSDG') }}
            </p>
            <!-- TODO: ODS -->
            <v-avatar
              v-for="j in impact.map(
                (i) => i.dtoReference.theOne.levelN_ItemId
              )"
              :key="j"
              tile
              size="28"
              class="mr-1"
            >
              <v-img
                :src="require(`/assets/img/sdg/small/ico-ODS-${j}.svg`)"
                width="28"
                height="28"
              />
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import API_LOGBOOK from '~/api/logbook'

export default {
  props: {
    plan: {
      type: Object,
      default: () => ({}),
    },
    impact: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      imagePath: null,
      logbook: null,
      init: null,
    }
  },

  async beforeMount() {
    await this.getImage(this.plan.planUUID)
    if (this.hasLogbook) {
      try {
        const logbooks = await API_LOGBOOK.init(this.$axios).getPlanLogbooks(
          this.$auth.user.loggedOrganizationUuid
        )
        for (let i = 0; i < logbooks.length; ++i) {
          if (
            logbooks[i].planUUID === this.plan.planUUID &&
            logbooks[i].logBookType === 'PLAN'
          ) {
            this.logbook = logbooks[i]
            break
          }
        }
        this.init = true
      } catch (e) {
        console.log(e.response)
      }
    }
  },

  methods: {
    async getImage(planUUID) {
      try {
        const path = await this.$axios.$get(`/b2b/plans/${planUUID}/imagePath`)
        this.imagePath = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
      } catch (e) {
        console.log(e.response)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.edit-pencil-pos {
  position: absolute;
  right: 20px;
  top: 20px;
}
.image-3-2 {
  width: 100%;
  height: 0;
  padding-bottom: 66.67%; /* 2/3 of the width */
}
</style>
