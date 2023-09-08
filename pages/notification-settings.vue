<template>
  <v-container fluid px-8 pt-8>
    <h1 class="primary--text text-h1">
      {{ $t('notificationConfig') }}
    </h1>
    <p>{{ $t('notificationManagement') }}</p>
    <br /><br /><br />
    <v-card class="mx-auto" max-width="900">
      <v-card-title>
        <h2 class="text-subtitle-3 secondary--text">{{ $t('indicators') }}</h2>
      </v-card-title>

      <v-sheet class="pa-5">
        <v-switch
          color="primary"
          :label="$t('alertEstadoNeg')"
          value
          input-value="true"
        ></v-switch>
        <v-switch :label="$t('alertEstadoNeu')" value="0"></v-switch>
        <v-switch
          color="primary"
          :label="$t('alertFaltaData')"
          value
          input-value="true"
        ></v-switch>
      </v-sheet>

      <v-divider class="mx-4"></v-divider>
    </v-card>
    <br /><br />
    <v-card class="mx-auto" max-width="900">
      <v-card-title>
        <h2 class="text-subtitle-3 secondary--text">{{ $t('reports') }}</h2>
      </v-card-title>

      <v-sheet class="pa-5">
        <v-switch
          color="primary"
          :label="$t('automaticReports')"
          value
          input-value="true"
        ></v-switch>
      </v-sheet>

      <v-divider class="mx-4"></v-divider>
    </v-card>
    <br /><br />
    <v-card class="mx-auto" max-width="900">
      <v-card-title>
        <h2 class="text-subtitle-3 secondary--text">
          {{ $t('tiposDeNotificacion') }}
        </h2>
      </v-card-title>

      <v-sheet class="pa-5">
        <v-switch
          color="primary"
          :label="$t('notifEmail')"
          value
          input-value="true"
        ></v-switch>
        <v-switch :label="$t('notifSlack')" value="0"></v-switch>
        <v-switch :label="$t('notifSMS')" value="0"></v-switch>
        <v-switch :label="$t('notifTelegram')" value="0"></v-switch>
      </v-sheet>

      <v-divider class="mx-4"></v-divider>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbs: [
        {
          exact: true,
          text: this.$t('overview'),
          to: { name: 'home' },
        },
      ],
    }
  },
}
</script>
