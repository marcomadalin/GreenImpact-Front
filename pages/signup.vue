<template>
  <section>
    <v-form
      ref="form"
      class="mt-10 mb-5"
      lazy-validation
      @submit.prevent="signup"
    >
      <h2
        class="primary--text mb-3"
        style="
          font-family: 'Lexend' !important;
          font-style: normal !important;
          font-weight: 500 !important;
          font-size: 20px !important;
        "
      >
        {{ $t('createAccount') }}
      </h2>
      <p
        v-if="error"
        class="error--text mb-2 mt-8"
        style="min-height: 18px"
        v-text="error"
      ></p>
      <v-text-field
        v-model="form.firstName"
        filled
        :rules="nameRules"
        background-color="white"
        :label="$t('name')"
        required
        :error="error"
        @keypress="error = null"
      ></v-text-field>
      <v-text-field
        v-model="form.lastName"
        filled
        :rules="lastNameRules"
        background-color="white"
        :label="$t('lastName')"
        required
        :error="error"
        @keypress="error = null"
      ></v-text-field>
      <v-text-field
        v-model="form.email"
        readonly
        :disabled="true"
        filled
        background-color="white"
        :rules="emailRules"
        :label="$t('email')"
        placeholder="aromero@dipom.com"
        required
        :error="error"
        @keypress="error = null"
      ></v-text-field>
      <v-text-field
        v-model="form.password"
        :rules="passwordRules"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        filled
        background-color="white"
        :label="$t('password')"
        required
        :error="error"
        @click:append="show1 = !show1"
        @keypress="error = null"
      ></v-text-field>
      <v-text-field
        v-model="confirmPassword"
        :rules="passwordConfirmRules"
        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show2 ? 'text' : 'password'"
        filled
        background-color="white"
        :label="$t('repeatPassword')"
        required
        :error="error"
        @click:append="show2 = !show2"
        @keypress="error = null"
        @change="
          passwordNotMatch = !(
            !!confirmPassword && confirmPassword === form.password
          )
        "
      ></v-text-field>
      <!--<p>
        {{ $t('creatingAccount') }}
        <u
          ><a class="primary--text"> {{ $t('termsService') }}</a></u
        >
        {{ $t('and') }}
        <a class="primary--text"> {{ $t('privacyPolicy') }}</a>
      </p>
      -->
      <v-btn
        :disabled="passwordNotMatch"
        block
        height="45px"
        small
        rounded
        depressed
        type="submit"
        elevation="0"
        color="primary"
        class="text-body-2 white--text px-4"
        style="
          font-family: 'Lexend' !important;
          font-style: normal !important;
          font-weight: 500 !important;
          font-size: 16px !important;
        "
        :loading="loading"
        @click="validate"
      >
        {{ $t('create') }}
      </v-btn>
    </v-form>
    <p>
      {{ $t('alreadyLogged') }}
      <a class="primary--text" @click="$router.push({ name: 'login' })">
        {{ $t('login') }}</a
      >
    </p>
    <v-alert v-if="messages" text prominent color="red">
      {{ messages.message }}
    </v-alert>
  </section>
</template>
<script>
import API_USERS from '~/api/users'

export default {
  layout: 'auth',
  auth: false,
  async asyncData({ $axios, query }) {
    let token = null
    let userData = null

    if (query) {
      token = query.inviteToken
      userData = await API_USERS.init($axios, '').getUserSignupData(token)
    }

    return {
      form: {
        firstName: '',
        lastName: '',
        email: userData ? userData.email : '',
        password: '',
      },
      token,
      userData,
      confirmPassword: '',
      show1: false,
      show2: false,
      error: null,
      loading: false,
      nameRules: [],
      lastNameRules: [],
      emailRules: [],
      passwordRules: [],
      passwordConfirmRules: [],
      messages: null,
      passwordNotMatch: true,
    }
  },
  head: {
    title: 'Signup',
  },

  beforeMount() {
    this.nameRules = [(v) => !!v || this.$t('insertName')]
    this.lastNameRules = [(v) => !!v || this.$t('insertLastName')]
    this.emailRules = [
      (v) => !!v || this.$t('insertMail'),
      (v) => /.+@.+\..+/.test(v) || this.$t('insertValidMail'),
    ]
    this.passwordRules = [(v) => !!v || this.$t('insertPassword')]
    this.passwordConfirmRules = [
      (v) => !!v || this.$t('repeatPassword'),
      (v) => v === this.form.password || this.$t('passwordUnmatched'),
    ]
  },

  methods: {
    async signup() {
      this.loading = true
      this.messages = false
      try {
        this.userData.firstName = this.form.firstName
        this.userData.lastName = this.form.lastName
        this.userData.password = this.form.password

        // console.log(this.userData)

        await API_USERS.init(
          this.$axios,
          this.userData.userOrganizations[0].organization.organizationUUID
        )
          .createFromInvite(this.userData, this.token)
          .then(() => {
            this.$router.push({ name: 'user-list' })
          })
      } catch (err) {
        this.loading = false
        this.messages = err.response.data
        // console.log(err.response)
      }
    },
    validate() {
      this.$refs.form.validate()
    },
  },
}
</script>
