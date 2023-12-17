<template>
  <v-container fluid px-8 pt-8>
    <h1 class="blue--text text-h1 mb-3">{{ $t('userManagement') }}</h1>

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
        <v-spacer />
        <v-col cols="auto" class="text-center">
          <v-menu offset-y>
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
                  :src="require(`assets/img/icons/Sort.svg`)"
                />
                {{ $t('sort') }}
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item-group>
                <v-list-item>
                  <v-list-item-content @click="sortItems(2)">
                    <v-list-item-title class="text-body-2" color="grey">
                      {{ $t('sortNewOld') }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content @click="sortItems(1)">
                    <v-list-item-title class="text-body-2" color="grey">
                      {{ $t('sortOldNew') }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content @click="sortItems(3)">
                    <v-list-item-title class="text-body-2" color="grey">
                      {{ $t('sortAlphabetically') }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-col>
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
                    {{ $t('rol') }}
                  </v-list-item-title>
                  <v-col class="my-2 py-0 mx-0 px-0">
                    <v-checkbox
                      v-model="checkboxes[0]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('user')"
                      color="primary"
                      :ripple="false"
                      hide-details
                      @click="filterByName"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="checkboxes[1]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('admin')"
                      color="primary"
                      :ripple="false"
                      hide-details
                      @click="filterByName"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="checkboxes[2]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('editor')"
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
                      v-model="checkboxes[3]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('userActive')"
                      color="primary"
                      :ripple="false"
                      hide-details
                      @click="filterByName"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="checkboxes[4]"
                      class="my-0 py-0 mx-0 px-0"
                      :label="$t('userInactive')"
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
          :to="{ name: 'user-add' }"
        >
          <img
            class="iconDrawer mr-2"
            :src="require(`assets/img/icons/add-white.svg`)"
          />
          {{ $t('newUser') }}
        </v-btn>
      </v-row>
    </v-container>

    <v-list v-if="pageItems.length" color="transparent">
      <v-list-item
        v-for="(item, i) in pageItems"
        :key="i"
        class="rounded-sm mb-2 white px-0"
      >
        <user-list-item :user="item"> </user-list-item>
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
    <v-alert v-if="pageItems.length === 0"> {{ $t('noUsers') }} </v-alert>
  </v-container>
</template>

<script>
import API_ORGANIZATIONS from '~/api/organizations'
import UserListItem from '~/components/UserListItem.vue'

export default {
  components: { UserListItem },
  middleware: ['admin-role'],

  async asyncData({ $axios, $auth }) {
    let allItems = []
    let filteredItems = []
    let pageItems = []
    const numItems = 8
    let numPages = 0
    const imagePlan = {}
    const page = 1
    try {
      allItems = await API_ORGANIZATIONS.init($axios).getAllUsers(
        $auth.user.loggedOrganization.id
      )
      numPages = Math.ceil(allItems.length / numItems)
      const startIndex = 0
      const endIndex = startIndex + numItems
      const finalIndex = endIndex > allItems.length ? allItems.length : endIndex
      filteredItems = allItems.slice(0, allItems.length)
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
      checkboxes: [false, false, false, false, false],
      isFocused: false,
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
        const first = this.allItems[i].name.toLowerCase()
        const last = this.allItems[i].surname.toLowerCase()

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
          let added = false
          if (this.checkboxes[0] && this.filteredItems[i].role === 'USER') {
            newFilteredItems.push(this.filteredItems[i])
            added = true
          } else if (
            this.checkboxes[1] &&
            this.filteredItems[i].role === 'ADMIN'
          ) {
            newFilteredItems.push(this.filteredItems[i])
            added = true
          } else if (
            this.checkboxes[2] &&
            this.filteredItems[i].role === 'EDITOR'
          ) {
            newFilteredItems.push(this.filteredItems[i])
            added = true
          }
          const noRoleSelected = !(
            this.checkboxes[0] ||
            this.checkboxes[1] ||
            this.checkboxes[2]
          )
          if (added) {
            if (this.checkboxes[3] && !this.filteredItems[i].enabled)
              newFilteredItems.pop()
            else if (this.checkboxes[4] && this.filteredItems[i].enabled)
              newFilteredItems.pop()
          } else if (
            noRoleSelected &&
            this.checkboxes[3] &&
            this.filteredItems[i].enabled
          )
            newFilteredItems.push(this.filteredItems[i])
          else if (
            noRoleSelected &&
            this.checkboxes[4] &&
            !this.filteredItems[i].enabled
          )
            newFilteredItems.push(this.filteredItems[i])
        }
        this.filteredItems = newFilteredItems
      }
      this.updateItems()
    },
    sortItems(sorting) {
      this.sorting = sorting
      switch (this.sorting) {
        case 1:
          console.log(this.filteredItems)
          this.filteredItems.sort((a, b) =>
            new Date(a.membershipDate) > new Date(b.membershipDate)
              ? 1
              : new Date(b.membershipDate) > new Date(a.membershipDate)
              ? -1
              : 0
          )
          break
        case 2:
          console.log(this.filteredItems)
          this.filteredItems.sort((a, b) =>
            new Date(b.membershipDate) > new Date(a.membershipDate)
              ? 1
              : new Date(a.membershipDate) > new Date(b.membershipDate)
              ? -1
              : 0
          )
          break
        default:
          this.filteredItems.sort((a, b) =>
            a.name.toLowerCase() + a.surname.toLowerCase() >
            b.name.toLowerCase() + b.surname.toLowerCase()
              ? 1
              : b.name.toLowerCase() + b.surname.toLowerCase() >
                a.name.toLowerCase() + a.surname.toLowerCase()
              ? -1
              : 0
          )
      }
      this.updateItems()
    },
  },
}
</script>
