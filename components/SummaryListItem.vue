<template>
  <v-expansion-panels
    v-model="expansionModel"
    flat
    tile
    multiple
    class="rounded-xl mb-5"
  >
    <v-expansion-panel expand class="home-panel-custom transparent">
      <v-expansion-panel-header
        hide-actions
        color="secondary"
        class="text-h4 white--text rounded-xl px-4 py-1 expansion-header-custom"
      >
        <v-fade-transition mode="out-in">
          <v-row
            no-gutters
            class="rounded-lg mb-2 white plain-shadow"
            style="margin-bottom: 0 !important"
          >
            <v-col cols="auto" class="ml-0 mr-6">
              <v-card flat style="border-radius: 12px 0px 0px 12px">
                <v-img
                  :src="
                    require(`/assets/img/sdg/${ods.dtoReference.theOne.levelN_ItemId}-ESSDG.png`)
                  "
                  style="border-radius: 12px 0px 0px 12px"
                  aspect-ratio="1"
                  width="110"
                  height="auto"
                />
              </v-card>
            </v-col>
            <v-col class="d-flex justify-start mr-4 py-4">
              <v-row>
                <v-col class="ml-0">
                  <div class="mb-0 text-caption blue--text">
                    {{ $t('Planes') }}:
                    {{
                      Array.from(
                        new Set(ods.dtosToConsider.plans.map((i) => i.planId))
                      ).length
                    }}
                    <!--
                | {{ $t('Acciones') }}:
                {{
                  Array.from(
                    new Set(ods.indicatorsConsidered.map((i) => i.area.areaId))
                  ).length
                }}
                -->
                    | {{ $t('Indicadores') }}:
                    {{
                      Array.from(
                        new Set(
                          ods.indicatorsConsidered.map((i) => i.indicatorUUID)
                        )
                      ).length
                    }}
                  </div>
                  <v-container fluid class="white lighten-5 pl-0">
                    <v-row no-gutters>
                      <v-col cols="auto" class="pr-2">
                        <v-avatar size="24" color="white" class="status-bullet">
                          <status-circle :status="ods.status" :size-avatar="24">
                          </status-circle>
                        </v-avatar>
                        <v-avatar size="24" color="white" class="trend-bullet">
                          <trend-circle :trend="ods.trend" :size-avatar="24">
                          </trend-circle>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <div class="text-caption secondary--text">
                          <v-progress-linear
                            :value="ods.progress"
                            background-color="lightGray"
                            color="teal"
                            height="8"
                            rounded
                          ></v-progress-linear>
                        </div>
                        <div class="text-caption secondary--text align-top">
                          {{ ods.progress }} %
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
                <v-col cols="auto">
                  <span class="text-right panel-actions">
                    <span
                      class="v-expansion-panel-header__icon"
                      style="top: 8px; position: relative"
                    >
                      <v-icon color="primary">mdi-chevron-down</v-icon>
                    </span>
                  </span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-fade-transition>
      </v-expansion-panel-header>
      <v-expansion-panel-content
        color="transparent"
        class="rounded-xl pt-0"
        style="
          border-top-right-radius: 0 !important;
          border-top-left-radius: 0 !important;
          background-color: transparent !important;
        "
      >
        <!-- areas indicator list -->
        <v-container fluid pt-0>
          <v-row
            v-for="(item, i) in ods.dtoReference.theMany"
            :key="i"
            class="rounded-sm mb-1 white ml-10 px-4 py-0"
            style="margin-top: 4px !important"
          >
            <v-col cols="12">
              <div class="mb-0 text-caption blue--text">
                <svg
                  width="16px"
                  height="16px"
                  viewBox="0 0 24 24"
                  class="mb-n1"
                >
                  <path
                    fill="currentColor"
                    d="M5 5h8.423l1.154 2H19v9h-6l-1.155-2H6v7H5V5Zm13 10V8h-4l-1.155-2H6v7h6.423l1.154 2H18Z"
                  ></path>
                </svg>
                {{ $t('indicator') }}
              </div>
              <div>
                <span class="gray--text text-caption mb-0 mr-auto">
                  Plan:
                  <span class="text-decoration-underline primary--text">
                    {{
                      Array.from(
                        new Set(
                          ods.indicatorsConsidered.map(
                            (j) => j.area.plan.planName
                          )
                        )
                      )[0]
                    }}
                  </span>
                  &nbsp;|&nbsp;
                </span>
                <span class="gray--text text-caption mb-0 mr-auto">
                  Área:
                  <span class="text-decoration-underline primary--text">
                    {{
                      Array.from(
                        new Set(
                          ods.indicatorsConsidered.map((j) => j.area.areaName)
                        )
                      )[0]
                    }}
                  </span>
                </span>
              </div>
              <v-container
                fluid
                class="white lighten-5 text-body-1 darkBlue--text"
              >
                {{ ods.indicatorsConsidered[i].indicatorDTO.indicatorName }}
              </v-container>
              <v-container fluid class="white lighten-5">
                <v-row no-gutters style="height: 30px">
                  <v-col cols="auto" class="pr-2">
                    <v-avatar size="24" color="white" class="status-bullet">
                      <status-circle
                        :status="ods.indicatorsConsidered[i].status"
                        :size-avatar="24"
                      >
                      </status-circle>
                    </v-avatar>
                    <v-avatar size="24" color="white" class="trend-bullet">
                      <trend-circle
                        :trend="ods.indicatorsConsidered[i].trend"
                        :size-avatar="24"
                      >
                      </trend-circle>
                    </v-avatar>
                  </v-col>
                  <v-col>
                    <div class="text-caption secondary--text">
                      <v-progress-linear
                        :value="ods.indicatorsConsidered[i].progress"
                        color="teal"
                        background-color="lightGray"
                        height="8"
                        rounded
                      ></v-progress-linear>
                    </div>
                    <div class="text-caption secondary--text align-top">
                      {{ ods.indicatorsConsidered[i].progress }} %
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'SummaryListItem',
  props: {
    ods: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => {
    return {
      expansionModel: [1],
      actionInfo: null,
      loading: false,
      goals: null,
      image: null,
    }
  },
}
</script>
<style lang="scss">
.expansion-header-custom.v-expansion-panel-header {
  padding: 0 !important;
}
body .home-panel-custom .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
