<template>
  <v-container fluid px-8 pt-8>
    <h1 class="blue--text text-h1 mb-3">{{ $t('indicatorManageHeading') }}</h1>

    <v-container fluid pl-0 pr-0 pt-4 pb-2>
      <v-row class="d-flex" align="center">
        <v-col cols="auto">
          <v-text-field
            v-model="search"
            style="max-width: 250px"
            :label="$t('search')"
            prepend-inner-icon
            color="primary"
            @input="filterByName"
            @focus="isFocused = true"
            @blur="isFocused = false"
            ><template #prepend-inner>
              <img
                class="iconDrawer"
                :src="
                  isFocused
                    ? require(`assets/img/icons/Search.svg`)
                    : require(`assets/img/icons/Search-gray.svg`)
                "
              /> </template
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <div class="text-center">
          <v-menu offset-y :close-on-content-click="false">
            <template #activator="{ on, attrs }">
              <v-btn
                rounded
                text-lowercase
                elevation="0"
                class="text-body-2 primary--text"
                v-bind="attrs"
                v-on="on"
              >
                <img
                  class="iconDrawer mr-2"
                  :src="require(`assets/img/icons/Filter.svg`)"
                />
                {{ $t('filter') }}
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item class="mb-0 pb-0">
                <v-list-item-content>
                  <v-list-item-title class="text-body-2">
                    {{ $t('type') }}
                  </v-list-item-title>
                  <v-col class="my-2 py-0 mx-0 px-0">
                    <v-checkbox
                      v-model="checkboxes[0]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('QUANTITATIVE')"
                      color="primary"
                      :ripple="false"
                      hide-details
                      @click="filterByName"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="checkboxes[1]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('QUALITATIVE')"
                      color="primary"
                      :ripple="false"
                      hide-details
                      @click="filterByName"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="checkboxes[2]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('QUANTITATIVE_DIMENSIONAL')"
                      color="primary"
                      :ripple="false"
                      hide-details
                      @click="filterByName"
                    ></v-checkbox>
                  </v-col>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-btn
          rounded
          text-lowercase
          elevation="0"
          color="primary"
          class="text-body-2 ml-5 mr-3"
          :to="{ name: 'indicator-add' }"
        >
          <img
            class="iconDrawer mr-2"
            :src="require(`assets/img/icons/add-white.svg`)"
          />
          {{ $t('newIndicatorCustom') }}
        </v-btn>
      </v-row>
    </v-container>

    <v-list v-if="pageItems.length" color="transparent">
      <v-list-item v-for="(item, i) in pageItems" :key="i" class="mb-5 px-0">
        <indicator-list-item
          :key="itemKey"
          :areas="getIndicatorAreas(item.indicatorUUID)"
          :indicator="item"
          @delete="deleteIndicator"
        >
        </indicator-list-item>
      </v-list-item>
    </v-list>
    <v-row v-if="allItems.length > numItems" class="text-center mt-3">
      <v-pagination
        v-model="page"
        :length="numPages"
        circle
        @input="updateItems"
      ></v-pagination>
    </v-row>
    <v-alert v-if="pageItems.length === 0">
      {{ $t('noIndicatorsList') }}
    </v-alert>
    <v-snackbar
      v-model="ok"
      style="margin-top: 70px"
      min-width="0px"
      color="#12BB6A"
      :top="true"
      fixed
      timeout="1500"
    >
      <v-icon>mdi-check-circle-outline</v-icon>
      <span class="ml-3">{{ $t('indicatorDeleted') }}</span>
    </v-snackbar>
  </v-container>
</template>

<script>
import API_IND from '~/api/indicators'
import IndicatorListItem from '~/components/IndicatorListItem.vue'
import API from '~/api/plans'
import { ma2030 } from '~/api/indicatorsSources'
export default {
  components: { IndicatorListItem },
  middleware: ['admin-role'],

  async asyncData({ $axios }) {
    let allItems = []
    let filteredItems = []
    let pageItems = []
    const numItems = 10
    let numPages = 0
    const page = 1
    let totalAreas = []
    try {
      const plans = await API.init($axios).list()
      for (let i = 0; i < plans.length; ++i)
        totalAreas = totalAreas.concat(plans[i].areaDTOs)

      allItems = await API_IND.init($axios).listCustom()

      numPages = Math.ceil(allItems.length / numItems)
      const startIndex = 0
      const endIndex = startIndex + numItems
      const finalIndex = endIndex > allItems.length ? allItems.length : endIndex
      filteredItems = allItems.slice(0, allItems.length)
      filteredItems.sort((a, b) =>
        a.indicatorName.toLowerCase() + a.indicatorName.toLowerCase() >
        b.indicatorName.toLowerCase() + b.indicatorName.toLowerCase()
          ? 1
          : b.indicatorName.toLowerCase() + b.indicatorName.toLowerCase() >
            a.indicatorName.toLowerCase() + a.indicatorName.toLowerCase()
          ? -1
          : 0
      )
      pageItems = filteredItems.slice(startIndex, finalIndex)
    } catch (e) {
      console.log(e.response)
    }
    return {
      totalAreas,
      ok: false,
      allItems,
      filteredItems,
      pageItems,
      page,
      numItems,
      numPages,
      search: '',
      sorting: 3,
      checkboxes: [false, false, false],
      itemKey: 0,
      isFocused: false,
    }
  },
  methods: {
    getIndicatorAreas(indicatorUUID) {
      const indicatorAreas = []
      for (let i = 0; i < this.totalAreas.length; i++) {
        for (let j = 0; j < this.totalAreas[i].areaIndicatorDTOs.length; ++j) {
          if (
            this.totalAreas[i].areaIndicatorDTOs[j].indicatorUUID ===
            indicatorUUID
          ) {
            indicatorAreas.push(this.totalAreas[i])
            break
          }
        }
      }
      return indicatorAreas
    },
    async deleteIndicator(indicator) {
      this.overlay = true
      try {
        const API = await ma2030.init(this.$axios)
        const relatedIndicators = await API.relatedIndicators(
          indicator.indicatorUUID
        )
        for (let i = 0; i < relatedIndicators.length; i++) {
          await API.deleteCustomIndicator(
            relatedIndicators[i].levelN_ItemId,
            relatedIndicators[i].indicatorUUID
          )
        }
        await API_IND.init(this.$axios).delete(indicator.indicatorUUID)

        this.overlay = false
        this.ok = true
        const index = this.allItems.indexOf(indicator)
        this.allItems.splice(index, 1)
        this.itemKey += 1
        this.filterByName()
      } catch (e) {
        console.log(e.response)
        this.overlay = false
      }
    },
    updateItems() {
      this.filteredItems.sort((a, b) =>
        a.indicatorName.toLowerCase() + a.indicatorName.toLowerCase() >
        b.indicatorName.toLowerCase() + b.indicatorName.toLowerCase()
          ? 1
          : b.indicatorName.toLowerCase() + b.indicatorName.toLowerCase() >
            a.indicatorName.toLowerCase() + a.indicatorName.toLowerCase()
          ? -1
          : 0
      )
      const startIndex = (this.page - 1) * this.numItems
      const endIndex = startIndex + this.numItems
      const finalIndex =
        endIndex > this.filteredItems.length
          ? this.filteredItems.length
          : endIndex
      this.pageItems = this.filteredItems.slice(startIndex, finalIndex)
    },
    filterByName() {
      this.filteredItems = []
      const searchText = this.search.toLowerCase()
      for (let i = 0; i < this.allItems.length; i++) {
        const first = this.allItems[i].indicatorName.toLowerCase()
        const last = this.allItems[i].indicatorName.toLowerCase()

        if (
          (first + last).includes(searchText) ||
          (first + ' ' + last).includes(searchText)
        ) {
          this.filteredItems.push(this.allItems[i])
        }
      }
      this.filterByProperties()
    },
    filterByProperties() {
      if (this.checkboxes.some((elem) => elem)) {
        const newFilteredItems = []
        for (let i = 0; i < this.filteredItems.length; i++) {
          if (
            this.checkboxes[0] &&
            this.filteredItems[i].indicatorType === 'QUANTITATIVE'
          )
            newFilteredItems.push(this.filteredItems[i])
          else if (
            this.checkboxes[1] &&
            this.filteredItems[i].indicatorType === 'QUALITATIVE'
          )
            newFilteredItems.push(this.filteredItems[i])
          else if (
            this.checkboxes[2] &&
            this.filteredItems[i].indicatorType === 'QUANTITATIVE_DIMENSIONAL'
          )
            newFilteredItems.push(this.filteredItems[i])
        }
        this.filteredItems = newFilteredItems
      }
      this.updateItems()
    },
  },
}
</script>
<style lang="scss">
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg .v-btn__content {
  color: white;
}
</style>
