import { roles } from '~/constants'

export default function ({ $auth, redirect }) {
  if (!$auth.user.roles.includes(roles.EDITOR)) {
    redirect('/')
  }
}
