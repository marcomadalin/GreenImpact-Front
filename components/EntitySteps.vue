<template>
  <div>
    <div class="mb-0 pb-0">
      <v-stepper
        v-model="step"
        vertical
        elevation="0"
        class="transparent mb-0 pb-0"
      >
        <v-stepper-step step="1" editable>{{
          $t('insertNameEntity')
        }}</v-stepper-step>
        <v-stepper-content step="1" editable>
          <v-text-field
            v-model="form.organizationName"
            filled
            shaped
            required
            background-color="white"
            :label="form.organizationName ? '' : $t('name')"
          />
          <step-buttons-group @next="step = 2" @cancel="$emit('cancel')" />
        </v-stepper-content>

        <v-stepper-step step="2" editable>
          {{ $t('selectEntityType') }}
        </v-stepper-step>
        <v-stepper-content step="2" editable>
          <v-container class="mt-0 pt-0" fluid>
            <v-radio-group v-model="form.organizationBack2BluType">
              <v-radio
                v-for="(item, i) in entityTypeList"
                :key="i"
                :label="$t(item)"
                :value="item"
              ></v-radio>
            </v-radio-group>
          </v-container>
          <step-buttons-group
            continue-color="primary"
            continue-class="white text-body-2"
            :continue-title="uuid ? $t('updateEntity') : $t('createEntity')"
            @next="uuid ? $emit('update', uuid) : $emit('create')"
            @cancel="$emit('cancel')"
          />
        </v-stepper-content>
      </v-stepper>
    </div>
    <div v-if="uuid" class="ml-6 mt-0 pt-0">
      <v-alert outlined color="red" class="mt-12">
        <p class="text-h6 mb-0">{{ $t('dangerZone') }}</p>
        <p class="black--text">
          {{ $t('deleteEntityText') }}
        </p>
        <v-btn
          small
          rounded
          elevation="0"
          color="red"
          class="white--text"
          @click="dialog = true"
        >
          {{ $t('deleteEntity') }}
        </v-btn>
        <generic-remove-dialog
          v-model="dialog"
          :title="$t('sureEntity')"
          :text="$t('sureEntity')"
          :continue-title="$t('irreversibleAction')"
          @remove-action="$emit('remove', uuid)"
        />
      </v-alert>
    </div>
  </div>
</template>

<script>
import StepButtonsGroup from '~/components/StepButtonsGroup.vue'
import GenericRemoveDialog from '~/components/GenericRemoveDialog.vue'

export default {
  components: { GenericRemoveDialog, StepButtonsGroup },
  props: {
    uuid: {
      type: String,
      default: () => null,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      step: 1,
      form: {
        organizationName: this.value.organizationName || '',
        organizationBack2BluType:
          this.value.organizationBack2BluType || 'SYS_MASTER',
      },
      dialog: false,
    }
  },

  computed: {
    entityTypeList() {
      return [
        'SYS_MASTER',
        'SYS_CLUSTER_MASTER',
        'SYS_CLUSTER_ENTITY',
        'SYS_SUSTAINABLE_ENTITY',
      ]
    },
  },

  watch: {
    form: {
      handler(value) {
        this.$emit('input', value)
      },
      deep: true,
    },
  },
}
</script>
