import Vue from 'vue'
import { products } from '~/constants'

Vue.mixin({
  computed: {
    hasBase() {
      return (
        this.$auth.user &&
        this.$auth.user.productAcronyms.includes(products.BASE)
      )
    },
    hasMa2030() {
      return (
        this.$auth.user &&
        this.$auth.user.productAcronyms.includes(products.MA2030)
      )
    },
    hasReports() {
      return (
        this.$auth.user &&
        this.$auth.user.productAcronyms.includes(products.REPORT)
      )
    },
    hasSocial() {
      return (
        this.$auth.user &&
        this.$auth.user.productAcronyms.includes(products.SOCIAL)
      )
    },

    hasDecarb() {
      return (
        this.$auth.user &&
        this.$auth.user.productAcronyms.includes(products.DECARB)
      )
    },

    hasTaxonomy() {
      return (
        this.$auth.user &&
        this.$auth.user.productAcronyms.includes(products.TAXONOMY)
      )
    },

    hasFeder() {
      return (
        this.$auth.user &&
        this.$auth.user.productAcronyms.includes(products.FEDER)
      )
    },

    hasFiise() {
      return (
        this.$auth.user &&
        'productAcronyms' in this.$auth.user &&
        this.$auth.user.productAcronyms.includes(products.FIISE)
      )
    },

    hasLogbook() {
      return (
        this.$auth.user &&
        'productAcronyms' in this.$auth.user &&
        this.$auth.user.productAcronyms.includes(products.LOGBOOK)
      )
    },
  },
})
