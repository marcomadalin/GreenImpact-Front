<template>
  <v-tooltip
    bottom
    :disabled="logbook !== null && (!logbook.logBookEnabled || entity !== null)"
  >
    <template #activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <log-book-bottom-sheet
          :logbook="logbook"
          :entity="entity"
          :plan="plan"
          :area="area"
          :indicator="indicator"
          :edit="edit"
        ></log-book-bottom-sheet>
      </div>
    </template>
    <div class="py-1 text-body-2 white--text">{{ $t('viewLogbook') }}</div>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    logbook: {
      type: Object,
      default: null,
    },
    entity: {
      type: Object,
      default: null,
    },
    plan: {
      type: Object,
      default: null,
    },
    area: {
      type: Object,
      default: null,
    },
    indicator: {
      type: Object,
      default: null,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.v-tooltip__content {
  background-color: rgba(6, 6, 50, 0.85) !important;
}
</style>
