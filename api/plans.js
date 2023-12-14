class API_PLANS {
  apiEndpoint = '/b2b/plans'

  init($axios) {
    this.$axios = $axios
    return this
  }

  async list(organizationId) {
    return await this.$axios.$get(`plan/plans/${organizationId}/all`)
  }

  async create(data) {
    return await this.$axios.$post(`plan/plans/new`, data)
  }

  async get(id) {
    return await this.$axios.$get(`plan/plans/${id}`)
  }

  async update(id, data) {
    return await this.$axios.$put(`plan/plans/${id}`, data)
  }

  async remove(id) {
    return await this.$axios.$delete(`plan/plans/${id}`)
  }

  async addImage(id, image, cb) {
    const data = new FormData()
    data.append('image', image)

    const config = {
      onUploadProgress: function (progressEvent) {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        if (isNaN(percentCompleted)) {
          percentCompleted = null
        }
        if (cb) {
          cb(percentCompleted)
        }
      },
    }

    return await this.$axios.$post(
      `${this.apiEndpoint}/${id}/image`,
      data,
      config
    )
  }

  async getImage(id) {
    return await this.$axios.$get(`${this.apiEndpoint}/${id}/image`)
  }

  async removeImage(id) {
    return await this.$axios.$delete(`${this.apiEndpoint}/${id}/image`)
  }
}
export default new API_PLANS()
