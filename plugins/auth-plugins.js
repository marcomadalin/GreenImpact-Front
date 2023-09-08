export default ({ $auth }, inject) => {
  inject('getAllowedLanguages', () => ['es'])
  inject('getAllAllowedLanguages', () =>
    JSON.parse($auth.user.sustainable_entity.allowed_languages)
  )
}
