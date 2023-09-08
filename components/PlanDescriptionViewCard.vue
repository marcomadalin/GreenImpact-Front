<template>
  <v-container fluid px-0>
    <v-row no-gutters>
      <v-col md="4" xl="3" cols="12">
        <v-card flat class="rounded-md plain-shadow">
          <v-img :src="imagePath" class="text-right image-3-2">
            <v-avatar
              v-if="
                hasLogbook &&
                plan &&
                plan.logbook &&
                plan.logbook.logBookEnabled &&
                plan.logbook.folders[0].items.length > 0
              "
              color="white"
              class="mt-3 mr-3 pt-1"
            >
              <logbook-tooltip
                :logbook="plan.logbook"
                class="mt-1"
                :plan="plan"
              ></logbook-tooltip>
            </v-avatar>
          </v-img>
        </v-card>
      </v-col>
      <v-col md="8" xl="9" cols="12" class="pl-5">
        <v-card class="pa-5 rounded-md plain-shadow" flat>
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
    }
  },

  async beforeMount() {
    await this.getImage(this.plan.planUUID)
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
<style>
.image-3-2 {
  width: 100%;
  height: 0;
  padding-bottom: 66.67%; /* 2/3 of the width */
}
</style>
