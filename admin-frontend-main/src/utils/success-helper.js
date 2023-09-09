import { toast } from 'react-toastify'

function successHelper (message) {
  if (message) {
    toast.success(message)
  }
}

export default successHelper
