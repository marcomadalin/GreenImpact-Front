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
          $t('insertEmail')
        }}</v-stepper-step>
        <v-stepper-content step="1" editable>
          <v-text-field
            v-model="form.userEmail"
            :disabled="userId !== null"
            :rules="emailRules"
            filled
            shaped
            required
            background-color="white"
            :label="form.userEmail ? '' : $t('email') + '*'"
            @change="
              wrongMail = !(
                !!form.userEmail && /.+@.+\..+/.test(form.userEmail)
              )
            "
          />
          <step-buttons-group @next="step = 2" @cancel="$emit('cancel')" />
        </v-stepper-content>

        <v-stepper-step step="2" editable>
          {{ $t('insertRole') }}
        </v-stepper-step>
        <v-stepper-content step="2" editable>
          <v-container class="mt-0 pt-0" fluid>
            <v-radio-group v-model="form.userType" class="mt-0 pt-4">
              <v-radio
                v-for="item in dimensionList"
                :key="item.value"
                class="mt-0 pt-0"
                :label="item.label"
                :value="item.value"
              />
            </v-radio-group>
            <v-row class="mx-0 px-0" style="margin-top: 20px">
              <v-btn
                :disabled="userId === null && wrongMail"
                rounded
                depressed
                elevation="0"
                color="primary"
                class="text-body-2 white--text"
                @click="userId ? $emit('update', userId) : $emit('create')"
              >
                {{ userId ? $t('updateUser') : $t('invite') }}
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
          </v-container>
        </v-stepper-content>
      </v-stepper>
    </div>
    <div v-if="userId" class="ml-6 mt-0 pt-0">
      <v-alert outlined color="red" class="mt-12">
        <p class="text-h6 mb-0">{{ $t('dangerZone') }}</p>
        <p class="black--text">
          {{ $t('deleteUserText') }}
        </p>
        <v-btn
          rounded
          depressed
          elevation="0"
          color="red"
          class="text-body-2 white--text"
          @click="dialog = true"
        >
          {{ $t('deleteUser') }}
        </v-btn>
        <remove-dialog
          v-model="dialog"
          :title="$t('deleteUserTitleDialog')"
          :confirm="$t('deleteUser')"
          @delete="$emit('remove', userId)"
        ></remove-dialog>
      </v-alert>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userId: {
      type: Number,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      emailRules: [
        (v) => !!v || this.$t('insertMail'),
        (v) => /.+@.+\..+/.test(v) || this.$t('insertValidMail'),
      ],
      step: 1,
      form: {
        userEmail: this.value.userEmail || null,
        userType: this.value.userType || null,
      },
      dialog: false,
      wrongMail: true,
    }
  },

  computed: {
    dimensionList() {
      return [
        { label: this.$t('administrator'), value: 'ADMIN' },
        { label: this.$t('editor'), value: 'EDITOR' },
        { label: this.$t('user'), value: 'USER' },
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
