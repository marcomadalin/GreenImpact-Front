<template>
  <v-container>
    <h1
      class="primary--text blue--text text-h1"
      style="
        font-family: 'Lexend' !important;
        font-style: normal !important;
        font-weight: 500 !important;
        font-size: 28px !important;
      "
    >
      {{ $route.params.user ? $t('editUser') : $t('newUser') }}
    </h1>
    <user-steps
      v-model="form"
      :user-id="$route.params.user ? $route.params.user.id : null"
      @create="sendMail"
      @update="updateUser"
      @remove="deleteUser"
      @cancel="
        $router.push({
          name: 'user-list',
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
      <span class="ml-3">{{ $t(successText) }}</span>
    </v-snackbar>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import API_USERS from '~/api/users'
import API_ORGANIZATIONS from '~/api/organizations'

export default {
  middleware: ['admin-role'],

  data() {
    const organizationUUID = this.$auth.user.loggedOrganization.id
    let form = {}
    if (this.$route.params.user) {
      form = {
        id: this.$route.params.user.id,
        name: this.$route.params.user.name || null,
        surname: this.$route.params.user.surname || null,
        phoneNumber: this.$route.params.user.phoneNumber || null,
        username: this.$route.params.user.username || null,
        role: this.$route.params.user.role || null,
        loggedOrganization: this.$route.params.user.loggedOrganization,
        password: this.$route.params.user.password,
        locale: this.$route.params.user.locale,
        membershipDate: this.$route.params.user.membershipDate,
        enabled: this.$route.params.user.enabled,
      }
    }
    return {
      organizationUUID,
      form,
      ok: null,
      overlay: false,
      successText: '',
    }
  },
  methods: {
    async sendMail() {
      this.overlay = true
      try {
        await API_USERS.init(this.$axios).createUser(this.form)
        this.overlay = false
        this.successText = 'inviteSent'
        this.ok = true
        setTimeout(async () => {
          await this.$router.push({ name: 'user-list' })
        }, 1500)
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },
    async updateUser(userId) {
      this.overlay = true
      try {
        console.log(this.form)
        await API_USERS.init(this.$axios).updateUser(userId, this.form)
        this.overlay = false
        this.successText = 'userUpdated'
        this.ok = true
        setTimeout(async () => {
          await this.$router.push({ name: 'user-list' })
        }, 1500)
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },
    async deleteUser(userId) {
      this.overlay = true
      try {
        await API_ORGANIZATIONS.init(this.$axios).removeUser(
          this.$auth.user.loggedOrganization.id,
          userId
        )
        this.overlay = false
        this.successText = 'userDeleted'
        this.ok = true
        setTimeout(async () => {
          await this.$router.push({ name: 'user-list' })
        }, 1500)
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },
  },
}
</script>
