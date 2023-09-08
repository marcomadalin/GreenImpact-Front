<template>
  <v-container>
    <h1 class="blue--text text-h1 mb-3">
      {{ $t('createNewObjective') }}
    </h1>
    <p class="mb-10 text-body-1 blue--text">
      {{ objective.indicatorDTO.indicatorName }}
    </p>

    <!-- quantitative-fieldset -->
    <quantitative-fieldset
      v-if="objective.indicatorDTO.indicatorType === 'QUANTITATIVE'"
      v-model="form"
      :indicator-dto="objective.indicatorDTO"
      :min-date="objective.area.areaStartDate"
      :max-date="objective.area.areaEndDate"
      :dates="$route.params.dates"
      @create="create"
      @update="update"
      @remove="remove"
      @cancel="
        $router.push({
          name: 'area-list',
          params: { plan: planUUID },
        })
      "
    />

    <!-- quantitative-dimensional-fieldset -->
    <quantitative-dimensional-fieldset
      v-if="objective.indicatorDTO.indicatorType === 'QUANTITATIVE_DIMENSIONAL'"
      v-model="form"
      :indicator-dto="objective.indicatorDTO"
      :min-date="objective.area.areaStartDate"
      :max-date="objective.area.areaEndDate"
      :dates="$route.params.dates"
      @create="create"
      @update="update"
      @remove="remove"
      @cancel="
        $router.push({
          name: 'area-list',
          params: { plan: planUUID },
        })
      "
    />

    <!-- quanlitative-fieldset -->
    <qualitative-fieldset
      v-if="objective.indicatorDTO.indicatorType === 'QUALITATIVE'"
      v-model="form"
      :indicator-dto="objective.indicatorDTO"
      :min-date="objective.area.areaStartDate"
      :max-date="objective.area.areaEndDate"
      :dates="$route.params.dates"
      @create="create"
      @update="update"
      @remove="remove"
      @cancel="
        $router.push({
          name: 'area-list',
          params: { plan: planUUID },
        })
      "
    />

    <v-snackbar
      v-model="ok"
      style="margin-top: 70px"
      :color="snackbarColor"
      min-width="0px"
      :top="true"
      fixed
      timeout="1500"
    >
      <v-icon>mdi-check-circle-outline</v-icon>
      <span class="ml-3">{{ $t(successText) }}</span>
    </v-snackbar>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import API from '~/api/areas'
export default {
  name: 'ObjectiveAdd',
  middleware: ['asset-management-role'],

  async asyncData({ $axios, params, query }) {
    const plan = params.plan || query.plan
    const area = params.area || query.area
    const indicator = params.indicator || query.indicator

    const api = API.init($axios, plan)

    let form = null
    let objective = {}

    try {
      objective = await api.getIndicator(area, indicator)
      form =
        objective.indicatorDTO.indicatorType === 'QUANTITATIVE_DIMENSIONAL'
          ? []
          : {}
    } catch (e) {
      console.log(e.response)
    }

    return {
      planUUID: plan,
      area,
      indicator,
      objective,
      form,
      ok: null,
      overlay: false,
      successText: '',
      snackbarColor: '#12BB6A',
    }
  },

  beforeMount() {
    if (this.planUUID) {
      this.api = API.init(this.$axios, this.planUUID)
    }
  },

  methods: {
    formatDate(date) {
      const datePart = date.split('-')
      const year = datePart[0]
      const month = datePart[1]
      const day = datePart[2]

      return day + '-' + month + '-' + year
    },
    async create() {
      try {
        const form = structuredClone(this.form)
        this.overlay = true
        if (
          Array.isArray(form) ||
          this.objective.indicatorDTO.indicatorType ===
            'QUANTITATIVE_DIMENSIONAL'
        ) {
          for (let i = 0; i < form.length; ++i) {
            form[i].startDate = this.formatDate(form[i].startDate)
            form[i].endDate = this.formatDate(form[i].endDate)
          }
          console.log(form)
          await this.api.bulkAddIndicatorObjective(
            this.area,
            this.indicator,
            form
          )
        } else {
          form.startDate = this.formatDate(form.startDate)
          form.endDate = this.formatDate(form.endDate)
          await this.api.addIndicatorObjective(this.area, this.indicator, form)
        }
        this.successText = 'goalCreated'
        this.snackbarColor = '#12BB6A'
        this.overlay = false
        this.ok = true
        this.$router.push({
          name: 'area-list',
          params: { plan: this.planUUID },
        })
      } catch (e) {
        console.log(e.response)
        this.overlay = false
        this.successText = 'incorrectDate'
        this.snackbarColor = '#F8003B'
        this.ok = true
      }
    },

    async update(data) {
      // TODO
    },

    async remove() {
      // TODO
    },
  },
}
</script>
