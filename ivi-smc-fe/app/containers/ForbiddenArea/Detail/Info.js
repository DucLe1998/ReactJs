import React from 'react';
import { Grid } from '@material-ui/core';
import { Form, TextBox } from 'devextreme-react';
import { EmptyItem, SimpleItem } from 'devextreme-react/form';
import _ from 'lodash';
import { putApiCustom } from 'utils/requestUtils';
import LoadingIndicator from 'components/LoadingIndicator';
import { useVinToken } from 'utils/hooks/useVinToken';
import { API_FORBIDDEN_AREA } from '../../apiUrl';
import { ImageInfo } from './styled';

export default function Info({ data, refresh, scopes }) {
  const { getUrl } = useVinToken();
  const formData = { ...data };

  const onUpdateForbidden = () => {
    if (!_.isEqual(formData?.note, data?.note)) {
      putApiCustom(
        {
          url: API_FORBIDDEN_AREA.UPDATE({
            id: data?.id,
          }),
          payload: { note: formData?.note },
        },
        refresh,
      );
    }
  };

  if (!data) return <LoadingIndicator />;

  return (
    <React.Fragment>
      <React.Suspense fallback={<LoadingIndicator />}>
        <Grid container spacing={6}>
          <Grid item sm={12} lg={8}>
            <ImageInfo>
              <span>Thông tin khu vực cấm</span>
              <img src={getUrl(data?.imageUrl)} alt="" />
            </ImageInfo>
          </Grid>
          <Grid item sm={12} lg={4}>
            <Form
              formData={formData}
              labelLocation="top"
              showColonAfterLabel={false}
            >
              <EmptyItem />
              <SimpleItem
                dataField="forbiddenAreaName"
                label={{
                  text: 'Tên khu vực cấm',
                }}
                disabled
              />
              <SimpleItem
                dataField="device"
                label={{
                  text: 'Camera phụ trách',
                }}
                render={() => <TextBox disabled value={getDeviceName(data)} />}
                disabled
              />
              <SimpleItem
                dataField="locationName"
                label={{
                  text: 'Khu vực',
                }}
                disabled
              />
              <SimpleItem
                dataField="note"
                editorType="dxTextArea"
                label={{
                  text: 'Ghi chú',
                }}
                editorOptions={{
                  onFocusOut: onUpdateForbidden,
                  height: 170,
                  disabled: !scopes.update,
                }}
              />
            </Form>
          </Grid>
        </Grid>
      </React.Suspense>
    </React.Fragment>
  );
}

const getDeviceName = data =>
  data?.devices?.map(o => o?.deviceName || 'Chưa xác định')?.join(' , ');
