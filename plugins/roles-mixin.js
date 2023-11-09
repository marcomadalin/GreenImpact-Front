import Vue from 'vue'
import { roles } from '~/constants'

Vue.mixin({
  computed: {
    isSuperAdminRole() {
      return this.$auth.user && this.$auth.user.role === roles.SUPER_ADMIN
    },

    isAdminRole() {
      return this.$auth.user && this.$auth.user.role === roles.ADMIN
    },

    isEditorRole() {
      return this.$auth.user && this.$auth.user.role === roles.EDITOR
    },

    isUserRole() {
      return this.$auth.user && this.$auth.user.role === roles.USER
    },
  },
})
