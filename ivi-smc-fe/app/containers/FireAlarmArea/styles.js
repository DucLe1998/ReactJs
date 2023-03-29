import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

export const useStyles = makeStyles(() => ({
  root: {
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
    '& .MuiPaper-root': {
      padding: '16px 32px 32px 32px',
      minHeight: 'calc(100vh - 160px)',
    },
  },
  label: {
    fontWeight: '500',
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '104px',
    boxSizing: 'border-box',
  },
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
  popup: {
    zIndex: '1299 !important',
    '& .title': {
      padding: '0px',
    },
  },
  uploadImageContainer: {
    width: '100%',
    borderRadius: '12px',
    height: '405px',
    display: 'flex',
    justifyContent: 'center',
  },
  colorPlaceholer: {
    '& input::placeholder': {
      opacity: '1 !important',
    },
  },
  cardImageContainer: {
    width: '100%',
    height: '405px',
    display: 'flex',
    flexFlow: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    '& .add-btn': {
      border: '1.5px dashed rgba(0, 0, 0, 0.48)',
    },
    '& .card-img': {
      position: 'relative',
      maxWidth: '100%',
      maxHeight: '405px',
      '& .hover-image': {
        maxWidth: '100%',
        maxHeight: '405px',
        background: 'rgb(206, 209, 215)',
        objectFit: 'contain',
        borderRadius: '8px',
      },
    },
    '& .card-img .close': {
      padding: '0px',
      position: 'absolute',
      top: '10px',
      right: '10px',
      color: '#000',
      backgroundColor: '#fff',
      '& .MuiIconButton-label': {
        width: '24px',
        height: '24px',
      },
    },
  },
}));

export const BtnCancelWrap = styled.div`
  .dx-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 116px;
    height: 40px;
    background: ${props => props?.bgColor || '#e2e2e2'};
    border: 1px solid #dddddd;
    box-sizing: border-box;
    border-radius: 8px;
    color: ${props => props.color || 'rgba(0, 0, 0, 0.8)'};
    &:hover {
      opacity: 0.9;
      box-shadow: 0px 4px 10px ${props => props?.bgColor || '#e2e2e2'};
      background: ${props => props?.bgColor || '#e2e2e2'};
    }
  }
`;
