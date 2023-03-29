/* eslint-disable no-nested-ternary,prettier/prettier */
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import TableB from '@material-ui/core/TableBody';
import TableC from '@material-ui/core/TableCell';
import TableR from '@material-ui/core/TableRow';
import TableH from '@material-ui/core/TableHead';
import Button from '@material-ui/core/Button';
import Img from 'react-image';
import { TextareaAutosize } from '@material-ui/core';
import { Button as DevextremeButton } from 'devextreme-react/button';

export const H5 = styled.h5`
  margin: 5px 0px 10px;
  color: var(--main-bg-color);
`;
export const RighButtonGroup = styled.div`
  padding: 10px 0px 0px;
  display: flex;
  justify-content: flex-end;
`;

export const SmcButton = styled(IconButton)`
  && {
    position: relative;
    padding: 8px;
    margin-left: 5px;
  }
`;
export const TextBoxGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
`;
export const TooltipLabel = styled.div`
  color: #000;
  font-size: 13px;
`;

export const HeaderWithActionButton = styled.div`
  display: flex;
  align-items: center;
`;

export const DetailInfoTable = styled.div`
  padding: 10px;
  font-size: 14px;
  width: 350px;
  color: #000;
  box-sizing: border-box;
  flex: 1;
  & tr td {
    padding: 5px 5px;
  }
  & td:first-child {
    color: #333333;
    min-width: 130px;
    font-size: 14px;
  }
`;
export const PopupHeader = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--main-bg-color);
`;

export const SubPopupHeader = styled.div`
  font-size: 16px;
  font-weight: 600;
`;
export const FixedPopupFUllScreen = styled.div`
  position: fixed;
  top: 5%;
  left: 15%;
  background-color: #fff;
  z-index: var(--z-index-popup);
  height: 90%;
  width: 70%;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px 1px var(--main-gray-color);
  overflow: auto;
`;

export const FixedPopupSmall = styled.div`
  position: fixed;
  top: 25%;
  left: 25%;
  background-color: #fff;
  z-index: 500;
  height: auto;
  width: 50%;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px 1px var(--main-gray-color);
`;

export const Backdop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: var(--z-index-popup);
  background-color: #222426a8;
`;

export const ClosePopUpButton = styled(IconButton)`
  && {
    position: absolute;
    right: 5px;
    top: 5px;
    padding: 8px;
  }
`;

export const CenterFlexContainer = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
`;

export const TwoColumnContainer = styled.div`
  display: grid;
  grid-template-columns: ${props =>
    props.columnWidth
      ? `${props.columnWidth} ${props.columnWidth}`
      : '1fr 1fr'};
  grid-gap: 10px;
  align-items: center;
`;

export const ImageResponsive = styled.img`
  width: 100%;
  height: auto;
`;

// dùng để hiển
export const EventDate = styled.div`
  position: absolute;
  top: 2px;
  left: 5px;
  font-size: 10px;
  text-shadow: 1px 1px #746f6f;
  color: #fff;
`;
export const EventLocation = styled.div`
  position: absolute;
  bottom: 2px;
  right: 3px;
  font-size: 10px;
  text-shadow: 1px 1px #746f6f;
  color: #fff;
`;
export const NoChartData = styled(Img)`
  width: 250px;
  height: auto;
  margin: auto;
  display: block;
  margin-bottom: 20px;
`;
export const InfoImage = styled(Img)`
  width: 100%;
  height: auto;
  border-radius: 5px;
`;
export const SmallButton = styled(IconButton)`
  && {
    height: 20px;
    width: 20px;
    padding: 15px;
  }
`;

export const LinkStyle = styled.div`
  display: inline-block;
  cursor: pointer;
  text-decoration: underline;
  color: var(--main-bg-color);
`;

export const NormalPopupWrapper = styled.div`
  && {
    width: 500px;
  }
  position: relative;
  display: flex;
  flex-direction: column;
  justify-items: center;
  padding: 0px 25px 25px 25px;
  background-color: white;
  z-index: var(--z-index-popup);
  border-radius: 5px;
  border: 1px solid #d9d1d1;
  box-shadow: 1px 1px 4px #a7a4a4;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export const SMCLabel = styled.div`
  color: #959a9e;
`;

export const SMCPopupGroupTitle = styled.div`
  font-size: 16px;
  color: #5a6167;
  font-weight: 600;
`;
export const SMCPopupH3 = styled.h3`
  color: #5a6167;
  font-weight: bold;
`;

export const A = styled.a`
  cursor: pointer;
  color: var(--main-bg-color);
`;
export const NoData = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: center;
  min-width: 100%;
  margin: 40px 0px;
  background-color: #f9f9f9d6;
  height: 60px;
  align-items: center;
`;

export const EventImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
`;

export const H4 = styled.h4`
  margin: 0px;
  font-size: 18px;
  text-transform: uppercase;
  color: #000;
  max-width: 650px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-weight: bold;
`;
export const TableHead = styled(TableH)`
  && {
    display: block;
  }
`;
export const TableBody = styled(TableB)`
  && {
    display: block;
    overflow: overlay;
    max-height: ${props =>
      props.maxheight ? props.maxheight : 'calc(100vh - 270px)'};
  }
`;

export const TableRow = styled(TableR)`
  && {
    display: flex;
    width: 100%;
  }
`;

export const TableCell = styled(TableC)`
  && {
    display: flex;
    min-width: ${props => (props.minwidth ? props.minwidth : '100px')};
    flex-grow: ${props => (props.grow ? `${props.grow}` : '0')};
    flex-shrink: ${props => (props.shrink ? `${props.shrink}` : '0')};
    flex-basis: ${props => (props.minwidth ? `${props.minwidth}` : '100px')};
    text-align: ${props => (props.align ? props.align : 'unset')};
    justify-content: ${props =>
      props.align === 'left'
        ? 'start'
        : props.align === 'right'
        ? 'end'
        : 'center'};
  }
`;
export const TableCellContent = styled.div`
  && {
    display: flex;
    align-items: center;
  }
`;

export const RoundedLabel = styled.div`
  border-radius: 23px;
  background-color: #dcdcdc;
  color: #000;
  padding: 12px 18px;
  height: 39px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 490px;
`;

export const RoundedTextArea = styled(TextareaAutosize)`
  border-radius: 23px;
  background-color: #dcdcdc;
  font-weight: bold;
  font-size: 15px;
  width: 100%;
`;
export const BorderLinkField = styled.div`
  width: 100%;
  display: inline-block;
  padding: 11px 13px 7px 18px;
  height: 39px;
  border-radius: 23px;
  border: 0px;
  background-color: #dcdcdc;
  color: #00a0ff;
  text-decoration: underline;
`;

// style for grid
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-around;
  grid-row-gap: 18px;
  grid-column-gap: 10%;
  padding: 27px 0px;
  & .rounded .MuiOutlinedInput-root.MuiOutlinedInput-root {
    height: 39px;
  }
  @media (max-width: 1600px) {
    grid-column-gap: 5%;
  }
`;
export const GridItem = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 20px;
  align-items: center;
  &:nth-of-type(odd) > .grid-label {
    width: ${props => (props.width ? props.width : '100px')};
  }
`;
export const GridLabel = styled.div`
  max-width: max-content;
  width: 150px;
  font-size: 15px;
  color: #000;
`;
export const GridContent = styled.div`
  font-size: 15px;
  flex: 1;
  max-width: 390px;
`;
export const ElipText = styled.span`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: calc(100% - 21px);
  text-decoration: underline;
`;
export const ButtonIconText = styled(Button)`
  && {
    font-size: 17px;
    padding: 15px;
    height: 39px;
  }
`;
export const SmallTextButton = styled(Button)`
  && {
    font-size: 12px;
    padding: 18px 10px;
    height: 32px;
  }
`;
export const OptionValue = styled.span`
  font-weight: bold;
  white-space: pre;
`;

export const ResultFilter = styled.div`
  font-weight: bold;
`;
export const NopaddingButton = styled(IconButton)`
  &&,
  &&:hover {
    background-color: transparent;
    padding: 0px;
    animation: none;
  }
  && .mui-ripple-circle {
    display: none;
  }
`;
export const RowItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: ${props => (props.direction == 'column' ? 'column' : 'row')};
  align-items: ${props =>
    props.direction == 'column' ? 'flex-start' : 'center'};
  grid-gap: ${props => (props.direction == 'column' ? '4px' : '10px')};
  margin-bottom: 15px;
  .dx-invalid.dx-show-invalid-badge {
    margin-bottom: ${props => (props.errorMargin ? props.errorMargin : '10px')};
  }
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
export const RowLabel = styled.div`
  width: ${props => props.width || '150px'};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #999999;
  font-weight: 500;
`;
export const RowContent = styled.div`
  display: flex;
  flex: 1;
  max-width: ${props => props.maxWidth || '100%'};
  width: ${props => props.width || '100%'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  .bold & {
    font-weight: 600;
  }
  &.has-border {
    background-color: #e2e2e2;
    padding: 10px;
    border-radius: 5px;
  }
`;

export const CustomFileUploadContainer = styled.div`
  .dx-fileuploader-wrapper {
    padding: 0px;
  }
  .dx-fileuploader-input-wrapper:before {
    padding: 5px 0px 0px 0px;
  }
  .dx-fileuploader-files-container {
    padding-top: 0px;
  }
  .dx-fileuploader-upload-button {
    display: none;
  }
`;

export const NoInfo = styled.div`
  color: var(--disabled-level-color);
`;
export const HeaderText = styled.div`
  color: rgba(0, 0, 0, 0.8);
  font-size: 16px;
  font-weight: 600;
`;
export const StatusIcon = styled.div`
  margin: auto;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${props => (props.color ? props.color : '#fff')};
`;

export const IconButtonSquare = styled(DevextremeButton)`
  && {
    border-radius: 8px;
    background-color: rgba(116, 116, 128, 0.08);
    :hover {
      background-color: rgba(116, 116, 128, 0.28);
    }
  }
`;
export const IconButtonHeader = styled(DevextremeButton)`
  && {
    border-radius: 8px;
    border: none;
    background-color: rgba(116, 116, 128, 0.08);
    padding: 3px;
    :hover {
      background-color: rgba(0, 123, 255, 0.1);
    }
  }
`;
export const IconOnRowWrap = styled.img`
  width: 20px;
  height: 20px;
  &:hover {
    cursor: pointer;
  }
`;
export const CellActionsWrap = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;
`;
export const LayoutBackground = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  padding: 20px 40px;
  gap: 20px;
  display: flex;
  flex-direction: column;
  // height: calc(100vh - 180px);
`;
