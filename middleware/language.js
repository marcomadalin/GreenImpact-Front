export default function ({ $auth, i18n }) {
  if ($auth.user && $auth.user.locale !== i18n.locale) {
    const userLocale = $auth.user.locale
    // check if exists this locale
    if (i18n.locales.find((i) => i.code === $auth.user.locale)) {
      console.log(`user configurate locale ${userLocale}`)
      i18n.setLocale($auth.user.locale)
    }
  }
}
