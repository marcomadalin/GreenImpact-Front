class API_LOGBOOK {
  apiEndpoint = '/b2b/logbook'

  init($axios) {
    this.$axios = $axios
    return this
  }

  async createLogbook(data) {
    return await this.$axios.$post(`${this.apiEndpoint}/new`, data)
  }

  async getLogbook(logbookId) {
    return await this.$axios.$get(`${this.apiEndpoint}/${logbookId}`)
  }

  async getOrgLogbook(orgUUID) {
    return await this.$axios.$get(`${this.apiEndpoint}/byOrg/${orgUUID}`)
  }

  async getPlanLogbooks(orgUUID) {
    return await this.$axios.$get(
      `${this.apiEndpoint}/byOrg/${orgUUID}/planLogbooks`
    )
  }

  async getAreaLogbooks(orgUUID, planUUID) {
    return await this.$axios.$get(
      `${this.apiEndpoint}/byOrg/${orgUUID}/${planUUID}/areaLogbooks`
    )
  }

  async getIndicatorLogbooks(orgUUID, planUUID, areaId) {
    return await this.$axios.$get(
      `${this.apiEndpoint}/byOrg/${orgUUID}/${planUUID}/${areaId}/areaIndicatorLogbooks`
    )
  }

  async enableLogbook(logbookId) {
    return await this.$axios.$put(`${this.apiEndpoint}/${logbookId}/enable`)
  }

  async disableLogbook(logbookId) {
    return await this.$axios.$put(`${this.apiEndpoint}/${logbookId}/disable`)
  }

  async createNote(logbookId, data) {
    return await this.$axios.$post(
      `${this.apiEndpoint}/note/${logbookId}/new`,
      data
    )
  }

  async updateNote(logbookId, noteId, data) {
    return await this.$axios.$put(
      `${this.apiEndpoint}/note/${logbookId}/${noteId}`,
      data
    )
  }

  async deleteNote(logbookId, noteId) {
    return await this.$axios.$delete(
      `${this.apiEndpoint}/note/${logbookId}/${noteId}`
    )
  }

  async createFile(logbookId, data) {
    return await this.$axios.$post(
      `${this.apiEndpoint}/file/${logbookId}/new`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  }

  async getFile(logbookId, fileId) {
    return await this.$axios.$get(
      `${this.apiEndpoint}/file/${logbookId}/${fileId}`,
      { responseType: 'blob' }
    )
  }

  async deleteFile(logbookId, fileId) {
    return await this.$axios.$delete(
      `${this.apiEndpoint}/file/${logbookId}/${fileId}`
    )
  }
}
export default new API_LOGBOOK()
