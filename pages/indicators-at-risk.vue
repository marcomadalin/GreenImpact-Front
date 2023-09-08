<template>
  <v-container fluid px-8 pt-8>
    <h1 class="blue--text text-h1 mb-2">{{ $t('riskIndicators') }}</h1>
    <p class="text-body-2 blue--text">
      {{ $t('riskIndicatorsList') }}
    </p>

    <v-container fluid pl-0 pr-0 pt-4 pb-2 mb-4>
      <v-row no-gutters>
        <v-col cols="6" sm="6" align="left">
          <h2 class="primary--text text-h2"></h2>
        </v-col>
      </v-row>
    </v-container>

    <v-row
      v-for="(item, i) in indicators"
      :key="i"
      class="rounded-lg my-4 px-0 py-0 ml-1"
    >
      <indicator-block :indicator="item" :show="false" />
    </v-row>
  </v-container>
</template>

<script>
import API from '~/api/plans'
import IndicatorBlock from '~/components/IndicatorBlock.vue'
export default {
  components: { IndicatorBlock },
  async asyncData({ $axios }) {
    let indicators = []
    try {
      const plans = await API.init($axios).list()
      const allIndicators = []
      for (const p of plans) {
        for (const a of p.areaDTOs) {
          for (const i of a.areaIndicatorDTOs) {
            allIndicators.push(i)
          }
        }
      }
      indicators = allIndicators.filter((i) => i.status === 'RED')
    } catch (e) {
      console.log(e.response)
    }
    return { indicators }
  },
  data() {
    return {
      entityImage: null,
    }
  },
  async beforeMount() {
    await this.getImage()
  },
  methods: {
    async getImage() {
      try {
        const orgUUID = this.$auth.user.loggedOrganizationUuid
        const path = await this.$axios.$get(`/b2b/${orgUUID}/getImagePath`)
        this.entityImage = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
      } catch (e) {
        console.log(e.response)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.header-number {
  font-size: 36px !important;
}
</style>
