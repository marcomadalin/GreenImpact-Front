<template>
  <v-container>
    <h1 class="blue--text text-h1 mb-10">
      {{ $t('createNewIndicatorTitle') }}
    </h1>
    <indicator-steps
      v-model="form"
      :munits="measurementUnits"
      :dtypes="dimensionalTypes"
      :qualtypes="qualitativeTypes"
      :odsnonstandardlist="odsNonStandardList"
      @create="create"
      @update="update"
      @cancel="
        $router.push({
          name: 'index',
        })
      "
    />

    <v-snackbar
      v-model="ok"
      style="margin-top: 70px"
      color="#12BB6A"
      :top="true"
      min-width="0px"
      fixed
      timeout="1500"
    >
      <v-icon>mdi-check-circle-outline</v-icon>
      <span class="ml-3">{{ $t('indicatorCreated') }}</span>
    </v-snackbar>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import API from '~/api/indicators'
import { ma2030 } from '~/api/indicatorsSources'

export default {
  middleware: ['asset-management-role'],

  async asyncData({ $axios, query }) {
    const api = API.init($axios)
    let form = {}
    let indicator = {}
    let measurementUnits = {}
    let dimensionalTypes = {}
    let qualitativeTypes = {}
    let odsNonStandardList = {}
    let odsNonStandardList2 = []

    try {
      measurementUnits = await api.getMUnits()
    } catch (e) {
      console.log(e.response)
    }

    try {
      dimensionalTypes = await api.getDimensionalTypes()
    } catch (e) {
      console.log(e.response)
    }

    try {
      qualitativeTypes = await api.getQualitativeTypes()
    } catch (e) {
      console.log(e.response)
    }

    try {
      odsNonStandardList2 = await ma2030.init($axios).listNonStandard()
      odsNonStandardList = odsNonStandardList2.map(
        (a, b) => Object.assign(a, b),
        {}
      )
    } catch (e) {
      console.log(e.response)
    }

    if (query.id) {
      try {
        indicator = await api.get(query.id)
        form = indicator
      } catch (e) {
        console.log(e.response)
      }
    }

    return {
      form,
      indicator,
      measurementUnits,
      dimensionalTypes,
      qualitativeTypes,
      odsNonStandardList,
      ok: null,
      overlay: false,
    }
  },

  watch: {
    '$route.query': '$fetch',
  },

  beforeMount() {
    this.api = API.init(this.$axios)
  },

  methods: {
    async create() {
      this.overlay = true
      const { indicatorLevel, ...form } = this.form
      try {
        this.indicator = await this.api.create({
          ...form,
          organizationUUID: this.$auth.user.loggedOrganizationUuid,
          indicatorEnabled: true,
          indicatorScope: 'ORGANIZATION',
        })

        try {
          const api = await ma2030.init(this.$axios)
          for (let i = 0; i < indicatorLevel.length; i++) {
            await api.addCustomIndicators(
              indicatorLevel[i],
              this.indicator.indicatorUUID
            )
          }
        } catch (e) {
          console.log(e.response)
        }

        this.overlay = false
        this.ok = true
        await this.$router.push({
          name: 'indicator-list',
        })
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },

    async update() {
      this.overlay = true
      const { indicatorLevel, ...form } = this.form
      try {
        this.indicator = await this.api.update(this.plan.planUUID, form)
        this.overlay = false
        this.ok = true
        this.$router.push({
          name: 'index',
        })
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },
  },
}
</script>
