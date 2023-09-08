<template>
  <div
    style="width: 100% !important; border-radius: 13px"
    class="white plain-shadow"
  >
    <v-col class="px-0 pt-0 mr-0" cols="12">
      <div id="indicatorHeader" class="mb-0 px-4 text-caption blue--text">
        <img
          class="iconIndicator"
          :src="require(`assets/img/icons/indicators.svg`)"
        />
        <span class="blue--text text-body-2 mb-0 pb-0 ml-2 mr-auto">
          {{ $t('indicator') }}
        </span>
      </div>
      <v-container
        fluid
        class="white lighten-5 text-body-1 darkBlue--text px-4 mt-1 mb-0 pb-2 mt-0 pt-2"
      >
        <div class="d-flex align-start">
          <input
            v-if="addOds"
            :id="indicator.indicatorUUID"
            v-bind:checked="checked.includes(indicator.indicatorUUID)"
            :value="indicator.indicatorUUID"
            type="checkbox"
            class="mt-1 mr-2"
            @change="
              $emit(
                'change',
                newSelection($event.target.checked, indicator.indicatorUUID)
              )
            "
          />
          <p class="text--body-2 mb-2" style="color: #060632">
            {{ indicator.indicatorDTO.indicatorName }}
          </p>
        </div>
      </v-container>
      <v-container fluid class="white lighten-5 my-0 py-5 px-4">
        <v-row no-gutters class="mt-0 pt-0">
          <v-spacer></v-spacer>
          <v-col cols="auto" class="px-4">
            <v-row id="indicatorIcons">
              <p class="mr-3 gray--text text-caption my-0">
                {{ getIndicatorType(indicator.indicatorDTO.indicatorType) }}
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
                  :src="ods"
                  aspect-ratio="1"
                  height="100%"
                  weight="100%"
                />
              </v-card>
              <v-card
                v-if="image"
                width="28px"
                height="28px"
                rounded="0"
                flat
                :ripple="false"
                class="pa-0"
              >
                <v-img
                  :src="image"
                  aspect-ratio="1"
                  height="100%"
                  weight="100%"
                />
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    indicator: {
      type: Object,
      default: () => {},
    },
    selectedIndicator: {
      type: Object,
      default: () => {},
    },
    image: {
      type: String,
      default: null,
    },
    indicatorImage: {
      type: String,
      default: null,
    },
    checked: {
      type: Array,
      default: () => [],
    },
    addOds: {
      type: Boolean,
      default: false,
    },
    levels: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getIndicatorType(type) {
      const parts = type.toLowerCase().split('_')
      let result = ''
      if (parts.length > 1)
        result =
          parts[0] + parts[1].charAt(0).toUpperCase() + parts[1].substring(1)
      else result = parts[0]
      return this.$t(result)
    },
    newSelection(isChecked, value) {
      if (this.checked instanceof Array) {
        const newValue = [...this.checked]
        if (isChecked) {
          newValue.push(value)
        } else {
          newValue.splice(newValue.indexOf(value), 1)
        }
        return newValue
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.header-number {
  font-size: 36px !important;
}

#indicatorHeader {
  background: #e8e4ec;
  height: 46px;
  border-top-right-radius: 13px;
  border-top-left-radius: 13px;
  display: flex;
  align-items: center;
}
#indicatorIcons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
#planblock {
  box-shadow: none !important;
}
.full-width-div {
  position: absolute;
  width: 100%;
  left: 0;
}
.iconIndicator {
  width: 18px;
  height: 18px;
}
</style>
