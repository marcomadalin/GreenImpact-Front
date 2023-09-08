<template>
  <v-container fluid px-8 pt-8>
    <h1 class="blue--text text-h1 mb-2">{{ $t('reports') }}</h1>
    <p class="text-body-2 blue--text mb-0">
      {{ $t('reportsSubheading') }}
    </p>

    <div v-if="hasFiise" class="mt-5">
      <p class="text-body1 darkGray--text mt-10">
        {{ $t('fise') }}
        <span style="font-weight: bold">Agenda Urbana Española</span>):
      </p>
      <v-img
        class="mb-5"
        height="60px"
        width="260px"
        :src="require(`/assets/img/logo-mitma.png`)"
        contain
      ></v-img>
      <v-btn
        depressed
        rounded
        :loading="loading"
        :disabled="loading"
        class="text-h4 primary--text mb-2 justify-start"
        color="white"
        @click.prevent="getFiiseReport(), (loader = 'loading')"
      >
        <img
          class="iconDrawer mr-2"
          :src="require(`assets/img/icons/FIISE.svg`)"
        />
        {{ $t('fiseDoc') }}
      </v-btn>
    </div>

    <p class="text-body1 darkGray--text mt-10 mb-0">
      {{ $t('reportshead3')
      }}<span style="font-weight: bold">{{ $t('standard2') }}</span
      >, <span style="font-weight: bold">Agenda Urbana Española</span>,
      <span style="font-weight: bold">{{ $t('ma2030') }}</span
      >):
    </p>

    <v-container fluid pl-0 pr-0 pt-0 pb-2 mb-4>
      <v-row no-gutters>
        <v-col cols="6" sm="6" align="left">
          <h2 class="primary--text text-h2"></h2>
        </v-col>
      </v-row>
    </v-container>
    <!-- new design -->
    <v-row>
      <v-col
        v-for="(actionPlan, key) in items"
        :key="key"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <reports-list :plan="actionPlan" :impact="impact" class="mb-4" />
      </v-col>
    </v-row>
    <!-- end new design -->
  </v-container>
</template>

<script>
import { statusEnum } from '~/constants'
import API from '~/api/plans'
import API_MA2030 from '~/api/framework_ma2030'
export default {
  async asyncData({ $axios }) {
    let items = []
    const impact = []
    const planes = []

    try {
      items = await API.init($axios).list()
      for (let i = 0; i < items.length; i++) {
        planes[i] = items[i].planUUID
      }
      const impact = await API_MA2030.init($axios).plansImpact(planes)
      return { items, impact }
    } catch (e) {
      console.log(e.response)
    }
    return { items, impact }
  },

  data() {
    return {
      loader: null,
      loading: false,
    }
  },

  computed: {
    statusEnum() {
      return statusEnum
    },
  },

  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 5000)

      this.loader = null
    },
  },
  methods: {
    async getFiiseReport() {
      try {
        await this.$axios({
          url: `/b2b/reporting/aue/fiise`,
          method: 'GET',
          responseType: 'blob',
        }).then((res) => {
          const FILE = window.URL.createObjectURL(new Blob([res.data]))

          const docUrl = document.createElement('a')
          docUrl.href = FILE
          docUrl.setAttribute('download', 'report_fiise.xlsx')
          document.body.appendChild(docUrl)
          docUrl.click()
        })
      } catch (e) {
        console.log(e.response)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
