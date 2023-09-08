import { roles } from '~/constants'

export default function ({ $auth, redirect }) {
  if (
    !$auth.user.roles.includes(roles.SUPER_ADMIN) &&
    !$auth.user.roles.includes(roles.ADMIN)
  ) {
    redirect('/')
  }
}
