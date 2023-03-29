/**
 *
 * Icon16.js
 *
 * Renders an image with size is 16px;
 */

import React from 'react';
import { Link } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import LogoImage from 'images/logo.svg';
function Logo() {
  return (
    <Link to="/">
      <SVG src={LogoImage} height={40} width="auto" tile="logo" />
    </Link>
  );
}

// We require the use of src and alt, only enforced by react in dev mode
Logo.propTypes = {};

export default Logo;
