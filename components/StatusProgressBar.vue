<template>
  <div>
    <v-container fluid class="white lighten-5 pa-0">
      <v-row no-gutters>
        <v-col cols="auto" class="pr-2">
          <v-avatar size="24" color="white" class="status-bullet">
            <status-circle :status="status" :size-avatar="24" />
          </v-avatar>
          <v-avatar size="24" color="white" class="trend-bullet">
            <trend-circle :trend="trend" :size-avatar="24" />
          </v-avatar>
        </v-col>
        <v-col>
          <div class="text-caption secondary--text">
            <v-progress-linear
              :value="progress"
              :color="color"
              background-color="lightGray"
              height="8"
              rounded
            ></v-progress-linear>
          </div>
          <div class="text-caption darkBlue--text align-top mt-1">
            {{ progress }} %
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    color: {
      type: [String, Array, Object],
      default: 'teal',
    },
  },
  computed: {
    status() {
      return this.value ? this.value.status : 'NO_STATUS'
    },
    trend() {
      return this.value ? this.value.trend : 'FLAT'
    },
    progress() {
      return this.value ? this.value.progress : 0
    },
  },
}
</script>
