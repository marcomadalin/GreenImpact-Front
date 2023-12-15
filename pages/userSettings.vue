<template>
  <v-container :key="componentKey" class="mx-auto my-10" style="max-width: 50%">
    <h1 class="blue--text text-h1 mb-10">{{ $t('profile') }}</h1>
    <h3 style="color: #011d89 !important" class="primary--text mb-5">
      {{ $t('personalData') }}
    </h3>
    <v-text-field
      v-model="firstName"
      filled
      background-color="white"
      :placeholder="$t('name')"
    ></v-text-field>
    <v-text-field
      v-model="lastName"
      filled
      background-color="white"
      :placeholder="$t('lastName')"
    ></v-text-field>
    <v-text-field
      v-model="phoneNumber"
      filled
      background-color="white"
      :placeholder="$t('phoneNumber')"
    ></v-text-field>
    <v-btn
      rounded
      depressed
      elevation="0"
      color="primary"
      class="text-body-2 white--text"
      @click="updateData"
    >
      {{ $t('updatePersonalData') }}
    </v-btn>
    <v-divider class="my-10"></v-divider>
    <h3 style="color: #011d89 !important" class="primary--text mb-5">
      {{ $t('accountLanguage') }}
    </h3>
    <div id="lang">
      <v-select
        v-model="currentLang"
        style="max-width: 50%"
        :items="locales"
        filled
        shaped
        background-color="white"
        :menu-props="{ bottom: true, offsetY: true }"
      />
    </div>
    <p v-if="currentLang !== $auth.user.locale">{{ $t('requireLogin') }}</p>
    <v-btn
      rounded
      depressed
      elevation="0"
      color="primary"
      class="text-body-2 white--text"
      @click="updateLocale"
    >
      {{ $t('updateLanguage') }}
    </v-btn>
    <v-divider class="my-10"></v-divider>
    <h3 style="color: #011d89 !important" class="primary--text mb-5">
      {{ $t('myEntities') }}
    </h3>
    <v-row>
      <v-col v-for="(org, i) in organizations" :key="i" cols="6">
        <v-row align="center" no-gutters>
          <v-col
            cols="4"
            class="mx-0 px-0 my-3"
            align="center"
            justify="center"
          >
            <v-img
              style="border-radius: 50%"
              :src="org.image"
              aspect-ratio="1"
              width="60"
              height="auto"
            />
          </v-col>
          <v-col cols="8">
            <div class="ml-2 mr-2">
              <p class="grey--text mb-0 text-caption">
                {{ $t('entityName') }}
              </p>
              <p class="body-2 darkGray--text">
                {{ org.name }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-10"></v-divider>
    <h3 style="color: #011d89 !important" class="primary--text mb-5">
      {{ $t('changePassword') }}
    </h3>
    <p class="body-2 darkGray--text">{{ $t('passwordText') }}</p>
    <v-text-field
      v-model="typedPassword"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'"
      filled
      background-color="white"
      :placeholder="$t('actualPassword')"
      :rules="[!passwordWrong || $t('passwordIncorrect')]"
      @click:append="show1 = !show1"
      @change="passwordWrong = false"
    ></v-text-field>
    <v-text-field
      v-model="newPassword"
      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show2 ? 'text' : 'password'"
      filled
      background-color="white"
      :placeholder="$t('newPassword')"
      @click:append="show2 = !show2"
    ></v-text-field>
    <v-btn
      rounded
      depressed
      elevation="0"
      color="primary"
      class="text-body-2 white--text"
      @click="updatePassword"
    >
      {{ $t('updatePassword') }}
    </v-btn>
    <v-divider class="my-10"></v-divider>
    <h3 style="color: #011d89 !important" class="primary--text mb-5">
      {{ $t('email') }}
    </h3>
    <p class="body-2 darkGray--text mb-1 pb-0">
      {{ $t('emailText1') }}
      <span class="font-weight-bold">{{ email }}</span>
    </p>
    <p class="body-2 darkGray--text mt-0 pt-0">{{ $t('emailText2') }}</p>
    <v-text-field
      v-model="typedEmail"
      filled
      background-color="white"
      :placeholder="$t('newEmail')"
    ></v-text-field>
    <v-btn
      rounded
      depressed
      elevation="0"
      color="primary"
      class="text-body-2 white--text"
      disabled
    >
      {{ $t('updateEmail') }}
    </v-btn>

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

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import API_USERS from '~/api/users'

export default {
  async asyncData({ $axios, $auth }) {
    let organizations = []
    const user = $auth.user
    console.log(user)
    const API = API_USERS.init($axios, $auth.user.loggedOrganizationUuid)
    try {
      organizations = await API.getOrganizations($auth.user.id)
      organizations = await Promise.all(
        organizations.map((org) => {
          const path = 'filler' // await API.getOrganizationImage(org.organization.organizationUUID)

          // TODO: this s3 should not be hardcoded!
          org.image = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
          return org
        })
      )

      // for (let i = 0; i < organizations.length; i++) {
      //   try {
      //     const path = await API.getOrganizationImage(
      //       organizations[i].organization.organizationUUID
      //     )

      //     organizations[
      //       i
      //     ].image = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
      //   } catch (e) {
      //     console.log(e.response)
      //   }
      //   if (
      //     $auth.user.loggedOrganizationUuid ===
      //     organizations[i].organization.organizationUUID
      //   )
      //     user = organizations[i].user
      // }
    } catch (e) {
      console.log(e.response)
    }
    return {
      user,
      organizations,
      API,
      currentLang: $auth.user.locale,
    }
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      typedPassword: '',
      newPassword: '',
      email: '',
      typedEmail: '',
      show1: false,
      show2: false,
      ok: null,
      overlay: false,
      successText: '',
      componentKey: 0,
      colorSnackbar: '#12BB6A',
      passwordWrong: false,
    }
  },

  computed: {
    locales() {
      return this.$i18n.locales.map((i) => i.code)
    },
  },

  beforeMount() {
    this.firstName = this.user.name
    this.lastName = this.user.surname
    this.phoneNumber = this.user.phoneNumber
    this.email = this.user.username
  },

  methods: {
    async updateData() {
      try {
        this.overlay = true
        await API_USERS.init(this.$axios, this.organizationUUID).updateData({
          id: this.user.id,
          username: this.user.username,
          password: this.user.password,
          name: this.firstName,
          surname: this.lastName,
          locale: this.user.locale,
          phoneNumber: this.phoneNumber,
          loggedOrganization: this.user.loggedOrganization,
          role: this.user.role,
        })

        this.overlay = false
        this.successText = 'dataUpdated'
        this.colorSnackbar = '#12BB6A'
        this.ok = true
        this.componentKey += 1
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },
    async updateLocale() {
      try {
        this.overlay = true
        await API_USERS.init(this.$axios, this.organizationUUID).updateLocale(
          this.user.id,
          this.currentLang
        )
        this.overlay = false
        this.successText = 'langUpdated'
        this.colorSnackbar = '#12BB6A'
        this.ok = true
        this.componentKey += 1
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },
    async updatePassword() {
      try {
        this.overlay = true
        await API_USERS.init(this.$axios, this.organizationUUID).changePassword(
          this.user.id,
          this.typedPassword,
          this.newPassword
        )
        this.overlay = false
        this.successText = 'passwordUpdated'
        this.colorSnackbar = '#12BB6A'
        this.ok = true
        this.componentKey += 1
      } catch (e) {
        console.log(e.response)
        this.overlay = false
        this.passwordWrong = true
      }
    },
  },
}
</script>
<style lang="scss">
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background: #c0c0c0 !important;
}
.v-btn__content {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
}
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg .v-btn__content {
  color: white;
}

#lang .mdi-menu-down,
#lang .mdi-menu-down:after,
#lang .mdi-menu-down:before {
  color: #011d89 !important;
}

.v-select__selection--comma {
  margin: 7px 4px 7px 0;
  min-height: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.87);
}

h3 {
  color: #011d89 !important;
  font-family: 'Lexend' !important;
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 20px !important;
  line-height: 25px !important;
}
</style>
