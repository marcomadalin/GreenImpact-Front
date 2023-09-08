class API {
  apiEndpoint = ''

  init($axios) {
    this.$axios = $axios
    return this
  }

  async list() {
    return await this.$axios.$get(`${this.apiEndpoint}/`)
  }

  async listNonStandard() {
    return await this.$axios.$get(`${this.apiEndpoint}/nonStandard`)
  }

  async get(id) {
    return await this.$axios.$get(`${this.apiEndpoint}/${id}/?depth=0`)
  }

  async getIndicators(id) {
    return await this.$axios.$get(
      `${this.apiEndpoint}/${id}/b2bIndicators?depth=3`
    )
  }

  async getImage() {
    const path = await this.$axios.$get(`${this.apiEndpoint}/imagePath`)
    return `https://b2b-assets-development.s3.eu-central-1.amazonaws.com/${path}?${Math.random()}`
  }

  levelImage(level) {
    return `${this.apiEndpoint}/${level}/image`
  }

  async plansImpact(ids) {
    return await this.$axios.$post(`${this.apiEndpoint}/plansImpact`, ids)
  }

  async secondaryIds() {
    return await this.$axios.$get(`${this.apiEndpoint}/secondaryIds`)
  }

  async secondaryIdsIndicators(secondaryId) {
    return await this.$axios.$get(
      `${this.apiEndpoint}/secondary/${secondaryId}`
    )
  }
}

class MA2030 extends API {
  apiEndpoint = '/b2b/ma2030'

  async addCustomIndicators(levelId, indicatorUUID) {
    return await this.$axios.$post(
      `${this.apiEndpoint}/${levelId}/addCustomIndicators`,
      [indicatorUUID]
    )
  }

  async relatedIndicators(indicatorUUID) {
    return await this.$axios.$get(
      `${this.apiEndpoint}/${indicatorUUID}/relatedB2BIndicators`
    )
  }

  async getLevel(levelId, depth) {
    return await this.$axios.$get(`${this.apiEndpoint}/${levelId}`, {
      params: {
        depth,
      },
    })
  }

  async deleteCustomIndicator(levelId, indicatorUUID) {
    return await this.$axios.$delete(
      `${this.apiEndpoint}/${levelId}/deleteCustom/${indicatorUUID}`
    )
  }
}

class AUE extends API {
  apiEndpoint = '/b2b/aue'
}

class FEDER extends API {
  apiEndpoint = '/b2b/feder'
}

class CUSTOM extends API {
  apiEndpoint = '/b2b/indicators'

  async list() {
    const endpoint = ['quantitative', 'qualitative', 'quantitative/dimensional']
    return await Promise.all(
      endpoint.map((i) => this.$axios.$get(`${this.apiEndpoint}/${i}`))
    )
  }
}

class COMMON extends API {
  apiEndpoint = 'b2b/genericfw'
  async getInfoIndicators(indicatorUUIDs) {
    return await this.$axios.$post(
      `${this.apiEndpoint}/indicatorsFws`,
      indicatorUUIDs
    )
  }
}

export const ma2030 = new MA2030()
export const aue = new AUE()
export const feder = new FEDER()
export const custom = new CUSTOM()
export const common = new COMMON()
