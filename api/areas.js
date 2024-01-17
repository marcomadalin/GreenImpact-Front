class API {
  planUUID = null
  apiEndpoint = '/b2b/plans/'

  init($axios, planUUID) {
    this.$axios = $axios
    this.planUUID = planUUID
    this.apiEndpoint = `/b2b/plans/${this.planUUID}`
    return this
  }

  async getRelatedAreas(organizationId, indicatorId) {
    return await this.$axios.$get(`plan/areas/${organizationId}/${indicatorId}/relatedAreas`)
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

  // indicators
  async addIndicator(id, data) {
    return await this.$axios.$post(`${this.apiEndpoint}/${id}/new`, data)
  }

  async getIndicator(id, indicatorId) {
    return await this.$axios.$get(`${this.apiEndpoint}/${id}/${indicatorId}`)
  }

  async deleteIndicator(id, indicatorId) {
    return await this.$axios.$delete(`${this.apiEndpoint}/${id}/${indicatorId}`)
  }

  async listIndicatorSample(id, indicatorId) {
    return await this.$axios.$get(
      `${this.apiEndpoint}/${id}/${indicatorId}/samples`
    )
  }

  // samples
  async addIndicatorSample(id, indicatorId, data) {
    return await this.$axios.$post(
      `${this.apiEndpoint}/${id}/${indicatorId}/samples/new`,
      data
    )
  }

  async bulkAddIndicatorSample(id, indicatorId, arrayData) {
    return await this.$axios.$post(
      `${this.apiEndpoint}/${id}/${indicatorId}/samples/newBulk`,
      arrayData
    )
  }

  async getIndicatorSample(id, indicatorId, sampleId) {
    return await this.$axios.$get(
      `${this.apiEndpoint}/${id}/${indicatorId}/samples/${sampleId}`
    )
  }

  async updateIndicatorSample(id, indicatorId, sampleId, data) {
    return await this.$axios.$put(
      `${this.apiEndpoint}/${id}/${indicatorId}/samples/${sampleId}`,
      data
    )
  }

  async removeIndicatorSample(id, indicatorId, sampleId) {
    return await this.$axios.$delete(
      `${this.apiEndpoint}/${id}/${indicatorId}/samples/${sampleId}`
    )
  }

  // objectives
  async addIndicatorObjective(id, indicatorId, data) {
    return await this.$axios.$post(
      `${this.apiEndpoint}/${id}/${indicatorId}/objectives/new`,
      data
    )
  }

  async bulkAddIndicatorObjective(id, indicatorId, arrayData) {
    return await this.$axios.$post(
      `${this.apiEndpoint}/${id}/${indicatorId}/objectives/newBulk`,
      arrayData
    )
  }

  getIndicatorObjective(id, indicatorId, objectiveId) {
    throw new Error('Not Implemented `getIndicatorObjective`')
  }

  updateIndicatorObjective(id, indicatorId, objectiveId, data) {
    throw new Error('Not Implemented `updateIndicatorObjective`')
  }

  async removeIndicatorObjective(id, indicatorId, objectiveId) {
    return await this.$axios.$delete(
      `${this.apiEndpoint}/${id}/${indicatorId}/objectives/${objectiveId}`
    )
  }
}
export default new API()
