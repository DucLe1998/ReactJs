import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Poppins', sans-serif;
  }

  body.fontLoaded {
    font-family: 'Roboto', sans-serif;
  }
  #app {
    background-color: #e0e0e0;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    line-height: 1.5em;
  }
  .dx-empty {
      display: none;
  }
  .align-end {
    text-align: right;
  }
  .mb-5 {
    margin-bottom: 5px
  }
  .pr-5-i {
    padding-right: 5px !important;
  }
  .pb-10 {
    padding-bottom: 10px;
  }
  
  .snackbar-noti {
    padding: 0 !important;
    border-radius: 10px !important;
  }
  #notistack-snackbar {
    padding: 0 !important;
  }
  .vin-popper-noti {
    background: #fff;
    padding: 0 !important;
    width: 400px;
    max-height: 400px;
    border-radius: 10px;
    border: 1px solid #F6F6F6;
    box-sizing: border-box;
    box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.15);
    margin-top:17px;
    z-index: 10;
  }
  .swal2-styled.swal-btn-confirm {
    background-color: var(--primary-color);
  }
`;

export default GlobalStyle;
