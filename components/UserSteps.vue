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
            v-model="form.username"
            :disabled="userId !== null"
            :rules="emailRules"
            filled
            shaped
            required
            background-color="white"
            :label="form.username ? '' : $t('email') + '*'"
            @change="
              wrongMail = !(!!form.username && /.+@.+\..+/.test(form.username))
            "
          />
          <step-buttons-group @next="step = 2" @cancel="$emit('cancel')" />
        </v-stepper-content>
        <!--
        <v-stepper-step step="2" editable>{{
          $t('insertPassIn')
        }}</v-stepper-step>
        <v-stepper-content step="2" editable>
          <v-text-field
            v-model="form.password"
            :rules="passwordRules"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            filled
            background-color="white"
            :label="$t('password')"
            required
            :error="error"
            @click:append="show1 = !show1"
            @keypress="error = null"
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            :rules="passwordConfirmRules"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            filled
            background-color="white"
            :label="$t('repeatPassword')"
            required
            :error="error"
            @click:append="show2 = !show2"
            @keypress="error = null"
            @change="
              passwordNotMatch = !(
                !!confirmPassword && confirmPassword === form.password
              )
            "
          ></v-text-field>
          <step-buttons-group @next="step = 3" @cancel="$emit('cancel')" />
        </v-stepper-content>
        <v-stepper-step step="3" editable>{{
          $t('personalDataIn')
        }}</v-stepper-step>
        <v-stepper-content step="3" editable>
          <v-text-field
            v-model="form.name"
            filled
            background-color="white"
            :placeholder="$t('name')"
          ></v-text-field>
          <v-text-field
            v-model="form.surname"
            filled
            background-color="white"
            :placeholder="$t('lastName')"
          ></v-text-field>
          <v-text-field
            v-model="form.phoneNumber"
            filled
            background-color="white"
            :placeholder="$t('phoneNumber')"
          ></v-text-field>
          <step-buttons-group @next="step = 4" @cancel="$emit('cancel')" />
        </v-stepper-content>
        -->
        <v-stepper-step step="2" editable>
          {{ $t('insertRole') }}
        </v-stepper-step>
        <v-stepper-content step="2" editable>
          <v-container class="mt-0 pt-0" fluid>
            <v-radio-group v-model="form.role" class="mt-0 pt-4">
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
      passwordRules: [(v) => !!v || this.$t('insertPassword')],
      passwordConfirmRules: [
        (v) => !!v || this.$t('repeatPassword'),
        (v) => v === this.form.password || this.$t('passwordUnmatched'),
      ],
      step: 1,
      confirmPassword: '',
      show1: false,
      show2: false,
      error: null,
      form: {
        id: null,
        name: this.value.name || 'Name',
        surname: this.value.surname || 'Surname',
        phoneNumber: this.value.phoneNumber || '12345676',
        username: this.value.username || '',
        role: this.value.role || 'USER',
        loggedOrganization: this.$auth.user.loggedOrganization,
        password: '',
        locale: this.value.locale || 'es',
        membershipDate: this.value.membershipDate || null,
        enabled: true,
      },
      dialog: false,
      wrongMail: true,
      passwordNotMatch: true,
    }
  },

  computed: {
    dimensionList() {
      return [
        { label: this.$t('administrator'), value: 'ADMINISTRATOR' },
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
