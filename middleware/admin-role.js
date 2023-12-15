import { roles } from '~/constants'

export default function ({ $auth, redirect }) {
  if (
    !($auth.user.role === roles.SUPER_ADMIN) &&
    !($auth.user.role === roles.ADMIN)
  ) {
    redirect('/')
  }
}
