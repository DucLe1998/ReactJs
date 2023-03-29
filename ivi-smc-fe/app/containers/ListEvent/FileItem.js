import React, { useRef } from 'react';
import {
  faFile,
  faFileExcel,
  faFileWord,
  faFileImage,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Tooltip, makeStyles } from '@material-ui/core';
import { buildUrlWithToken } from 'utils/utils';
import { API_FILE } from 'containers/apiUrl';
import { useHover } from 'ahooks';
import { red, green, blue, grey } from '@material-ui/core/colors';
const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    display: 'flex',
    gap: 10,
    width: 120,
    height: 120,
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 4,
    '&:hover': {
      borderColor: '#ccc',
    },
  },
  icon: {
    fontSize: '60px',
  },
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    whiteSpace: 'nowrap',
    display: 'block',
    fontSize: theme.typography.pxToRem(14),
  },
  clearIcon: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    cursor: 'pointer',
  },
}));
function getFileTypeIcon(type) {
  if ('png,jpg,jpeg'.includes(type)) {
    return { icon: faFileImage, color: red };
  }
  if ('doc,docx'.includes(type)) {
    return { icon: faFileWord, color: blue };
  }
  if ('xls,xlsx'.includes(type)) {
    return { icon: faFileExcel, color: green };
  }
  return { icon: faFile, color: grey };
}
export default function FileItem({ type, id, getOriginalFilename, onDelete }) {
  const classes = useStyles();
  const ref = useRef(null);
  const isHovering = useHover(ref);
  const icon = getFileTypeIcon(type);
  return (
    <div className={classes.container} ref={ref}>
      {isHovering && (
        <FontAwesomeIcon
          icon={faTimes}
          className={classes.clearIcon}
          onClick={() => onDelete(id)}
        />
      )}
      <FontAwesomeIcon
        icon={icon.icon}
        className={classes.icon}
        color={icon.color[500]}
      />
      <Tooltip title={getOriginalFilename}>
        <Link
          variant="body2"
          className={classes.name}
          target="_blank"
          rel="noopener"
          href={buildUrlWithToken(API_FILE.DOWNLOAD_FILE(id))}
        >
          {getOriginalFilename}
        </Link>
      </Tooltip>
    </div>
  );
}
