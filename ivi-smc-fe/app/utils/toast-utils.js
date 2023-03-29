import * as Swal from 'sweetalert2';
import { getErrorMessage } from 'containers/Common/function';

export function showError(message, options) {
  const mess = getErrorMessage(message);
  Toast.fire({
    icon: 'error',
    title: mess,
    ...options,
  });
}

export function showSuccess(message, options) {
  Toast.fire({
    icon: 'success',
    title: message,
    ...options,
  });
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
});
