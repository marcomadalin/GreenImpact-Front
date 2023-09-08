<template>
  <div>
    <v-stepper v-model="step" vertical elevation="0" class="transparent">
      <v-stepper-step step="1" editable>
        {{ $t('insertIndicatorName') }}
      </v-stepper-step>
      <v-stepper-content step="1" editable>
        <v-text-field
          v-model="form.indicatorName"
          filled
          shaped
          required
          background-color="white"
          :label="$t('indicatorName')"
          :rules="[(v) => !!v || $t('requiredField')]"
          @change="formNameBad = !form.indicatorName"
        />
        <step-buttons-group @next="step = 2" @cancel="$emit('cancel')" />
      </v-stepper-content>

      <v-stepper-step step="2" editable>
        {{ $t('selectIndicatorType') }}
      </v-stepper-step>
      <v-stepper-content step="2" editable>
        <v-container class="ml-1" fluid>
          <v-radio-group v-model="form.indicatorType">
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
            v-model="form.qualitativeType"
            :items="qualtypes"
            :item-text="(item) => item.qualitativeTypeName"
            :item-value="(item) => item"
            :label="$t('qualiType')"
            filled
            auto-select-first
          />
        </div>
        <!-- quantitative indicator -->
        <div v-else>
          <v-select
            id="quantitativeMeasurementUnit"
            v-model="form.quantitativeMeasurementUnit"
            :items="munits"
            :item-text="
              (item) =>
                item.quantitativeMeasurementUnitName +
                ' - ' +
                item.quantitativeMeasurementUnit
            "
            :item-value="(item) => item"
            :label="$t('measureUnit')"
            filled
            auto-select-first
          />
        </div>
        <!-- dimensional indicator -->
        <div v-if="showDimensional">
          <v-select
            id="dimensionalType"
            v-model="form.dimensionalType"
            :items="dtypes"
            :item-text="(item) => item.dimensionTypeName"
            :item-value="(item) => item"
            :label="$t('dimType')"
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
              v-model="form.indicatorLevel"
              clearable
              multiple
              :items="odsnonstandardlist"
              item-text="levelN_ItemName"
              item-value="levelN_ItemId"
            />
          </v-col>
        </v-row>
        <v-col class="mx-0 px-0">
          <v-row
            v-if="!form.indicatorUUID"
            class="mx-0 px-0"
            style="margin-top: 20px"
          >
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
import StepButtonsGroup from '~/components/StepButtonsGroup.vue'

export default {
  components: { StepButtonsGroup },
  props: {
    munits: {
      type: Array,
      default: () => [],
    },
    dtypes: {
      type: Array,
      default: () => [],
    },
    qualtypes: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    odsnonstandardlist: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      step: 1,
      formNameBad: true,
      form: {
        qualitativeType: null,
        quantitativeMeasurementUnit: null,
        dimensionalType: null,
        dimension: this.value.dimension || null,
        indicatorUUID: this.value.indicatorUUID || null,
        indicatorName: this.value.indicatorName || null,
        indicatorLevel: null,
      },
    }
  },

  computed: {
    showQuantitative() {
      return this.form.indicatorType === 'QUANTITATIVE'
    },
    showDimensional() {
      return this.form.indicatorType === 'QUANTITATIVE_DIMENSIONAL'
    },
    showQualitative() {
      return this.form.indicatorType === 'QUALITATIVE'
    },
    dimensionList() {
      return [
        { label: this.$t('QUANTITATIVE'), value: 'QUANTITATIVE' },
        {
          label: this.$t('QUANTITATIVE_DIMENSIONAL'),
          value: 'QUANTITATIVE_DIMENSIONAL',
        },
        { label: this.$t('QUALITATIVE'), value: 'QUALITATIVE' },
      ]
    },
  },

  watch: {
    form: {
      handler(value) {
        let input = {
          indicatorName: value.indicatorName,
          indicatorDTOType: value.indicatorType,
          indicatorType: value.indicatorType,
          indicatorLevel: value.indicatorLevel,
        }

        if (value.indicatorType === 'QUALITATIVE') {
          input = {
            ...input,
            qualitativeTypeDTO: value.qualitativeType,
          }
        }

        if (value.indicatorType === 'QUANTITATIVE') {
          input = {
            ...input,
            quantitativeMeasurementUnitDTO: value.quantitativeMeasurementUnit,
          }
        }

        if (value.indicatorType === 'QUANTITATIVE_DIMENSIONAL') {
          input = {
            ...input,
            quantitativeMeasurementUnitDTO: value.quantitativeMeasurementUnit,
            dimensionalType: value.dimensionalType,
          }
        }

        this.$emit('input', input)
      },
      deep: true,
    },
  },
}
</script>
