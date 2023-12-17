<template>
  <v-container fluid class="pl-0 py-0">
    <v-fade-transition mode="out-in">
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="auto" class="mx-3 my-3">
          <v-card flat>
            <v-avatar
              class="white--text ml-2 caption"
              width="45px"
              height="45px"
              color="blue"
              elevation="0"
              fab
            >
              {{ firstCapitalized(user.name) + firstCapitalized(user.surname) }}
            </v-avatar>
          </v-card>
        </v-col>
        <v-col class="py-4">
          <v-row align="center" justify="center" no-gutters>
            <v-col lg="3" md="3" class="d-flex justify-start mx-2">
              <div class="ml-0 mr-2">
                <p class="grey--text mb-1 text-caption">
                  {{ $t('name') }}
                </p>
                <p class="body-2 darkGray--text">
                  {{ user.name + ' ' + user.surname }}
                </p>
              </div>
            </v-col>
            <v-col class="mx-2">
              <p class="grey--text mb-1 text-caption">
                {{ $t('email') }}
              </p>
              <p class="body-2 darkGray--text">{{ user.username }}</p>
            </v-col>
            <v-col class="mx-2">
              <p class="grey--text mb-1 text-caption">
                {{ $t('rol') }}
              </p>
              <p class="body-2 darkGray--text">
                {{ $t(getRole(user.role)) }}
              </p>
            </v-col>
            <v-col class="mx-2">
              <p class="grey--text mb-1 text-caption">
                {{ $t('status') }}
              </p>
              <v-row>
                <v-col class="ml-0" cols="auto">
                  <p class="body-2 darkGray--text">
                    <v-badge
                      dot
                      inline
                      :color="user.enabled ? 'green' : 'red'"
                    ></v-badge>
                    {{ user.enabled ? $t('userActive') : $t('userInactive') }}
                  </p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="auto mx-2">
              <v-btn
                class="primary--text"
                rounded
                small
                color="white"
                elevation="0"
                :to="{
                  name: 'user-add',
                  params: {
                    user: user,
                  },
                }"
              >
                <img
                  class="iconDrawer"
                  :src="require(`assets/img/icons/Edit.svg`)"
              /></v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    getRole(role) {
      if (role === 'SUPER') return 'administrator'
      if (role === 'ADMIN') return 'administrator'
      else if (role === 'EDITOR') return 'editor'
      else return 'user'
    },
    firstCapitalized(name) {
      const capitalizedFirst = name[0].toUpperCase()
      return capitalizedFirst
    },
  },
}
</script>
