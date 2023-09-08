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
      :user-id="$route.params.user ? $route.params.user.userId : null"
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

export default {
  middleware: ['admin-role'],

  data() {
    const organizationUUID = this.$auth.user.loggedOrganizationUuid
    let form = {}
    if (this.$route.params.user) {
      const role = this.$route.params.user.roles[0].roleName
      form = {
        userEmail: this.$route.params.user.user.email,
        userType: null,
      }
      form.userType = role
      console.log(form)
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
        await API_USERS.init(this.$axios, this.organizationUUID).invite(
          this.form.userEmail,
          this.form.userType
        )
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
        const api = await API_USERS.init(this.$axios, this.organizationUUID)
        const roles = await api.getOrganizationRoles()
        let role = {}
        for (let i = 0; i < roles.length; i++) {
          if (this.form.userType === roles[i].roleName) role = roles[i]
        }
        await api.updateUserRole(userId, role)
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
        await API_USERS.init(this.$axios, this.organizationUUID).delete(userId)
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
