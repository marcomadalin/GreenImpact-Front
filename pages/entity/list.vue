<template>
  <v-container fluid px-8 pt-8>
    <h1 class="blue--text text-h1 mb-3">{{ $t('entitiesManage') }}</h1>

    <v-container fluid pl-0 pr-0 pt-4 pb-2>
      <v-row class="d-flex" align="center">
        <v-col cols="auto">
          <v-text-field
            v-model="search"
            style="max-width: 250px"
            :label="$t('search')"
            prepend-inner-icon="mdi-magnify"
            color="primary"
            @input="filterByName"
          ></v-text-field>
        </v-col>
        <v-spacer />
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
                <v-icon class="mr-2" color="primary">mdi-filter-variant</v-icon>
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
                      :label="$t('SYS_MASTER')"
                      color="primary"
                      :ripple="false"
                      hide-details
                      @click="filterByName"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="checkboxes[1]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('SYS_CLUSTER_MASTER')"
                      color="primary"
                      :ripple="false"
                      hide-details
                      @click="filterByName"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="checkboxes[2]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('SYS_CLUSTER_ENTITY')"
                      color="primary"
                      :ripple="false"
                      hide-details
                      @click="filterByName"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="checkboxes[3]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('SYS_SUSTAINABLE_ENTITY')"
                      color="primary"
                      :ripple="false"
                      hide-details
                      @click="filterByName"
                    ></v-checkbox>
                  </v-col>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="my-0 py-0">
                <v-list-item-content class="my-0 py-0">
                  <v-list-item-title class="text-body-2">
                    {{ $t('status') }}
                  </v-list-item-title>
                  <v-col class="my-2 py-0 mx-0 px-0">
                    <v-checkbox
                      v-model="checkboxes[4]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('orgActive')"
                      color="primary"
                      :ripple="false"
                      hide-details
                      @click="filterByName"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="checkboxes[5]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('orgInactive')"
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
        <!-- /template -->
        <v-btn
          rounded
          text-lowercase
          elevation="0"
          color="primary"
          class="text-body-2 ml-5 mr-3"
          :to="{ name: 'entity-add' }"
        >
          <v-icon class="mr-2" color="white">mdi-account-plus-outline</v-icon>
          {{ $t('newEntity') }}
        </v-btn>
      </v-row>
    </v-container>

    <v-list v-if="pageItems.length" color="transparent">
      <v-list-item
        v-for="(item, i) in pageItems"
        :key="i"
        class="rounded-sm mb-2 white px-0"
      >
        <entity-list-item :entity="item"> </entity-list-item>
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
    <v-alert v-if="pageItems.length === 0"> {{ $t('noEntities') }} </v-alert>
  </v-container>
</template>

<script>
import API_ORGANIZATIONS from '~/api/organizations'
import EntityListItem from '~/components/EntityListItem.vue'

export default {
  components: { EntityListItem },
  middleware: ['super-admin-role'],

  async asyncData({ $axios, $auth }) {
    let allItems = []
    let filteredItems = []
    let pageItems = []
    const numItems = 8
    let numPages = 0
    const imagePlan = {}
    const page = 1
    try {
      allItems = await API_ORGANIZATIONS.init($axios).getAllOrganizations()

      numPages = Math.ceil(allItems.length / numItems)
      const startIndex = 0
      const endIndex = startIndex + numItems
      const finalIndex = endIndex > allItems.length ? allItems.length : endIndex
      filteredItems = allItems.slice(0, allItems.length)
      filteredItems.sort((a, b) =>
        a.name.toLowerCase() + a.name.toLowerCase() >
        b.name.toLowerCase() + b.name.toLowerCase()
          ? 1
          : b.name.toLowerCase() + b.name.toLowerCase() >
            a.name.toLowerCase() + a.name.toLowerCase()
          ? -1
          : 0
      )
      pageItems = filteredItems.slice(startIndex, finalIndex)
    } catch (e) {
      console.log(e.response)
    }
    return {
      orgUUID: '',
      allItems,
      filteredItems,
      pageItems,
      imagePlan,
      page,
      numItems,
      numPages,
      search: '',
      sorting: 3,
      checkboxes: [false, false, false, false, false, false],
    }
  },
  methods: {
    updateItems() {
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
        const name = this.allItems[i].name.toLowerCase()

        if (name.includes(searchText)) {
          this.filteredItems.push(this.allItems[i])
        }
      }
      this.filterByProperties()
    },
    filterByProperties() {
      if (this.checkboxes.some((elem) => elem)) {
        const newFilteredItems = []
        for (let i = 0; i < this.filteredItems.length; i++) {
          let added = false
          if (this.checkboxes[0] && this.filteredItems[i].type === 'MASTER') {
            newFilteredItems.push(this.filteredItems[i])
            added = true
          } else if (
            this.checkboxes[1] &&
            this.filteredItems[i].type === 'CLUSTER_MASTER'
          ) {
            newFilteredItems.push(this.filteredItems[i])
            added = true
          } else if (
            this.checkboxes[2] &&
            this.filteredItems[i].type === 'CLUSTER_ENTITY'
          ) {
            newFilteredItems.push(this.filteredItems[i])
            added = true
          } else if (
            this.checkboxes[3] &&
            this.filteredItems[i].type === 'SUSTAINABLE_ENTITY'
          ) {
            newFilteredItems.push(this.filteredItems[i])
            added = true
          }
          const noTypeSelected = !(
            this.checkboxes[0] ||
            this.checkboxes[1] ||
            this.checkboxes[2] ||
            this.checkboxes[3]
          )
          if (added) {
            if (this.checkboxes[4] && !this.filteredItems[i].enabled)
              newFilteredItems.pop()
            else if (this.checkboxes[5] && this.filteredItems[i].enabled)
              newFilteredItems.pop()
          } else if (
            noTypeSelected &&
            this.checkboxes[4] &&
            this.filteredItems[i].enabled
          )
            newFilteredItems.push(this.filteredItems[i])
          else if (
            noTypeSelected &&
            this.checkboxes[5] &&
            !this.filteredItems[i].enabled
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
