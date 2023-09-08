class API_MA2030 {
  apiEndpoint = '/b2b/ma2030'

  init($axios) {
    this.$axios = $axios
    return this
  }

  async plansImpact(data) {
    return await this.$axios.$post(`${this.apiEndpoint}/plansImpact/`, data)
  }
}
export default new API_MA2030()
