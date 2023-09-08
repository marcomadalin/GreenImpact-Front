<template>
  <section>
    <v-tooltip top color="#060632">
      <template #activator="{ on, attrs }">
        <v-chip
          small
          :ripple="false"
          v-bind="attrs"
          color="#060632FF"
          class="text-center d-flex justify-center pa-0 ma-0"
          style="
            height: 28px;
            width: 28px;
            border-radius: 0;
            background-color: rgba(50, 51, 193, 0.85);
          "
          v-on="on"
        >
          <v-icon color="white">mdi-plus</v-icon>
        </v-chip>
      </template>
      <div
        class="py-1"
        style="max-width: 200px; margin-bottom: -2px; margin-right: -5px"
      >
        <p
          class="text-body-1 whiteText"
          style="
            font-family: 'Inter' !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 12px !important;
            margin-bottom: 5px !important;
          "
        >
          {{ $t('odsText') }}
        </p>
        <v-row no-gutters class="mb-0 pb-0">
          <v-col
            v-for="(item, i) in impact"
            :key="i"
            cols="auto"
            class="pr-1 pb-0 mb-0"
          >
            <div>
              <v-chip
                small
                :ripple="false"
                color="white"
                class="text-center d-flex justify-center pa-0 ma-0 mb-2"
                style="height: 28px; width: 28px; border-radius: 0"
              >
                <span>
                  <v-img
                    :src="
                      require(`/assets/img/sdg/small/ico-ODS-${item.dtoReference.theOne.levelN_ItemId}.svg`)
                    "
                    width="28"
                    height="28"
                  />
                </span>
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-tooltip>
  </section>
</template>
<script>
export default {
  props: {
    impact: {
      type: Array,
      default: null,
    },
  },
}
</script>
<style lang="scss">
.v-tooltip__content {
  background-color: rgba(6, 6, 50, 0.85) !important;
}
</style>
