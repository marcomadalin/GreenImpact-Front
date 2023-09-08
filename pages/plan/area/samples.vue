<template>
  <v-container>
    <h1 class="blue--text text-h1 mb-3">
      {{ sample.sampleId ? $t('updateSample2') : $t('createNewSample') }}
    </h1>
    <p class="mb-10 text-body-1 blue--text">
      {{ objective.indicatorDTO.indicatorName }}
    </p>

    <!-- quantitative-sample -->
    <quantitative-sample
      v-if="objective.indicatorDTO.indicatorType === 'QUANTITATIVE'"
      v-model="form"
      :indicator-dto="objective.indicatorDTO"
      :min-date="objective.area.areaStartDate"
      :max-date="objective.area.areaEndDate"
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

    <!-- quantitative-dimensional-sample -->
    <quantitative-dimensional-sample
      v-if="objective.indicatorDTO.indicatorType === 'QUANTITATIVE_DIMENSIONAL'"
      v-model="form"
      :indicator-dto="objective.indicatorDTO"
      :min-date="objective.area.areaStartDate"
      :max-date="objective.area.areaEndDate"
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

    <!-- qualitative-sample -->
    <qualitative-sample
      v-if="objective.indicatorDTO.indicatorType === 'QUALITATIVE'"
      v-model="form"
      :indicator-dto="objective.indicatorDTO"
      :min-date="objective.area.areaStartDate"
      :max-date="objective.area.areaEndDate"
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
      min-width="0px"
      :color="snackbarColor"
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
  name: 'SamplesAdd',
  middleware: ['asset-management-role'],

  async asyncData({ $axios, params, query }) {
    const plan = params.plan || query.plan
    const area = params.area || query.area
    const indicator = params.indicator || query.indicator
    const id = params.id || query.id

    const api = API.init($axios, plan)

    let form = {}
    let sample = {}
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

    if (id) {
      // if indicatorType is QUANTITATIVE_DIMENSIONAL then form
      // should be maped as array of samples
      if (objective.indicatorDTO.indicatorType === 'QUANTITATIVE_DIMENSIONAL') {
        form = objective.objectiveDTOs
          .flatMap((i) => i.samplesPerObjective)
          .sort((a, b) => new Date(a.sampleDate) - new Date(b.sampleDate))

        const sampleDate = form.find((i) => i.sampleId === id).sampleDate

        form = form.filter((i) => i.sampleDate === sampleDate)
      } else {
        try {
          sample = await api.getIndicatorSample(area, indicator, id)
          form = sample
        } catch (e) {
          console.log(e.response)
        }
      }
    }
    return {
      planUUID: plan,
      area,
      indicator,
      objective,
      sample,
      form,
      ok: null,
      overlay: false,
      successText: '',
      snackbarColor: '#12BB6A',
    }
  },

  computed: {
    shouldUpdate() {
      return this.objective.objectiveDTOs
        .flatMap((i) => i.samplesPerObjective)
        .filter((i) =>
          this.form.find(
            (j) =>
              j.sampleId === i.sampleId &&
              j.quantitativeValue !== i.quantitativeValue
          )
        )
        .map((i) => i.sampleId)
    },
  },

  beforeMount() {
    if (this.planUUID) {
      this.api = API.init(this.$axios, this.planUUID)
    }
  },

  methods: {
    parseDate(date) {
      if (!date) return null

      const [day, month, year] = date.split('-')
      return `${year}-${month}-${day}`
    },
    async create() {
      try {
        const form = structuredClone(this.form)
        this.overlay = true
        const today = new Date()
        const time =
          'T' +
          (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) +
          ':' +
          (today.getMinutes() < 10
            ? '0' + today.getMinutes()
            : today.getMinutes()) +
          ':' +
          (today.getSeconds() < 10
            ? '0' + today.getSeconds()
            : today.getSeconds())
        if (
          Array.isArray(form) ||
          this.objective.indicatorDTO.indicatorType ===
            'QUANTITATIVE_DIMENSIONAL'
        ) {
          for (let i = 0; i < form.length; ++i) {
            form[i].sampleDate = this.parseDate(form[i].sampleDate)
            form[i].sampleDate = form[i].sampleDate + time
          }
          await this.api.bulkAddIndicatorSample(this.area, this.indicator, form)
        } else {
          form.sampleDate = this.parseDate(form.sampleDate)
          form.sampleDate = form.sampleDate + time
          await this.api.addIndicatorSample(this.area, this.indicator, form)
        }
        this.overlay = false
        this.successText = 'sampleCreated'
        this.snackbarColor = '#12BB6A'
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

    async update() {
      try {
        const form = structuredClone(this.form)
        this.overlay = true
        const today = new Date()
        const time =
          'T' +
          (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) +
          ':' +
          (today.getMinutes() < 10
            ? '0' + today.getMinutes()
            : today.getMinutes()) +
          ':' +
          (today.getSeconds() < 10
            ? '0' + today.getSeconds()
            : today.getSeconds())
        if (
          Array.isArray(form) ||
          this.objective.indicatorDTO.indicatorType ===
            'QUANTITATIVE_DIMENSIONAL'
        ) {
          // iterate over array of values and update it
          for (let i = 0; i < form.length; ++i) {
            form[i].sampleDate = this.parseDate(form[i].sampleDate)
            form[i].sampleDate = form[i].sampleDate + time
          }
          await Promise.all(
            form
              .filter((i) => this.shouldUpdate.includes(i.sampleId))
              .map(async (form) => {
                const { sampleId, ...data } = form
                return await this.api.updateIndicatorSample(
                  this.area,
                  this.indicator,
                  sampleId,
                  data
                )
              })
          )
        } else {
          form.sampleDate = this.parseDate(form.sampleDate)
          form.sampleDate = form.sampleDate + time
          const { sampleId, ...data } = form
          await this.api.updateIndicatorSample(
            this.area,
            this.indicator,
            sampleId,
            data
          )
        }
        this.overlay = false
        this.successText = 'sampleUpdated'
        this.snackbarColor = '#12BB6A'
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

    async remove() {
      try {
        this.overlay = true
        await this.api.removeIndicatorSample(
          this.area,
          this.indicator,
          this.form.sampleId
        )
        this.overlay = false
        this.successText = 'sampleDeleted'
        this.ok = true
        this.$router.reloadPage()
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }

      this.$router.push({
        name: 'area-list',
        params: { plan: this.planUUID },
      })
    },
  },
}
</script>
