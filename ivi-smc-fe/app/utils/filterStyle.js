import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

export const EventReportWrapper = styled.div`
  .hover-cursor {
    cursor: pointer;
  }

  .filter-columns {
    display: flex;
    justify-content: space-between;
    padding: 5px 0 5px 0;
  }
`;
export const ControlBox = styled.div`
  margin-bottom: 16px;
`;

export const FilterPopupWrapper = styled.div`
  padding-bottom: 10px;
  .w-100 {
    width: 100%;
  }
  .btn-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
    justify-content: center;
    align-items: flex-start;
  }

  .tag {
    background-color: #e0e0e0 !important;
    border-radius: 16px !important;
    padding: 2px 8px !important;
    font-size: 0.8125rem;
  }
  .tag-remove {
    background-color: #4252ad;
    border-radius: 30px;
    padding: 2px 5px;
    margin-left: 8px;
    color: white;
  }
  .tag-list {
    padding-left: 6px;
    flex: 1;
  }
  .z_idx-1 {
    z-index: 1;
  }
  .tag-item {
    margin: 2px 4px 4px 0px;
  }
  .tag-item .search {
    border: none;
  }
`;

export const RowBlock = styled(Grid)`
  margin-top: 10px !important;
`;

export const ColLabel = styled(Grid)`
  padding: 0px 0px 0px 12px !important;
  display: flex;
  align-items: center;
`;

export const ColOption = styled(Grid)`
  padding: 0px 12px 0px 0px !important;
`;

export const ResultFilter = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;
