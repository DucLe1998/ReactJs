import React from 'react';
import { Dialog as MuiDialog, Slide } from '@material-ui/core';
import DialogTitle from 'components/DialogTitle';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide ref={ref} {...props} direction="down" />;
});

export default function Dialog(props) {
  const { title, onClose, children, ...other } = props;
  return (
    <MuiDialog TransitionComponent={Transition} {...other}>
      <DialogTitle onClose={onClose}>{title}</DialogTitle>
      {children}
    </MuiDialog>
  );
}
