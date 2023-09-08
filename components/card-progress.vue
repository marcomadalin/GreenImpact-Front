<template>
  <div>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col>
          <div class="text-caption secondary--text">
            <v-progress-linear
              :value="progress"
              background-color="lightGray"
              :color="color"
              height="8"
              rounded
            ></v-progress-linear>
          </div>
          <div class="text-caption grey--text align-top mt-1">
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
    progress() {
      return this.value ? this.value.progress : 0
    },
  },
}
</script>
