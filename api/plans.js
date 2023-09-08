class API {
  apiEndpoint = '/b2b/plans'

  init($axios) {
    this.$axios = $axios
    return this
  }

  async list() {
    return await this.$axios.$get(`${this.apiEndpoint}/`)
  }

  async create(data) {
    return await this.$axios.$post(`${this.apiEndpoint}/new/`, data)
  }

  async get(id) {
    return await this.$axios.$get(`${this.apiEndpoint}/${id}`)
  }

  async update(id, data) {
    return await this.$axios.$put(`${this.apiEndpoint}/${id}`, data)
  }

  async remove(id) {
    return await this.$axios.$delete(`${this.apiEndpoint}/${id}`)
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
export default new API()
