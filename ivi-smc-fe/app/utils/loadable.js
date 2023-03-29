import React, { lazy, Suspense } from 'react';
import ErrorBoundary from '../ErrorBoundary';

const loadable = (importFunc, { fallback = null } = { fallback: null }) => {
  const LazyComponent = lazy(importFunc);
  // const LazyComponent = lazy(
  //   () => importFunc()
  //     .catch(e => {
  //       //  console.log('new version.....', e.message, Cookies.get('refresh_version'));
  //       let cookieVersionDate = Cookies.get('refresh_version');
  //       if (!cookieVersionDate || Date.now() - Number(cookieVersionDate) > (3 * 60 * 1000)) {
  //         console.log('new version 2222222222.....', e.message, Cookies.get('refresh_version'));
  //         var inThreeMinutes = new Date(new Date().getTime() + 3 * 60 * 1000);
  //         Cookies.set('refresh_version', Date.now(), { expires: inThreeMinutes });
  //         window.location.reload();
  //         // Swal.fire({
  //         //   title: 'Có phiên bản cập nhật mới',
  //         //   html:
  //         //     'Chúng tôi phát hiện có phiên phản mới cho website. Bạn cần tải lại trang để cập nhật bản mới nhất.',
  //         //   imageUrl: SaveConfirm,
  //         //   imageWidth: 213,
  //         //   showCancelButton: true,
  //         //   showCloseButton: true,
  //         //   showConfirmButton: true,
  //         //   focusCancel: true,
  //         //   confirmButtonColor: '#3085d6',
  //         //   confirmButtonText: 'Tải lại trang',
  //         //   cancelButtonText: 'Không',
  //         //   customClass: {
  //         //     content: 'content-class',
  //         //   },
  //         // }).then(result => {
  //         //   if (result.value) {
  //         //     window.location.reload();
  //         //   }
  //         // });
  //       } else {
  //         throw 'Bạn cần tải lại trang để cập nhật phiên bản mới';
  //       }
  //     })
  // );

  return props => (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default loadable;
