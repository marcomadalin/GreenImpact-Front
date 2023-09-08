<template>
  <v-container :key="componentKey" fluid class="px-10">
    <h1 class="blue--text text-h1 mb-10">{{ org.organizationName }}</h1>
    <v-row>
      <v-col cols="auto" style="display: flex">
        <v-img class="plain-shadow imageProfile" :src="org.image" />
        <v-btn
          class="plain-shadow"
          width="45px"
          height="45px"
          color="white"
          fab
          style="
            position: relative;
            right: 50px;
            bottom: -170px;
            box-shadow: 0px 0px 8px rgba(50, 51, 193, 0.08) !important;
          "
          @click="uploadImage()"
        >
          <img class="iconDrawer" :src="require(`assets/img/icons/Edit.svg`)" />
        </v-btn>
      </v-col>
      <v-col v-if="license" cols="auto" class="mt-3" style="margin-left: -30px">
        <license-list-item :license="license" :organization="org" />
      </v-col>
      <v-alert v-else class="mt-4">
        {{ $t('noLicenses') }}
      </v-alert>
    </v-row>
    <v-list style="background-color: transparent">
      <h3 class="blue--text text-h3 mb-5" style="margin-top: 20px">
        {{ $t('products') }}
      </h3>
      <v-list-item
        v-for="(item, i) in license.products"
        :key="i"
        class="rounded white mb-1 plain-shadow pt-4"
        active-color="primary"
        variant="plain"
      >
        <v-row>
          <v-col cols="auto" class="pt-0 mt-2">
            <v-card flat>
              <v-avatar
                class="white--text ml-2 caption"
                width="45px"
                height="45px"
                color="#CDCDD6"
                elevation="0"
                fab
              >
              </v-avatar>
            </v-card>
          </v-col>
          <v-col cols="auto">
            <p class="grey--text mb-1 text-caption">
              {{ $t('prodName') }}
            </p>
            <p class="body-2 darkGray--text">{{ item.productName }}</p>
          </v-col>
          <v-spacer />
          <v-col cols="2">
            <p class="grey--text mb-1 text-caption">
              {{ $t('status') }}
            </p>
            <v-row>
              <v-col class="ml-0" cols="auto">
                <p class="body-2 darkGray--text">
                  <v-badge
                    dot
                    inline
                    :color="item.productEnabled ? 'green' : '#C0C0C0'"
                  ></v-badge>
                  {{
                    item.productEnabled
                      ? $t('productActive')
                      : $t('productInactive')
                  }}
                </p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
    <v-snackbar
      v-model="ok"
      style="margin-top: 70px"
      :color="colorSnackbar"
      min-width="0px"
      :top="true"
      fixed
      timeout="1500"
    >
      <v-icon>mdi-check-circle-outline</v-icon>
      <span class="ml-3">{{ $t(successText) }}</span>
    </v-snackbar>
    <div style="display: none">
      <v-file-input
        id="fileUpload"
        v-model="image"
        accept="image/*"
        :rules="[(v) => !!v && v.size <= 1e6]"
      ></v-file-input>
    </div>
  </v-container>
</template>

<script>
import API_USERS from '~/api/users'
export default {
  middleware: ['admin-role'],
  async asyncData({ $axios, $auth }) {
    let org = null
    let license = null
    try {
      const API = await API_USERS.init(
        $axios,
        $auth.user.loggedOrganizationUuid
      )

      const orgs = await API.getOrganizations()
      for (const organization of orgs) {
        if (
          organization.organization.organizationUUID ===
          $auth.user.loggedOrganizationUuid
        ) {
          org = organization.organization
          break
        }
      }

      const path = await API.getOrganizationImage(org.organizationUUID)
      org.image = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`

      const licenses = await API.getLicenses(org.organizationUUID)
      for (const lice of licenses) {
        if (lice.active) {
          license = lice
          break
        }
      }
    } catch (e) {
      console.log(e.response)
    }
    return {
      org,
      license,
    }
  },
  data() {
    return {
      image: null,
      org: null,
      ok: null,
      successText: '',
      componentKey: 0,
      license: null,
      dialog: null,
      colorSnackbar: '#12BB6A',
    }
  },
  watch: {
    async image() {
      if (this.image.size <= 1e6) {
        try {
          const API = await API_USERS.init(
            this.$axios,
            this.$auth.user.loggedOrganizationUuid
          )

          await API.deleteOrgImage()

          await API.addOrganizationImage(this.image)
          this.successText = 'imageChanged'
          this.colorSnackbar = '#12BB6A'
          this.ok = true
          setTimeout(async () => {
            const path = await API.getOrganizationImage(
              this.org.organizationUUID
            )
            this.org.image = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
            this.componentKey += 1
            this.$nuxt.$emit('updateImage')
          }, 1500)
        } catch (e) {
          console.log(e.response)
        }
      } else {
        this.successText = 'maxSizeImage'
        this.colorSnackbar = '#F8003B'
        this.ok = true
      }
    },
  },

  methods: {
    uploadImage() {
      document.getElementById('fileUpload').click()
    },
  },
}
</script>

<style lang="scss">
.imageProfile {
  border-radius: 50%;
  border: solid 10px white;
  width: 220px;
  height: 220px;
}
</style>
