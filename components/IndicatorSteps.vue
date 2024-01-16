<template>
  <div>
    <v-stepper v-model="step" vertical elevation="0" class="transparent">
      <v-stepper-step step="1" editable>
        {{ $t('insertIndicatorName') }}
      </v-stepper-step>
      <v-stepper-content step="1" editable>
        <v-text-field
          v-model="form.name"
          filled
          shaped
          required
          background-color="white"
          :label="$t('indicatorName')"
          :rules="[(v) => !!v || $t('requiredField')]"
          @change="formNameBad = !form.name"
        />
        <step-buttons-group @next="step = 2" @cancel="$emit('cancel')" />
      </v-stepper-content>

      <v-stepper-step step="2" editable>
        {{ $t('selectIndicatorType') }}
      </v-stepper-step>
      <v-stepper-content step="2" editable>
        <v-container class="ml-1" fluid>
          <v-radio-group v-model="form.type">
            <v-radio
              v-for="item in dimensionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </v-radio-group>
        </v-container>
        <div v-if="showQualitative">
          <v-select
            id="qualitative"
            v-model="form.measure"
            :items="qualitativeMeasures"
            :item-text="(item) => item.name"
            :item-value="(item) => item"
            :label="$t('qualiType')"
            filled
            auto-select-first
          />
        </div>
        <div v-else>
          <v-select
            id="quantitativeMeasurementUnit"
            v-model="form.measure"
            :items="quantitativeMeasures"
            :item-text="(item) => item.name + ' - ' + item.values[0]"
            :item-value="(item) => item"
            :label="$t('measureUnit')"
            filled
            auto-select-first
          />
        </div>
        <step-buttons-group @next="step = 3" @cancel="step = 1" />
      </v-stepper-content>
      <v-stepper-step step="3" editable>
        {{ $t('selectODS') }}
      </v-stepper-step>
      <v-stepper-content step="3" editable>
        <v-row>
          <v-col md="8">
            <v-select
              v-model="form.impact"
              clearable
              multiple
              :items="impact"
              item-text="name"
              item-value="number"
            />
          </v-col>
        </v-row>
        <v-col class="mx-0 px-0">
          <v-row v-if="!form.id" class="mx-0 px-0" style="margin-top: 20px">
            <v-btn
              :disabled="formNameBad"
              rounded
              depressed
              elevation="0"
              color="primary"
              class="text-body-2 white--text"
              @click="$emit('create')"
            >
              {{ $t('createIndicator') }}
            </v-btn>

            <v-btn
              rounded
              depressed
              elevation="0"
              class="text-body-2"
              @click="$emit('cancel')"
            >
              {{ $t('cancel') }}
            </v-btn>
          </v-row>
        </v-col>
      </v-stepper-content>
    </v-stepper>

    <div class="ml-6">
      <step-buttons-group
        v-if="form.indicatorUUID"
        :continue-title="$t('updateIndicador')"
        continue-color="primary"
        continue-class="white text-body-2"
        @next="$emit('update')"
        @cancel="$emit('cancel')"
      />
    </div>
  </div>
</template>

<script>
import { SDG } from '~/constants/utils.js'
import StepButtonsGroup from '~/components/StepButtonsGroup.vue'

export default {
  components: { StepButtonsGroup },
  props: {
    munits: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const qualitativeMeasures = this.munits.filter(
      (unit) => unit.type === 'QUALITATIVE'
    )
    const quantitativeMeasures = this.munits.filter(
      (unit) => unit.type === 'QUANTITATIVE'
    )
    return {
      impact: SDG,
      qualitativeMeasures,
      quantitativeMeasures,
      step: 1,
      formNameBad: true,
      form: {
        id: this.value.id || null,
        organizationId: this.$auth.user.loggedOrganization.id || null,
        name: this.value.name || null,
        measure: null,
        type: this.value.type || null,
        framework: this.value.framework || 'CUSTOM',
        impact: this.value.impact || [],
      },
    }
  },

  computed: {
    showQualitative() {
      return this.form.type === 'QUALITATIVE'
    },
    dimensionList() {
      return [
        { label: this.$t('QUANTITATIVE'), value: 'QUANTITATIVE' },
        { label: this.$t('QUALITATIVE'), value: 'QUALITATIVE' },
      ]
    },
  },

  watch: {
    form: {
      handler(value) {
        const input = {
          id: this.form.id || null,
          organizationId: this.form.organizationId || null,
          name: this.form.name || null,
          measure: this.form.measure || null,
          type: this.form.type || null,
          framework: this.form.framework || 'CUSTOM',
          impact: this.form.impact || [],
        }

        this.$emit('input', input)
      },
      deep: true,
    },
  },
}
</script>
