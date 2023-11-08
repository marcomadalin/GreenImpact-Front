<template>
  <section>
    <v-alert v-if="$auth.loggedIn" class="mt-10">
      {{ $t('alreadyLoggedIn') + $auth.user.email }}.
      <nuxt-link to="/">Back</nuxt-link>
    </v-alert>
    <v-form
      v-else
      ref="form"
      class="mt-10 mb-5"
      lazy-validation
      @submit.prevent="login"
    >
      <h2
        class="primary--text mb-3"
        style="
          font-family: 'Lexend' !important;
          font-style: normal !important;
          font-weight: 500 !important;
          font-size: 20px !important;
          color: #011d89 !important;
        "
      >
        {{ $t('login1') }}
      </h2>
      <p
        v-if="error"
        class="error--text mb-2 mt-8"
        style="min-height: 18px"
        v-text="error"
      ></p>
      <v-text-field
        v-model="form.username"
        :error="error"
        :label="$t('email')"
        :rules="emailRules"
        background-color="white"
        filled
        required
        @keypress="error = null"
      ></v-text-field>
      <v-text-field
        v-model="form.password"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :error="error"
        :label="$t('password')"
        :rules="passwordRules"
        :type="show ? 'text' : 'password'"
        background-color="white"
        filled
        required
        @keypress="error = null"
        @click:append="show = !show"
      ></v-text-field>
      <v-btn
        :loading="loading"
        block
        class="text-body-2 white--text px-4"
        color="primary"
        depressed
        elevation="0"
        height="45px"
        rounded
        small
        style="
          font-family: 'Lexend' !important;
          font-style: normal !important;
          font-weight: 500 !important;
          font-size: 16px !important;
        "
        type="submit"
        @click="validate"
      >
        {{ $t('login') }}
      </v-btn>
    </v-form>
    <v-alert v-if="messages" color="red" prominent text>
      {{ messages.message }}
    </v-alert>
  </section>
</template>
<script>
export default {
  layout: 'auth',
  auth: false,
  data() {
    return {
      show: false,
      form: {
        username: '',
        password: '',
      },
      error: null,
      loading: false,
      emailRules: [
        (v) => !!v || this.$t('insertMail'),
        (v) => /.+@.+\..+/.test(v) || this.$t('insertValidMail'),
      ],
      passwordRules: [(v) => !!v || this.$t('insertPassword')],
      messages: null,
    }
  },
  head: {
    title: 'Login',
  },
  methods: {
    async login() {
      this.loading = true
      this.messages = false
      try {
        await this.$auth
          .loginWith('local', {
            data: this.form,
          })
          .then(() => {
            this.$router.push({ path: '/' })
          })
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
        this.messages = err.response.data
      }
    },
    validate() {
      this.$refs.form.validate()
    },
  },
}
</script>
