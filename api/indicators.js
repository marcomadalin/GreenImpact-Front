class API_IND {
  apiEndpoint = '/b2b/indicators'

  init($axios) {
    this.$axios = $axios
    return this
  }

  async list() {
    return await this.$axios.$get(`${this.apiEndpoint}/`)
  }

  async listCustom() {
    return await this.$axios.$get(`${this.apiEndpoint}/custom`)
  }

  async getMUnits() {
    return await this.$axios.$get(
      `${this.apiEndpoint}/quantitative/measurementUnits`
    )
  }

  async getDimensionalTypes() {
    return await this.$axios.$get(
      `${this.apiEndpoint}/quantitative/dimensional/types`
    )
  }

  async getQualitativeTypes() {
    return await this.$axios.$get(`${this.apiEndpoint}/qualitative/types`)
  }

  async createQuantitative(data) {
    return await this.$axios.$post(
      `${this.apiEndpoint}/quantitative/new/`,
      data
    )
  }

  async createQuantitativeDimensional(data) {
    return await this.$axios.$post(
      `${this.apiEndpoint}/quantitative/dimensional/new/`,
      data
    )
  }

  async createQualitative(data) {
    return await this.$axios.$post(`${this.apiEndpoint}/qualitative/new/`, data)
  }

  async delete(indicatorUUID) {
    return await this.$axios.$delete(`${this.apiEndpoint}/${indicatorUUID}`)
  }

  async create(data) {
    if (data.indicatorType === 'QUANTITATIVE') {
      return await this.createQuantitative(data)
    }
    if (data.indicatorType === 'QUANTITATIVE_DIMENSIONAL') {
      return await this.createQuantitativeDimensional(data)
    }
    if (data.indicatorType === 'QUALITATIVE') {
      return await this.createQualitative(data)
    }
  }
}
export default new API_IND()
