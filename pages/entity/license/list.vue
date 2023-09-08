<template>
  <v-container :key="componentKey" class="mx-auto my-10">
    <h1 class="blue--text text-h1 mb-10">{{ $t('licenses') }}</h1>
    <v-row class="mx-1">
      <h3 style="color: #011d89 !important" class="primary--text mb-5">
        {{ $route.params.entity.organizationName }}
      </h3>
      <v-spacer></v-spacer>
      <v-btn
        rounded
        text-lowercase
        elevation="0"
        color="primary"
        class="text-body-2 ml-5 mr-3"
        :to="{
          name: 'license-add',
          params: {
            uuid: $route.params.uuid,
            entity: $route.params.entity,
          },
        }"
      >
        <v-icon class="mr-2" color="white">mdi-key-plus</v-icon>
        {{ $t('newLicense') }}
      </v-btn>
    </v-row>
    <v-row v-if="licenses.length !== 0">
      <v-col v-for="(license, i) in licenses" :key="i" cols="auto">
        <license-list-item :license="license" @delete="deleteLicense" />
      </v-col>
    </v-row>
    <v-alert v-else class="mt-4">
      {{ $t('noLicenses') }}
    </v-alert>
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
      <span class="ml-3">{{ $t(successText) }}</span>
    </v-snackbar>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import API_USERS from '~/api/users'
import LicenseListItem from '~/components/LicenseListItem.vue'

export default {
  components: { LicenseListItem },
  middleware: ['super-admin-role'],
  data() {
    return {
      ok: null,
      overlay: false,
      successText: '',
      componentKey: 0,
      licenses: [],
      api: null,
    }
  },
  async beforeMount() {
    try {
      this.api = await API_USERS.init(
        this.$axios,
        this.$auth.user.loggedOrganizationUuid
      )
      this.licenses = await this.api.getLicenses(this.$route.params.uuid)
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async deleteLicense(license) {
      this.overlay = true
      try {
        await API_USERS.init(
          this.$axios,
          this.$auth.user.loggedOrganizationUuid
        ).deleteLicense(this.$route.params.uuid, license.licenseId)
        this.successText = 'licenseDeleted'
        this.overlay = false
        this.ok = true
        const index = this.licenses.indexOf(license)
        this.licenses.splice(index, 1)
        this.componentKey += 1
      } catch (e) {
        console.log(e)
        this.overlay = false
      }
    },
  },
}
</script>
<style lang="scss"></style>
