class API_IND {
  apiEndpoint = '/b2b/indicators'

  init($axios) {
    this.$axios = $axios
    return this
  }

  async list() {
    return await this.$axios.$get(`${this.apiEndpoint}/`)
  }

  async listCustom(organizationId) {
    return await this.$axios.$get(
      `indicator/indicators/${organizationId}/byFramework`,
      {
        params: {
          framework: 'CUSTOM',
        },
      }
    )
  }

  async getMeasures() {
    return await this.$axios.$get(`indicator/indicators/allMeasures`)
  }

  async getDimensionalTypes() {
    return await this.$axios.$get(
      `${this.apiEndpoint}/quantitative/dimensional/types`
    )
  }

  async getQualitativeTypes() {
    return await this.$axios.$get(`${this.apiEndpoint}/qualitative/types`)
  }

  async delete(indicatorUUID) {
    return await this.$axios.$delete(`${this.apiEndpoint}/${indicatorUUID}`)
  }

  async create(data) {
    return await this.$axios.$post(`indicator/indicators/new`, data)
  }
}
export default new API_IND()
