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

  async delete(indicatorId) {
    return await this.$axios.$delete(`indicator/indicators/${indicatorId}`)
  }

  async create(data) {
    return await this.$axios.$post(`indicator/indicators/new`, data)
  }
}
export default new API_IND()
