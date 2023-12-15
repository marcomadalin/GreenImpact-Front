import { roles } from '~/constants'

export default function ({ $auth, redirect }) {
  if (!($auth.user.role === roles.EDITOR)) {
    redirect('/')
  }
}
