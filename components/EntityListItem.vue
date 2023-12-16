<template>
  <v-container fluid class="pl-0 py-0">
    <v-fade-transition mode="out-in">
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="auto" class="mt-2 ml-6 mr-2">
          <v-card flat>
            <img
              width="54"
              height="55"
              style="border-radius: 50%"
              :src="image"
            />
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
                  {{ entity.name }}
                </p>
              </div>
            </v-col>
            <v-col class="mx-2">
              <p class="grey--text mb-1 text-caption">
                {{ $t('type') }}
              </p>
              <p class="body-2 darkGray--text">
                {{ $t(entity.type) }}
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
                      :color="entity.enabled ? 'green' : 'red'"
                    ></v-badge>
                    {{ entity.enabled ? $t('orgActive') : $t('orgInactive') }}
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
                  name: 'entity-license',
                  params: {
                    uuid: entity.id,
                    entity: entity,
                  },
                }"
                ><v-icon>mdi-key-outline</v-icon></v-btn
              >
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
    entity: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      image: null,
    }
  },

  beforeMount() {
    const path = 'filler' // await API_USERS.init(this.$axios).getOrganizationImage(this.entity.id)

    this.image = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
  },
}
</script>
