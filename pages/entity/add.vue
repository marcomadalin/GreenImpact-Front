<template>
  <v-container>
    <h1 class="primary--text">
      {{
        $route.params.entity != null
          ? $route.params.entity.name
          : $t('newOrganization')
      }}
    </h1>
    <entity-steps
      v-model="form"
      :uuid="$route.params.uuid ? route.params.uuid : null"
      @create="createOrganization"
      @update="updateOrganization"
      @remove="deleteOrganization"
      @cancel="
        $router.push({
          name: 'entity-list',
        })
      "
    />

    <v-snackbar
      v-model="ok"
      style="margin-top: 70px"
      color="#12BB6A"
      min-width="0px"
      :top="true"
      fixed
      timeout="1500"
    >
      <v-icon>mdi-check-circle-outline</v-icon>
      <span class="ml-4">{{
        $route.params.entity ? $t('entityUpdated') : $t('entityCreated')
      }}</span>
    </v-snackbar>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import EntitySteps from '~/components/EntitySteps.vue'
import API_ORGANIZATIONS from '~/api/organizations'

export default {
  components: { EntitySteps },
  middleware: ['super-admin-role'],

  data() {
    let form = {}
    if (this.$route.params.entity) {
      form = {
        organizationName: this.$route.params.entityorganizationName,
        organizationBack2BluType:
          this.$route.params.entity.organizationBack2BluType,
      }
    }
    return { form, ok: null, overlay: false, api: null }
  },
  async beforeMount() {
    try {
      this.api = await API_ORGANIZATIONS.init(this.$axios)
    } catch (e) {
      console.log(e.response)
    }
  },
  methods: {
    async createOrganization() {
      this.overlay = true
      try {
        const organization = {
          id: null,
          name: this.form.organizationName,
          type: this.form.organizationBack2BluType,
          enabled: true,
          roles: null,
        }
        await this.api.createOrganization(organization)
        this.overlay = false
        this.ok = true
        await this.$router.push({ name: 'entity-list' })
      } catch (e) {
        console.log(e)
        this.overlay = false
      }
    },
    async updateOrganization() {
      this.overlay = true
      try {
        this.overlay = false
        this.ok = true
        await this.$router.push({ name: 'entity-list' })
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },
    async deleteOrganization() {
      this.overlay = true
      try {
        this.overlay = false
        this.ok = true
        await this.$router.push({ name: 'entity-list' })
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },
  },
}
</script>
