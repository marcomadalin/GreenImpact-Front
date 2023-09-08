<template>
  <v-app>
    <v-main class="lightGray">
      <v-container
        fluid
        fill-height
        class="ma-0 main-container content-padding mx-auto"
      >
        <v-container>
          <img
            style="min-width: 154px !important; min-height: 40px !important"
            :src="require('assets/img/imagotipo-app-positivo.svg')"
          />
          <nuxt />
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  auth: false,
}
</script>
<style scoped>
.main-container {
  max-width: 550px;
  align-items: center;
}
</style>
