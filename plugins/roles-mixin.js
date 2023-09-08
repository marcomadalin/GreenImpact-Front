import Vue from 'vue'
import { roles } from '~/constants'

Vue.mixin({
  computed: {
    isSuperAdminRole() {
      return (
        this.$auth.user && this.$auth.user.roles.includes(roles.SUPER_ADMIN)
      )
    },

    isAdminRole() {
      // return this.$auth.user && this.$auth.user.roles.includes(roles.ADMIN)
      return this.$auth.user && this.$auth.user.roles.includes(roles.ADMIN)
    },

    isEditorRole() {
      return this.$auth.user && this.$auth.user.roles.includes(roles.EDITOR)
    },

    isUserRole() {
      return this.$auth.user && this.$auth.user.roles.includes(roles.USER)
    },
  },
})
