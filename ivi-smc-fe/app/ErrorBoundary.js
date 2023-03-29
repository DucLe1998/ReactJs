import React from 'react';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch() {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      //     Swal.fire({
      //         title: 'Có phiên bản cập nhật mới',
      //         html:
      //             'Chúng tôi phát hiện có phiên bản mới cho website. Bạn cần tải lại trang để cập nhật bản mới nhất.',
      //         icon:'question',
      //         imageWidth: 213,
      //         showCancelButton: true,
      //         showCloseButton: true,
      //         showConfirmButton: true,
      //         focusCancel: true,
      //         confirmButtonColor: '#3085d6',
      //         confirmButtonText: 'Tải lại trang',
      //         cancelButtonText: 'Không',
      //         customClass: {
      //             content: 'content-class',
      //         },
      //     }).then(result => {
      //         if (result.value) {
      //             window.location.reload();
      //         }
      //     });
      //     // You can render any custom fallback UI
      //     return <h1>Bạn cần tải lại trang để cập nhật phiên bản mới nhất.</h1>;
      return <h4>Bạn cần tải lại trang để cập nhật phiên bản mới nhất.</h4>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
