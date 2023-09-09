import { toast } from 'react-toastify'

function warningHelp (message) {
  if (message) {
    toast.warn(message)
  }
}

export default warningHelp