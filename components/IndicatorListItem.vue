<template>
  <v-container fluid class="rounded-lg white px-0 py-0 mx-0 my-0">
    <v-fade-transition mode="out-in">
      <v-col class="px-0 pt-0 pb-0" cols="12">
        <div id="indicatorHeader" class="mb-0 px-5 text-caption blue--text">
          <div class="mr-1">
            <v-icon aspect-ratio="1" height="25px" color="primary"
              >mdi-flag-outline</v-icon
            >
          </div>
          {{ $t('indicator') }}
        </div>
        <v-container
          fluid
          class="white lighten-5 text-body-1 darkBlue--text px-5 mt-0 mb-1"
        >
          <v-row class="mb-1">
            <v-col cols="auto">
              <p class="text--body-2 mb-1" style="color: #060632">
                {{ indicator.indicatorName }}
              </p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-btn
                class="primary--text"
                rounded
                small
                color="white"
                elevation="0"
                @click="dialog = true"
              >
                <img
                  class="iconDrawer"
                  :src="require(`assets/img/icons/Delete.svg`)"
                />
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            fluid
            no-gutters
            style="height: 30px"
            class="d-flex justify-end text-center align-center mb-0"
          >
            <p class="mr-3 gray--text text-caption my-0">
              {{ $t(indicator.indicatorType) }}
            </p>
            <v-card
              v-for="(ods, j) in levels"
              :key="j"
              index
              width="28px"
              height="28px"
              rounded="0"
              flat
              :ripple="false"
              class="pa-0 mr-2"
            >
              <v-img
                :src="require(`/assets/img/sdg/small/ico-ODS-${ods}.svg`)"
                aspect-ratio="1"
                height="100%"
                weight="100%"
              />
            </v-card>
          </v-row>
        </v-container>
      </v-col>
    </v-fade-transition>
    <v-dialog v-model="dialog" width="490" overlay-color="#24244b">
      <v-card class="rounded-lg">
        <v-container class="px-10 py-10">
          <v-icon
            v-if="areas.length === 0"
            size="40px"
            aspect-ratio="1"
            color="#011D89"
            >mdi-trash-can-outline</v-icon
          >
          <v-icon v-else size="40px" aspect-ratio="1" color="#F8003B"
            >mdi-alert-outline</v-icon
          >

          <v-card-title
            v-if="areas.length === 0"
            class="text-h3 px-2"
            style="color: #011d89"
          >
            {{ $t('deleteIndicatorHead') }}
          </v-card-title>
          <v-card-title v-else class="text-h3 px-2" style="color: #f8003b">
            {{ $t('deleteHead') }}
          </v-card-title>

          <v-card-text
            v-if="areas.length === 0"
            class="text-body-1 black--text px-2"
          >
            {{ $t('deleteIndicatorSubHead') }}
          </v-card-text>
          <v-card-text v-else class="text-body-1 black--text px-2 pb-0 mb-0">
            {{ $t('deleteHead2') }}
          </v-card-text>

          <v-container v-if="areas.length !== 0" class="py-0">
            <v-virtual-scroll
              :items="areas"
              :item-height="30"
              :height="getAreaListHeight"
            >
              <template #default="{ item }">
                <v-list-item>
                  <v-list-item-content class="py-0">
                    <li style="color: #3233c1">
                      <a
                        class="text-decoration-underline primary--text"
                        @click="
                          $router.push({
                            name: 'area-viewlist',
                            params: {
                              plan: item.plan.planUUID,
                              area: item.areaId,
                            },
                          })
                        "
                      >
                        {{ item.areaName }}
                      </a>
                    </li>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-container>

          <v-card-actions>
            <v-btn
              :disabled="areas.length !== 0"
              rounded
              elevation="0"
              color="red"
              class="text-body-2 white--text"
              @click="
                () => {
                  $emit('delete', indicator)
                  dialog = false
                }
              "
              >{{ $t('deleteIndicator') }}</v-btn
            >

            <v-btn
              rounded
              elevation="0"
              class="text-body-2"
              @click="dialog = false"
            >
              {{ $t('cancel') }}
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import { ma2030 } from '~/api/indicatorsSources'

export default {
  name: 'IndicatorListItem',
  props: {
    indicator: {
      type: Object,
      default: () => {},
    },
    areas: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialog: false,
      overlay: false,
      levels: [],
    }
  },
  computed: {
    getAreaListHeight() {
      if (this.areas.length === 1) return 60
      else if (this.areas.length === 2) return 80
      else if (this.areas.length === 3) return 130
      else return 150
    },
  },
  async mounted() {
    try {
      const API = await ma2030.init(this.$axios)

      const relatedIndicators = await API.relatedIndicators(
        this.indicator.indicatorUUID
      )
      console.log(relatedIndicators)
      for (let i = 0; i < relatedIndicators.length; i++) {
        const ods = await API.getLevel(relatedIndicators[i].levelN_ItemId, 1)
        const odsName = ods.levelN_ItemName.split(' ')
        this.levels.push(odsName[odsName.length - 1])
      }
    } catch (e) {
      console.log(e.response)
    }
  },
}
</script>

<style scoped lang="scss">
#mainContainer {
  border-radius: 16px;
}
#indicatorHeader {
  background: #e6e6eb;
  height: 40px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  align-items: center;
}

#indicatorIcons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.theme--light.v-btn.v-btn--disabled.v-btn--has-bg .v-btn__content {
  color: white;
}
</style>
