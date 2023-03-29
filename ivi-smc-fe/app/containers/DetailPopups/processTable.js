import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import { getStatusHtml } from '../../utils/statusHTMLGenerate';
import { formatDateTime } from '../../utils/functions';

const NoData = styled.div`
  font-size: 15px;
  display: flex;
  justify-content: center;
  margin: 15px;
  min-width: 100%;
`;

const useStyles = makeStyles(theme => ({
  inputControl: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  container: {
    maxHeight: 500,
  },
}));
export function ProcessTable({
  columns,
  rows,
  page = 0,
  rowsPerPage = 0,
  noHeaderColor,
  backgroundColor,
}) {
  const classes = useStyles();
  const getRowValue = (column, value, index) => {
    if (column === 'order') {
      if (rowsPerPage) return page * rowsPerPage + (index + 1);
      return index + 1;
    }
    if (column === 'status') return getStatusHtml(value);
    if (column === 'processDate') return formatDateTime(value);
    if (column === 'createDate') return formatDateTime(value);
    if (column === 'createdDate') return formatDateTime(value);

    const a =
      column.format && typeof value === 'number' ? column.format(value) : value;
    return a;
  };
  return (
    <div>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: noHeaderColor ? 'transparent' : '#21326f',
                    color: noHeaderColor ? 'black' : '#fff',
                    textTransform: 'uppercase',
                  }}
                >
                  <div>{column.label}</div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            style={{
              backgroundColor: backgroundColor || '#fff',
            }}
          >
            {rows.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {columns.map(column => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {getRowValue(column.id, value, index)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {rows.length === 0 && <NoData>Không có dữ liệu</NoData>}
    </div>
  );
}

ProcessTable.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
};
