<template>
  <v-container>
    <h1 class="blue--text text-h1 mb-3">
      {{ area.areaId ? $t('editAreaH') : $t('createNewArea') }}
    </h1>
    <p v-if="area.areaId" class="mb-10 text-body-1 blue--text">
      {{ area.areaName }}
    </p>

    <plan-area-steps
      v-model="form"
      :step1-title="$t('areaStepTitle')"
      :step1-label="$t('areaStepName')"
      :step2-title="$t('areaStepDescription')"
      :step2-label="$t('areaStepDescription2')"
      :step3-title="$t('areaStepDate')"
      :step4-title="$t('areaStepImage')"
      :create-btn-title="$t('areaStepCreat')"
      :update-btn-title="$t('areaStepUpdate')"
      :dialog-remove-activator-btn-title="$t('areaStepDelete')"
      :dialog-remove-title="$t('areaStepDelete2')"
      :dialog-remove-description="$t('areaStepDelete3')"
      :dialog-remove-btn-title="$t('areaStepDelete4')"
      :image-plan="image"
      :min-date="planObject.planStartDate"
      :max-date="planObject.planEndDate"
      @add-image="addImage"
      @remove-image="removeImage"
      @create="create"
      @cancel="cancel"
      @update="update"
      @remove="remove"
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
import { statusEnum } from '~/constants'
import API from '~/api/areas'
import APIPlan from '~/api/plans'
export default {
  name: 'AreaAdd',
  middleware: ['asset-management-role'],

  async asyncData({ $axios, params, query }) {
    const plan = params.plan || query.plan
    const api = API.init($axios, plan)
    let form = {}
    let area = {}
    let image = null
    let planObject = {}

    const id = params.id || query.id

    if (id) {
      try {
        area = await api.get(id)
        form = {
          id: area.areaId,
          name: area.areaName,
          description: area.areaDescription,
          startDate: area.areaStartDate,
          endDate: area.areaEndDate,
        }
        try {
          const path = await $axios.$get(
            `/b2b/plans/${params.plan}/${params.id}/imagePath`
          )
          image = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
        } catch (e) {
          image = null
        }
      } catch (e) {
        console.log(e.response)
      }
    }

    try {
      planObject = await APIPlan.init($axios).get(plan)
    } catch (e) {
      console.log(e.response)
    }

    return {
      planUUID: plan,
      planObject,
      area,
      form,
      image,
      tmpImage: null,
      ok: null,
      overlay: false,
      successText: '',
      snackbarColor: '#12BB6A',
    }
  },

  computed: {
    statusEnum() {
      return statusEnum
    },
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
      this.overlay = true
      try {
        const result = await this.api.create({
          areaName: this.form.name,
          areaDescription: this.form.description,
          areaStartDate: this.formatDate(this.form.startDate),
          areaEndDate: this.formatDate(this.form.endDate),
          areaStatus: statusEnum.IDEA.value,
        })

        this.area.areaId = result.areaId

        if (this.tmpImage) {
          await this.addImage(this.tmpImage)
        }

        this.overlay = false
        this.successText = 'areaCreated'
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
      this.overlay = true
      try {
        const dateParts = this.form.startDate.split('-')
        const formatNeeded = dateParts[2].length === 4
        this.area = await this.api.update(this.area.areaId, {
          areaName: this.form.name,
          areaDescription: this.form.description,
          areaStartDate: formatNeeded
            ? this.formatDate(this.form.startDate)
            : this.form.startDate,
          areaEndDate: formatNeeded
            ? this.formatDate(this.form.endDate)
            : this.form.endDate,
        })
        this.overlay = false
        this.successText = 'areaUpdated'
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
        this.ok = true
      }
    },

    cancel() {
      if (this.planUUID != null) {
        this.$router.push({
          name: 'area-list',
          params: { plan: this.planUUID },
        })
      } else this.$router.push({ name: 'plan-list' })
    },

    async remove() {
      this.overlay = true
      try {
        await this.api.remove(this.area.areaId)
        this.overlay = false
        this.successText = 'areaDeleted'
        this.ok = true
        this.$router.push({
          name: 'area-list',
          params: { plan: this.planUUID },
        })
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },

    async addImage(image) {
      if (!this.area.areaId) {
        this.tmpImage = image
        return
      }

      try {
        await this.api.addImage(this.area.areaId, image, (progress) => {
          this.uploadImageProgress = progress
        })
      } catch (e) {
        console.log(e.response)
      }
    },

    async removeImage() {
      if (!this.area.areaId) {
        return
      }

      try {
        await this.api.removeImage(this.area.areaId)
      } catch (e) {
        console.log(e.response)
      }
    },
  },
}
</script>
