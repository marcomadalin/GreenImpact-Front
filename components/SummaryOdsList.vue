<template>
  <v-container
    rounded
    class="white rounded-lg plain-shadow raised-shadow-hover"
    :style="
      selected
        ? 'box-shadow: 0px 0px 8px rgba(50, 51, 193, 0.28) !important'
        : ''
    "
  >
    <v-card
      width="100px"
      height="auto"
      rounded="0"
      flat
      :ripple="false"
      class="pa-0"
    >
      <v-img
        :src="
          require(`/assets/img/sdg/${ods.dtoReference.theOne.levelN_ItemId}-${getLocale}SDG.png`)
        "
        aspect-ratio="1"
        height="100%"
        weight="100%"
      />
      <div class="ods-icon-position">
        <v-avatar size="24" color="white" class="ods-icon-status">
          <status-circle
            :dir="null"
            :status="ods.status"
            :size-avatar="20"
            :can-open-dialog="false"
          >
          </status-circle>
        </v-avatar>
        <v-avatar size="24" color="white" class="ods-icon-trend">
          <trend-circle
            :dir="null"
            :trend="ods.trend"
            :size="14"
            :size-avatar="20"
            :tooltip="true"
          >
          </trend-circle>
        </v-avatar>
      </div>
    </v-card>
    <v-container class="mx-0 px-0 mt-2 mb-0 pb-0">
      <div class="text-caption secondary--text">
        <v-progress-linear
          :value="ods.progress"
          background-color="lightGray"
          color="teal"
          height="12"
          rounded
        ></v-progress-linear>
      </div>
      <div class="text-caption secondary--text align-top mt-1">
        {{ ods.progress }} %
      </div>
    </v-container>
  </v-container>
  <!--
  <v-col>
    <v-card
      max-width="80px"
      max-height="80px"
      rounded="0"
      flat
      :ripple="false"
      style="cursor: pointer"
    >
      <v-img
        :src="
          require(`/assets/img/sdg/${ods.dtoReference.theOne.levelN_ItemId}-ESSDG.png`)
        "
        aspect-ratio="1"
        height="100"
      />
    </v-card>
  </v-col>
-->
  <!--
              <v-avatar size="20" color="white" class="ods-icon-abs-left">
                <status-circle
                  :dir="null"
                  :style="'position: absolute; bottom: 2px;'"
                  :status="goal.status"
                  :size-avatar="16"
                  :can-open-dialog="false"
                >
                </status-circle>
              </v-avatar>
              <v-avatar size="20" color="white" class="ods-icon-abs">
                <trend-circle
                  :dir="null"
                  :style="'position: absolute; bottom: 2px;'"
                  :trend="goal.trend"
                  :size="10"
                  :size-avatar="16"
                  :tooltip="true"
                >
                </trend-circle>
              </v-avatar>
              <div
                v-if="goal.info.id === goalSelected || goalHover == goal.info.id"
                class="mt-3"
                :style="
                  'background-color: ' +
                  goal.info.color +
                  '; height: 2px; margin-top; top: -5px; width: 80px; position: absolute;'
                "
              ></div>
              -->
  <!-- end element ods -->
</template>

<script>
export default {
  name: 'SummaryListItem',
  props: {
    ods: {
      type: Object,
      default: () => ({}),
    },
    selected: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    getLocale() {
      if (this.$auth.user.locale) return this.$auth.user.locale.toUpperCase()
      else return 'EN'
    },
  },
}
</script>

<style scoped>
.ods-icon-status {
  position: absolute;
  bottom: -10px;
  right: 16px;
}
.ods-icon-trend {
  position: absolute;
  bottom: -10px;
  right: -8px;
}
</style>
