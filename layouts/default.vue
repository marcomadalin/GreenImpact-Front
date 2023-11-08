<template>
  <v-app :key="componentKey">
    <v-navigation-drawer
      :key="mini"
      :expand-on-hover="mini"
      :mini-variant="mini"
      app
      class="pt-16"
      color="white"
      mini-variant-width="64px"
      permanent
    >
      <v-list dense rounded>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :inactive="item.disabled"
          :to="item.to"
          color="primary"
          exact-path
          nuxt
        >
          <v-list-item-icon>
            <img
              :src="require(`assets/img/icons/${item.icon}`)"
              class="iconDrawer"
            />
          </v-list-item-icon>
          <v-list-item-content color="primary">
            <v-list-item-title
              color="primary"
              style="color: #011d89 !important; font-family: Inter !important"
              >{{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider
        v-if="isAdminRole || isEditorRole || isSuperAdminRole"
      ></v-divider>
      <v-list v-if="isAdminRole || isEditorRole || isSuperAdminRole">
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-2">
              {{ $t('administration') }}
            </v-list-item-title>
            <v-list-item-subtitle
              >{{ $t('managementPanel') }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list
        v-if="isAdminRole || isEditorRole || isSuperAdminRole"
        dense
        rounded
      >
        <div v-for="itemAdmin in menuAdminItems" :key="itemAdmin.titleAdm">
          <v-list-item
            v-if="
              !(itemAdmin.titleAdm === $t('userManagement') && isEditorRole) &&
              !(
                itemAdmin.titleAdm === $t('indicatorManagement') && isEditorRole
              )
            "
            :to="itemAdmin.toAdm"
            color="primary"
            nuxt
          >
            <v-list-item-icon>
              <img
                :src="require(`assets/img/icons/${itemAdmin.iconAdm}`)"
                class="iconDrawer"
              />
            </v-list-item-icon>
            <v-list-item-content color="primary">
              <v-list-item-title
                color="primary"
                style="color: #011d89 !important; font-family: Inter !important"
                >{{ itemAdmin.titleAdm }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>

      <v-divider v-if="isSuperAdminRole"></v-divider>
      <v-list v-if="isSuperAdminRole">
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-2">
              {{ $t('administrationSuper') }}
            </v-list-item-title>
            <v-list-item-subtitle
              >{{ $t('managementPanelSuper') }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if="isSuperAdminRole" dense rounded>
        <div
          v-for="itemSuperAdmin in menuSuperAdminItems"
          :key="itemSuperAdmin.titleAdm"
        >
          <v-list-item :to="itemSuperAdmin.toSuperAdm" color="primary" nuxt>
            <v-list-item-icon>
              <v-icon color="#3233c1">mdi-office-building-cog-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content color="primary">
              <v-list-item-title
                color="primary"
                style="color: #011d89 !important; font-family: Inter !important"
                >{{ itemSuperAdmin.titleSuperAdm }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      align="center"
      color="primary"
      fixed
      height="60px"
      justify="center"
      style="z-index: 9999"
    >
      <nuxt-link to="/">
        <img src="~assets/img/imagotipo-app.svg" />
      </nuxt-link>
      <div id="switch">
        <v-select
          v-model="loggedOrg"
          :items="organizations"
          :menu-props="{ bottom: true, offsetY: true }"
          background-color="blue"
          class="my-select px-0 mt-6 ml-5"
          dense
          height="40px"
          item-color="blue"
          item-text="organizationName"
          item-value="organizationName"
          rounded
          solo
          @change="changeOrganization"
        >
          <template #selection="{ item }">
            <img
              :src="item.image"
              aspect-ratio="1"
              class="mr-2 ml-0 px-0 my-1 py-0"
              height="30"
              style="border-radius: 50%"
              width="30"
            />{{ truncateString(item.organization.organizationName) }}
          </template>

          <template #item="{ item }">
            <img
              :src="item.image"
              aspect-ratio="1"
              class="mr-2 ml-0 px-0 my-2 py-0"
              height="30"
              style="border-radius: 50%"
              width="30"
            />{{ item.organization.organizationName }}
          </template>
        </v-select>
      </div>
      <v-spacer></v-spacer>
      <!--
      <v-btn class="mx-2" color="white" icon elevation="0">
        <v-icon color="white">mdi-help-circle-outline</v-icon>
      </v-btn>
      -->
      <v-menu
        v-if="
          loggedOrg &&
          loggedOrg.organization &&
          ((isEditorRole && logbookProduct) ||
            isAdminRole ||
            isSuperAdminRole ||
            (isUserRole &&
              logbookProduct &&
              init &&
              loggedOrg.organization.logbook &&
              loggedOrg.organization.logbook.logBookEnabled &&
              loggedOrg.organization.logbook.folders[0].items.length))
        "
        offset-y
      >
        <template #activator="{ on, attrs }">
          <v-btn
            class="mx-2"
            color="white"
            elevation="0"
            icon
            v-bind="attrs"
            x-large
            v-on="on"
          >
            <img
              :src="require(`assets/img/icons/entities.svg`)"
              class="iconHeader"
            />
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item-group color="primary">
            <v-list-item
              v-if="isAdminRole || isSuperAdminRole"
              @click="toEntityProfile"
            >
              <v-list-item-icon class="mr-2">
                <img
                  :src="require(`assets/img/icons/entitiesBlue.svg`)"
                  class="iconDrawer"
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-body-2" color="grey">
                  {{ $t('profileEntity') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="
                hasLogbook &&
                init &&
                (isSuperAdminRole ||
                  isAdminRole ||
                  isEditorRole ||
                  (isUserRole &&
                    loggedOrg.organization.logbook &&
                    loggedOrg.organization.logbook.logBookEnabled))
              "
            >
              <v-list-item-content>
                <logbook-tooltip
                  :edit="!isUserRole"
                  :entity="loggedOrg.organization"
                  :logbook="loggedOrg.organization.logbook"
                ></logbook-tooltip>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>

      <v-menu v-if="isAdminRole || isSuperAdminRole" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            class="mx-2"
            color="white"
            elevation="0"
            icon
            v-bind="attrs"
            x-large
            v-on="on"
          >
            <img
              :src="require(`assets/img/icons/users.svg`)"
              class="iconHeader"
            />
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item-group
            v-if="isAdminRole || isSuperAdminRole"
            color="primary"
          >
            <v-list-item @click="toUserList">
              <v-list-item-icon class="mr-2">
                <img
                  :src="require(`assets/img/icons/user-management.svg`)"
                  class="iconDrawer"
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-body-2" color="grey">
                  {{ $t('userManagement') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="isAdminRole || isSuperAdminRole"
              @click="toUserAdd"
            >
              <v-list-item-icon class="mr-2">
                <img
                  :src="require(`assets/img/icons/user-new.svg`)"
                  class="iconDrawer"
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-body-2" color="grey">
                  {{ $t('newUser') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>

      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            class="mr-2"
            color="white"
            elevation="0"
            icon
            v-bind="attrs"
            x-large
            v-on="on"
          >
            <img
              :src="require(`assets/img/icons/notifications.svg`)"
              class="iconHeader"
            />
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item-group color="primary">
            <v-list-item>
              <v-list-item-icon class="mr-2">
                <img
                  :src="require(`assets/img/icons/Error.svg`)"
                  class="iconDrawer"
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-body-2">
                  {{ $t('noAlerts') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-menu v-if="organizations[0]" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            id="avatar"
            class="white--text ml-2 caption"
            color="blue"
            fab
            height="45px"
            v-bind="attrs"
            width="45px"
            v-on="on"
          >
            {{
              firstCapitalized(organizations[0].user.firstName) +
              firstCapitalized(organizations[0].user.lastName)
            }}
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item-group color="primary">
            <v-list-item @click.prevent="userSettings($auth.user.userUuid)">
              <v-list-item-icon class="mr-2">
                <img
                  :src="require(`assets/img/icons/users-blue.svg`)"
                  class="iconDrawer"
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-body-2" color="grey">
                  {{ $t('profile') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click.prevent="logout">
              <v-list-item-icon class="mr-2">
                <img
                  :src="require(`assets/img/icons/Logout.svg`)"
                  class="iconDrawer"
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-body-2" color="grey">
                  {{ $t('logout') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="lightGray p-0 pt-4" @updateImage="changeImage()">
      <v-container class="pt-16" fluid>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import API_USERS from '~/api/users'
import API_LOGBOOK from '~/api/logbook'

export default {
  name: 'Default',
  data() {
    console.log('DEFAULT LAYOUT')
    return {
      organizations: [],
      loggedOrg: null,
      mini: true,
      init: false,
      componentKey: 0,
    }
  },
  computed: {
    menuItems() {
      return [
        {
          title: this.$t('executiveReport'),
          icon: 'overview.svg',
          to: { name: 'index' },
        },
        {
          title: this.$t('plansOnly'),
          icon: 'plans.svg',
          to: { name: 'action-plan' },
        },
        {
          title: this.$t('riskIndicators'),
          icon: 'Indicators-risk.svg',
          to: { name: 'indicators-at-risk' },
        },
        {
          title: this.$t('goodIndicators'),
          icon: 'Indicators-uptodate.svg',
          to: { name: 'indicators-uptodate' },
        },
        {
          title: this.$t('reports'),
          icon: 'reports.svg',
          to: { name: 'reports' },
        },
        {
          title: this.$t('indicators'),
          icon: 'indicators.svg',
          to: { name: 'indicators-explorer' },
        },
        {
          title: this.$t('communication'),
          icon: 'communication.svg',
          disabled: false,
          to: { name: 'communication' },
        },
      ]
    },
    menuAdminItems() {
      return [
        {
          titleAdm: this.$t('planManage'),
          iconAdm: 'plan-management.svg',
          toAdm: { name: 'plan-list' },
        },
        {
          titleAdm: this.$t('indicatorManagement'),
          iconAdm: 'indicator-management.svg',
          toAdm: { name: 'indicator-list' },
          // toAdm: { name: 'indicator-add' },
        },
        {
          titleAdm: this.$t('userManagement'),
          iconAdm: 'user-management.svg',
          toAdm: { name: 'user-list' },
        },
        {
          titleAdm: this.$t('integrations'),
          iconAdm: 'integrations.svg',
          toAdm: { name: 'integrations' },
        },
        /*
        {
          titleAdm: this.$t('notifications'),
          iconAdm: 'notifications-management.svg',
          toAdm: { name: 'notification-settings' },
        },
        {
          titleAdm: this.$t('Social media setup'),
          iconAdm: 'mdi-account-group-outline',
          toAdm: { name: 'social-media' },
        },
        {
          titleAdm: this.$t('Blockchain'),
          iconAdm: 'mdi-key-chain',
          toAdm: { name: 'indicator-add' },
        },
        */
      ]
    },
    menuSuperAdminItems() {
      return [
        {
          titleSuperAdm: this.$t('entitiesManage'),
          iconSuperAdm: 'overview.svg',
          toSuperAdm: { name: 'entity-list' },
        },
      ]
    },
  },
  async beforeMount() {
    try {
      const API = API_USERS.init(
        this.$axios,
        this.$auth.user.loggedOrganizationUuid
      )
      this.organizations = await API.getOrganizations()

      this.organizations = await Promise.all(
        this.organizations.map(async (org) => {
          const path = await API.getOrganizationImage(
            org.organization.organizationUUID
          )

          // TODO: this s3 should not be hardcoded!
          org.image = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`

          if (
            this.$auth.user.loggedOrganizationUuid ===
            org.organization.organizationUUID
          ) {
            this.loggedOrg = org
            this.loggedOrg.organization.logbook = null
            if (this.hasLogbook) {
              try {
                this.loggedOrg.organization.logbook = await API_LOGBOOK.init(
                  this.$axios
                ).getOrgLogbook(this.loggedOrg.organization.organizationUUID)
              } catch (e) {
                console.log(e.response)
              }
            }
          }
          return org
        })
      )
      this.init = true

      // this.organizations.map((org) => (org.image = ''))
      // for (let i = 0; i < this.organizations.length; i++) {
      //   const path = await API.getOrganizationImage(
      //     this.organizations[i].organization.organizationUUID
      //   )
      //   this.organizations[
      //     i
      //   ].image = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
      //   if (
      //     this.$auth.user.loggedOrganizationUuid ===
      //     this.organizations[i].organization.organizationUUID
      //   )
      //     this.loggedOrg = this.organizations[i]
      // }
    } catch (e) {
      console.log(e.response)
    }
  },

  mounted() {
    this.$nuxt.$on('updateImage', async () => {
      await this.updateOrgs()
    })
  },

  methods: {
    async updateOrgs() {
      const API = API_USERS.init(
        this.$axios,
        this.$auth.user.loggedOrganizationUuid
      )

      this.organizations = await Promise.all(
        this.organizations.map(async (org) => {
          const path = await API.getOrganizationImage(
            org.organization.organizationUUID
          )

          org.image = `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
          return org
        })
      )
      this.componentKey += 1
    },
    firstCapitalized(name) {
      return name ? name[0].toUpperCase() : ''
    },
    userSettings(useruuid) {
      this.$router.push({ path: `/user/${useruuid}/settings` })
    },
    toUserList() {
      this.$router.push({ name: 'user-list' })
    },
    toEntityProfile() {
      this.$router.push({
        name: 'entity-profile',
        params: { id: this.$auth.user.loggedOrganizationUuid },
      })
    },
    toUserAdd() {
      this.$router.push({ name: 'user-add' })
    },
    async logout() {
      await this.$auth.logout()
      window.location.reload()
    },
    truncateString(data) {
      if (data.length < 25) return data
      else return data.split('').slice(0, 20).join('') + '...'
    },
    async changeOrganization() {
      try {
        const user = await API_USERS.init(
          this.$axios,
          this.$auth.user.loggedOrganizationUuid
        ).changeOrganization(this.loggedOrg.organization.organizationUUID)

        await this.$auth.setUser(user)
        await this.$auth
          .setUserToken(user.accessToken)
          .then(this.$nextTick(() => window.location.reload()))
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
<style lang="scss">
> .v-select__selection,
.v-select__selection--comma,
.v-select.v-text-field input {
  color: white !important;
}

.my-select .v-input__slot {
  padding: 6px !important;
  width: 280px;
  display: inline-flex;
  box-shadow: none !important;
}

#switch .v-select__selections {
  color: white !important;
}

#switch .mdi-menu-down,
#switch .mdi-menu-down:after,
#switch .mdi-menu-down:before {
  color: white !important;
}

.v-list-item.blue--text.v-list-item--active.v-list-item--link.theme--light.v-list-item--highlighted {
  background-color: white !important;
  color: #011d89 !important;
}

.v-list-item.blue--text.v-list-item--active.v-list-item--link.theme--light {
  background-color: white !important;
  color: #011d89 !important;
}

.v-list-item.blue--text.v-list-item--active.v-list-item--link.theme--light:before,
.v-list-item.blue--text.v-list-item--active.v-list-item--link.theme--light:after {
  background-color: white !important;
  color: white !important;
}

.v-list-item.blue--text.v-list-item--active.v-list-item--link.theme--light:hover {
  background-color: #e6e6ec !important;
}

.v-menu__content.theme--light.v-menu__content--fixed.menuable__content__active {
  box-shadow: none !important;
}

#avatar {
  box-shadow: none !important;
}

.iconHeader {
  width: 35px;
  height: 35px;
}

.iconDrawer {
  width: 25px;
  height: 25px;
}
</style>
