<template>
  <section>
    <v-tooltip bottom color="#060632">
      <template #activator="{ on, attrs }">
        <div :style="dir" v-bind="attrs" v-on="on">
          <v-avatar :size="sizeAvatar" :color="getBgClassIndicator(status)" />
        </div>
      </template>
      <div class="pa-1 ma-0">
        <div
          v-for="([color, text], i) in tooltipIcons"
          :key="i"
          class="d-flex justify-start my-1 align-center"
        >
          <v-avatar :size="18" :color="color" class="mr-2"> </v-avatar>
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
    status: {
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
        ['#12BB6A', this.$t('positive')],
        ['#EFC222', this.$t('normal')],
        ['#F8003B', this.$t('negative')],
        ['#C1C1C1', this.$t('none')],
      ]
    },
  },
  methods: {
    getBgClassIndicator(indicator) {
      switch (indicator) {
        case 'GREEN':
          return '#12BB6A'
        case 'YELLOW':
          return '#EFC222'
        case 'RED':
          return '#F8003B'
        case 'NO_STATUS':
          return '#C1C1C1'
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
