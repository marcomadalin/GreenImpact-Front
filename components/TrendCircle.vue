<template>
  <section>
    <v-tooltip bottom color="#060632">
      <template #activator="{ on, attrs }">
        <div :style="dir" v-bind="attrs" v-on="on">
          <v-avatar :style="styles" :size="sizeAvatar" color="primary"
            ><v-icon small color="white">{{ getIcon(trend) }}</v-icon></v-avatar
          >
        </div>
      </template>
      <div class="pa-1 ma-0">
        <div
          v-for="([icon, text], i) in tooltipIcons"
          :key="i"
          class="d-flex justify-start my-1 align-center"
        >
          <v-avatar :style="styles" :size="18" color="#3233c1" class="mr-2">
            <v-icon small color="white">{{ icon }}</v-icon>
          </v-avatar>
          <span
            style="
              font-size: 15px !important;
              font-family: 'Inter' !important;
              font-style: normal !important;
              font-weight: 400 !important;
            "
            >{{ text }}</span
          >
        </div>
      </div>
    </v-tooltip>
  </section>
</template>
<script>
export default {
  props: {
    trend: {
      type: String,
      default: 'bad',
    },
    size: {
      type: Number,
      default: 16,
    },
    sizeAvatar: {
      type: Number,
      default: 28,
    },
    dir: {
      type: String,
      default: 'float: right;',
    },
    styles: {
      type: String,
      default: null,
    },
  },
  computed: {
    tooltipIcons() {
      return [
        ['mdi-arrow-top-right', this.$t('up')],
        ['mdi-arrow-right', this.$t('side')],
        ['mdi-arrow-bottom-right', this.$t('down')],
      ]
    },
  },
  methods: {
    getIcon(trend) {
      switch (trend) {
        case 'IMPROVING':
          return 'mdi-arrow-top-right'
        case 'FLAT':
          return 'mdi-arrow-right'
        case 'NOT_IMPROVING':
          return 'mdi-arrow-bottom-right'
        case '':
          return false
      }
    },
  },
}
</script>
<style lang="scss">
.v-tooltip__content {
  border-radius: 8px !important;
}
</style>
