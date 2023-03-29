import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#FFF',
    maxWidth: 550,
    fontSize: theme.typography.pxToRem(13),
    borderRadius: 8,
  },
}))(Tooltip);

export default function CtToolTip({ text, children, placement }) {
  return (
    <HtmlTooltip placement={placement || 'bottom-start'} title={text || ''}>
      {children}
    </HtmlTooltip>
  );
}
