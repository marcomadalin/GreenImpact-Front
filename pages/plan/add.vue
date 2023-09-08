<template>
  <v-container>
    <h1 class="blue--text text-h1 mb-3">
      {{ plan.planUUID ? $t('editPlan') : $t('createNewPlan') }}
    </h1>
    <p v-if="plan.planUUID" class="mb-10 text-body-1 blue--text">
      {{ plan.planName }}
    </p>

    <plan-area-steps
      v-model="form"
      :step1-title="$t('planStepTitle')"
      :step1-label="$t('planStepName')"
      :step2-title="$t('planStepDescription')"
      :step2-label="$t('planStepDescription2')"
      :step3-title="$t('planStepDate')"
      :step4-title="$t('planStepImage')"
      :create-btn-title="$t('planStepCreat')"
      :update-btn-title="$t('planStepUpdate')"
      :dialog-remove-activator-btn-title="$t('planStepDelete')"
      :dialog-remove-title="$t('planStepDelete2')"
      :dialog-remove-description="$t('planStepDelete3')"
      :dialog-remove-btn-title="$t('planStepDelete4')"
      :image-plan="image"
      :is-plan="true"
      @add-image="addImage"
      @remove-image="removeImage"
      @create="create"
      @cancel="cancel(plan)"
      @update="update"
      @remove="remove"
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
import { statusEnum } from '~/constants'
import API from '~/api/plans'
export default {
  middleware: ['asset-management-role'],

  async asyncData({ $axios, params, query }) {
    const api = API.init($axios)
    let form = {}
    let plan = {}
    let image = null

    const id = params.id || query.id
    if (id) {
      try {
        plan = await api.get(id)
        form = {
          id: plan.planUUID,
          name: plan.planName,
          description: plan.planDescription,
          startDate: plan.planStartDate,
          endDate: plan.planEndDate,
        }
        try {
          const path = await $axios.$get(
            `/b2b/plans/${plan.planUUID}/imagePath`
          )
          image = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
        } catch (e) {
          image = null
        }
      } catch (e) {
        console.log(e.response)
      }
    }

    return {
      form,
      image,
      tmpImage: null,
      plan,
      ok: null,
      overlay: false,
      uploadImageProgress: null,
      successText: '',
      snackbarColor: '#12BB6A',
    }
  },

  computed: {
    statusEnum() {
      return statusEnum
    },
  },

  watch: {
    '$route.query': '$fetch',
  },

  beforeMount() {
    this.api = API.init(this.$axios)
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
        this.plan = await this.api.create({
          planName: this.form.name,
          planDescription: this.form.description,
          planStartDate: this.formatDate(this.form.startDate),
          planEndDate: this.formatDate(this.form.endDate),
          planStatus: statusEnum.IDEA.value,
          planOrganizationUUID: this.$auth.user.loggedOrganizationUuid,
        })
        if (this.tmpImage) {
          await this.addImage(this.tmpImage)
        }
        this.overlay = false
        this.successText = 'planCreated'
        this.snackbarColor = '#12BB6A'
        this.ok = true
        this.$nextTick(() => {
          this.$router.push({
            name: 'plan-area-list',
            query: { plan: this.plan.planUUID },
          })
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
        this.plan = await this.api.update(this.plan.planUUID, {
          planName: this.form.name,
          planDescription: this.form.description,
          planStartDate: formatNeeded
            ? this.formatDate(this.form.startDate)
            : this.form.startDate,
          planEndDate: formatNeeded
            ? this.formatDate(this.form.endDate)
            : this.form.endDate,
        })
        this.overlay = false
        this.successText = 'planUpdated'
        this.snackbarColor = '#12BB6A'
        this.ok = true
        this.$nextTick(() => {
          this.$router.push({
            name: 'area-list',
            params: { plan: this.plan.planUUID },
          })
        })
      } catch (e) {
        console.log(e.response)
        this.overlay = false
        this.successText = 'incorrectDate'
        this.snackbarColor = '#F8003B'
        this.ok = true
      }
    },

    cancel(plan) {
      this.$router.push({ name: 'plan-list' })
    },

    async remove() {
      this.overlay = true
      try {
        await this.api.remove(this.plan.planUUID)
        this.overlay = false
        this.successText = 'planDeleted'
        this.ok = true
        this.$router.push({ name: 'plan-list' })
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },

    async addImage(image) {
      if (!this.plan.planUUID) {
        this.tmpImage = image
        return
      }

      try {
        await this.api.addImage(this.plan.planUUID, image, (progress) => {
          this.uploadImageProgress = progress
        })
      } catch (e) {
        console.log(e.response)
      }
    },

    async removeImage() {
      if (!this.plan.planUUID) {
        return
      }

      try {
        await this.api.removeImage(this.plan.planUUID)
      } catch (e) {
        console.log(e.response)
      }
    },
  },
}
</script>
