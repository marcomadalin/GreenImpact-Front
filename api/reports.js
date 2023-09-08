class API_REPORTS {
  planUUID = null
  apiEndpoint = '/b2b/reporting/'

  init($axios, planUUID) {
    this.$axios = $axios
    this.planUUID = planUUID
    this.apiEndpoint = `/b2b/reporting/standard/497f569d-c89d-4312-8836-bacdf1d36e67`
    return this
  }

  async get() {
    return await this.$axios.$get(`${this.apiEndpoint}`)
  }
}
export default new API_REPORTS()
