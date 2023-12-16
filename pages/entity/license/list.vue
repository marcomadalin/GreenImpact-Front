<template>
  <v-container :key="componentKey" class="mx-auto my-10">
    <h1 class="blue--text text-h1 mb-10">{{ $t('licenses') }}</h1>
    <v-row class="mx-1">
      <h3
        v-if="organization"
        style="color: #011d89 !important"
        class="primary--text mb-5"
      >
        {{ organization.name }}
      </h3>
      <v-spacer></v-spacer>
      <v-btn
        v-if="organization"
        rounded
        text-lowercase
        elevation="0"
        color="primary"
        class="text-body-2 ml-5 mr-3"
        :to="{
          name: 'license-add',
          params: {
            uuid: organization.id,
            entity: organization,
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
import LicenseListItem from '~/components/LicenseListItem.vue'
import API_PRODUCTS from '~/api/products'
import API_ORGANIZATIONS from '~/api/organizations'

export default {
  components: { LicenseListItem },
  middleware: ['super-admin-role'],
  data() {
    return {
      organization: null,
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
      this.organization = await API_ORGANIZATIONS.init(
        this.$axios
      ).getOrganization(this.$route.params.uuid)
      this.licenses = await API_PRODUCTS.init(this.$axios).getAllLicenses(
        this.$route.params.uuid
      )
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async deleteLicense(license) {
      this.overlay = true
      try {
        await API_PRODUCTS.init(this.$axios).deleteLicense(license.id)
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
