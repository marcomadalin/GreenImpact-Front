<template>
  <v-row no-gutters>
    <v-col>
      <v-avatar size="35" color="white">
        <status-circle :status="status" :size-avatar="26" />
      </v-avatar>
    </v-col>
    <v-col cols="auto">
      <v-avatar size="35" color="white">
        <trend-circle :trend="trend" :size-avatar="26" />
      </v-avatar>
    </v-col>
  </v-row>
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
      default: '#2BB8C8',
    },
  },
  computed: {
    status() {
      return this.value ? this.value.status : 'NO_STATUS'
    },
    trend() {
      return this.value ? this.value.trend : 'FLAT'
    },
  },
}
</script>
