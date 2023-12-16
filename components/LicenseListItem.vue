<template>
  <v-container
    fluid
    style="width: 610px"
    class="white rounded-lg plain-shadow pa-4"
  >
    <v-row>
      <v-col cols="auto">
        <h3 class="blue--text text-h3">{{ $t('entityInfo') }}</h3>
      </v-col>
      <v-spacer v-if="isSuperAdminRole"> </v-spacer>
      <v-col
        v-if="isSuperAdminRole"
        style="display: flex; justify-content: flex-end"
      >
        <v-btn rounded small color="#e6e6eb" elevation="0">
          <img
            class="icon"
            :src="require(`assets/img/icons/Delete.svg`)"
            @click="emitDelete"
          />
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="grey--text mb-1 text-caption">
          {{ $t('license') }}
        </p>
        <p class="body-2 darkGray--text mb-0">{{ license.key }}</p>
      </v-col>
    </v-row>
    <v-row style="margin-bottom: 0px">
      <v-col cols="auto">
        <p class="grey--text mb-1 text-caption">
          {{ $t('start') }}
        </p>
        <p class="body-2 darkGray--text">{{ formatDate(license.startDate) }}</p>
      </v-col>
      <v-col cols="auto">
        <p class="grey--text mb-1 text-caption">
          {{ $t('end') }}
        </p>
        <p class="body-2 darkGray--text">{{ formatDate(license.endDate) }}</p>
      </v-col>
      <v-col cols="auto">
        <p class="grey--text mb-1 text-caption">
          {{ $t('status') }}
        </p>
        <v-row>
          <v-col class="ml-0" cols="auto">
            <p class="body-2 darkGray--text">
              <v-badge
                dot
                inline
                :color="license.enabled && license.active ? 'green' : 'red'"
              ></v-badge>
              {{
                license.enabled && license.active
                  ? $t('productActive')
                  : $t('licenseInactive')
              }}
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    license: {
      type: Object,
      default: () => ({}),
    },
    organization: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    emitDelete() {
      this.$emit('delete', this.license)
    },
    formatDate(date) {
      if (!date) return null

      const [year, day, month] = date.split('-')
      return `${month}-${day}-${year}`
    },
  },
}
</script>
