<template>
  <v-container>
    <h1 class="primary--text">
      {{ $t('newLicense') }}
    </h1>
    <v-stepper
      v-model="step"
      vertical
      elevation="0"
      class="transparent mb-0 pb-0"
    >
      <v-stepper-step step="1" editable>
        {{ $t('selectEntityProducts') }}
      </v-stepper-step>
      <v-stepper-content step="1" editable>
        <v-select
          v-model="selectedProducts"
          clearable
          multiple
          :items="entityProducts"
          filled
          :label="$t('entityProducts')"
          item-text="name"
          return-object
        />
        <step-buttons-group @next="step = 2" @cancel="returnListPage" />
      </v-stepper-content>
      <v-stepper-step step="2" editable>
        {{ $t('licenseDate') }}
      </v-stepper-step>
      <v-stepper-content step="2" editable>
        <v-row class="mb-2">
          <v-col cols="12" lg="6">
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="license.startDate"
                  :label="$t('startDate')"
                  hint="DD-MM-YYYY"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  filled
                  shaped
                  required
                  background-color="white"
                  @blur="startDate = parseDate(license.startDate)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                :first-day-of-week="1"
                :locale="$auth.user.locale"
                no-title
                @change="license.startDate = formatDate(startDate)"
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" lg="6">
            <v-menu
              ref="menu2"
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="license.endDate"
                  :label="$t('endDate')"
                  hint="DD-MM-YYYY"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  filled
                  shaped
                  required
                  background-color="white"
                  @blur="endDate = parseDate(license.endDate)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="endDate"
                :first-day-of-week="1"
                :locale="$auth.user.locale"
                no-title
                @change="license.endDate = formatDate(endDate)"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <step-buttons-group
          continue-color="primary"
          continue-class="white text-body-2"
          :continue-title="$t('createLicense')"
          @next="createLicense"
          @cancel="returnListPage"
        />
      </v-stepper-content>
    </v-stepper>

    <v-snackbar
      v-model="ok"
      style="margin-top: 70px"
      color="#12BB6A"
      min-width="0px"
      :top="true"
      fixed
      timeout="1500"
    >
      <v-icon>mdi-check-circle-outline</v-icon>
      <span class="ml-3">{{ $t('licenseAdded') }}</span>
    </v-snackbar>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import API_PRODUCTS from '~/api/products'
import StepButtonsGroup from '~/components/StepButtonsGroup.vue'

export default {
  components: { StepButtonsGroup },
  middleware: ['super-admin-role'],

  data() {
    const license = {
      id: null,
      organizationId: this.$route.params.uuid,
      key: null,
      startDate: null,
      endDate: null,
      enabled: true,
      active: true,
      products: [],
    }
    return {
      step: 1,
      license,
      entityProducts: [],
      selectedProducts: [],
      dialog: false,
      ok: null,
      overlay: false,
      menu1: false,
      menu2: false,
      startDate: new Date().toJSON().slice(0, 10),
      endDate: new Date().toJSON().slice(0, 10),
    }
  },
  async beforeMount() {
    try {
      this.entityProducts = await API_PRODUCTS.init(
        this.$axios
      ).getAllProducts()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async createLicense() {
      this.overlay = true
      try {
        this.license.startDate = this.parseDate(this.license.startDate)
        this.license.endDate = this.parseDate(this.license.endDate)
        for (let i = 0; i < this.selectedProducts.length; ++i) {
          this.license.products.push(this.selectedProducts[i])
        }
        console.log(this.license)
        await API_PRODUCTS.init(this.$axios).createLicense(this.license)
        this.overlay = false
        this.ok = true
        setTimeout(() => this.returnListPage(), 1500)
      } catch (e) {
        console.log(e)
        this.overlay = false
      }
    },
    async returnListPage() {
      await this.$router.push({
        name: 'entity-license',
        params: {
          uuid: this.$route.params.uuid,
          entity: this.$route.params.entity,
        },
      })
    },
    formatDate(date) {
      if (!date) return null

      const [year, day, month] = date.split('-')
      return `${month}-${day}-${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [day, month, year] = date.split('-')
      return `${year}-${month}-${day}`
    },
  },
}
</script>
