<template>
  <v-container fluid px-8 pt-8>
    <h1 class="primary--text text-h1">{{ $t('reportGeneration') }}</h1>
    <p>{{ $t('reportGen') }}</p>
    <v-container fluid pl-0 pr-0 pt-4 pb-2 mb-4>
      <v-row no-gutters>
        <v-col cols="6" sm="6" align="left">
          <h2 class="primary--text text-h2"></h2>
        </v-col>
        <v-col cols="1" sm="6" align="right">
          <!--
          <v-btn
            small
            rounded
            text-lowercase
            elevation="0"
            color="primary"
            @click.prevent="startQuiz"
          >
            <svg width="1.15em" height="1.15em" viewBox="0 0 24 24" pl-4>
              <path
                fill="currentColor"
                d="M12 17q.425 0 .713-.288Q13 16.425 13 16v-3h3.025q.425 0 .7-.288Q17 12.425 17 12t-.288-.713Q16.425 11 16 11h-3V7.975q0-.425-.287-.7Q12.425 7 12 7t-.712.287Q11 7.575 11 8v3H7.975q-.425 0-.7.287Q7 11.575 7 12t.287.712Q7.575 13 8 13h3v3.025q0 .425.288.7q.287.275.712.275Zm0 5q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z"
              ></path>
            </svg>
            {{ $t('Generar informe') }}
          </v-btn>
          -->
        </v-col>
      </v-row>
    </v-container>
    <!-- list plans -->
    <v-list v-if="plans.length" color="transparent">
      <v-list-item
        v-for="(item, i) in plans"
        :key="i"
        class="rounded-sm mb-2 white px-0"
      >
        <v-container fluid class="pl-0">
          <v-fade-transition mode="out-in">
            <v-row no-gutters>
              <v-col lg="1" md="2" class="ml-4 mr-6">
                <v-card>
                  <v-img
                    :src="`/b2b/plans/${item.planUUID}/image`"
                    height="100"
                  />
                </v-card>
              </v-col>
              <v-col lg="3" md="3" class="p-2 ml-4 mr-6 d-flex justify-start">
                <div class="ml-0 mr-2">
                  <p class="grey--text mb-0 text-caption">
                    {{ $t('planName') }}
                  </p>
                  <p class="body-2">{{ item.planName }}</p>
                </div>
              </v-col>
              <v-col lg="3" md="3" class="mb-2 mt-3 justify-start">
                <div class="pa-1">
                  <v-btn
                    small
                    rounded
                    text-lowercase
                    elevation="0"
                    color="primary"
                    @click.prevent="report_standard"
                  >
                    <svg
                      width="1.15em"
                      height="1.15em"
                      viewBox="0 0 24 24"
                      pl-4
                    >
                      <path
                        fill="currentColor"
                        d="M12 17q.425 0 .713-.288Q13 16.425 13 16v-3h3.025q.425 0 .7-.288Q17 12.425 17 12t-.288-.713Q16.425 11 16 11h-3V7.975q0-.425-.287-.7Q12.425 7 12 7t-.712.287Q11 7.575 11 8v3H7.975q-.425 0-.7.287Q7 11.575 7 12t.287.712Q7.575 13 8 13h3v3.025q0 .425.288.7q.287.275.712.275Zm0 5q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z"
                      ></path>
                    </svg>
                    {{ $t('generateStandardReport') }}
                  </v-btn>
                </div>
                <div class="pa-1">
                  <v-btn
                    small
                    rounded
                    text-lowercase
                    elevation="0"
                    color="primary"
                    @click.prevent="report_aue"
                  >
                    <svg
                      width="1.15em"
                      height="1.15em"
                      viewBox="0 0 24 24"
                      pl-4
                    >
                      <path
                        fill="currentColor"
                        d="M12 17q.425 0 .713-.288Q13 16.425 13 16v-3h3.025q.425 0 .7-.288Q17 12.425 17 12t-.288-.713Q16.425 11 16 11h-3V7.975q0-.425-.287-.7Q12.425 7 12 7t-.712.287Q11 7.575 11 8v3H7.975q-.425 0-.7.287Q7 11.575 7 12t.287.712Q7.575 13 8 13h3v3.025q0 .425.288.7q.287.275.712.275Zm0 5q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z"
                      ></path>
                    </svg>
                    {{ $t('generateAUEReport') }}
                  </v-btn>
                </div>
                <div class="pa-1">
                  <v-btn
                    small
                    rounded
                    text-lowercase
                    elevation="0"
                    color="primary"
                    @click.prevent="report_ma2030"
                  >
                    <svg
                      width="1.15em"
                      height="1.15em"
                      viewBox="0 0 24 24"
                      pl-4
                    >
                      <path
                        fill="currentColor"
                        d="M12 17q.425 0 .713-.288Q13 16.425 13 16v-3h3.025q.425 0 .7-.288Q17 12.425 17 12t-.288-.713Q16.425 11 16 11h-3V7.975q0-.425-.287-.7Q12.425 7 12 7t-.712.287Q11 7.575 11 8v3H7.975q-.425 0-.7.287Q7 11.575 7 12t.287.712Q7.575 13 8 13h3v3.025q0 .425.288.7q.287.275.712.275Zm0 5q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z"
                      ></path>
                    </svg>
                    {{ $t('generateMAReport') }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-fade-transition>
        </v-container>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import axios from 'axios'
import API from '~/api/plans'
import API_REPORTS from '~/api/reports'

export default {
  async asyncData({ $axios }) {
    const plans = {}

    try {
      const plans = await API.init($axios).list()
      return {
        plans,
      }
    } catch (e) {
      console.log(e.response)
    }
    return { plans }
  },
  beforeMount() {
    this.api = API_REPORTS.init(this.$axios)
  },
  methods: {
    report_standard() {
      axios({
        url:
          '/b2b/reporting/standard/' + '497f569d-c89d-4312-8836-bacdf1d36e67',
        method: 'GET',
        responseType: 'blob',
      }).then((res) => {
        const FILE = window.URL.createObjectURL(new Blob([res.data]))

        const docUrl = document.createElement('x')
        docUrl.href = FILE
        docUrl.setAttribute('download', 'file.pdf')
        document.body.appendChild(docUrl)
        docUrl.click()
      })
    },
    /*
    async report_standard() {
      this.plan = await this.api.get()
    },
    */
    report_aue() {},
    report_ma2030() {},
  },
}
</script>

<style></style>
