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
        filled
        background-color="white"
        :rules="emailRules"
        :label="$t('email')"
        required
        :error="error"
        @keypress="error = null"
      ></v-text-field>
      <v-text-field
        v-model="form.password"
        :rules="passwordRules"
        filled
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show ? 'text' : 'password'"
        background-color="white"
        :label="$t('password')"
        required
        :error="error"
        @click:append="show = !show"
        @keypress="error = null"
      ></v-text-field>
      <v-btn
        block
        height="45px"
        small
        rounded
        depressed
        type="submit"
        elevation="0"
        color="primary"
        :loading="loading"
        class="text-body-2 white--text px-4"
        style="
          font-family: 'Lexend' !important;
          font-style: normal !important;
          font-weight: 500 !important;
          font-size: 16px !important;
        "
        @click="validate"
      >
        {{ $t('login') }}
      </v-btn>
    </v-form>
    <v-alert v-if="messages" text prominent color="red">
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
      } catch (err) {
        this.loading = false
        this.messages = err.response.data
        console.log(err.response)
      }
    },
    validate() {
      this.$refs.form.validate()
    },
  },
}
</script>
