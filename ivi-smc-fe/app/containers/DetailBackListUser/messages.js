/*
 * DetailBackListUser Messages
 *
 * This contains all the text for the DetailBackListUser container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.DetailBackListUser';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Detail blacklist',
  },
  user_title: {
    id: `${scope}.user.title`,
    defaultMessage: 'Detail User',
  },
  block_placeholder: {
    id: `${scope}.block.placeholder`,
    defaultMessage: 'Chọn tòa nhà',
  },
  floor_placeholder: {
    id: `${scope}.floor.placeholder`,
    defaultMessage: 'Chọn tầng',
  },
  edit_description_title: {
    id: `${scope}.edit.description.title`,
    defaultMessage: 'Description',
  },
  id_title: {
    id: `${scope}.id.title`,
    defaultMessage: 'ID',
  },
  time_occur_title: {
    id: `${scope}.time.occur.title`,
    defaultMessage: 'Detected time',
  },
  search_text_title: {
    id: `${scope}.search.text.title`,
    defaultMessage: 'Lộ trình di chuyển của đối tượng',
  },
  search_text_description: {
    id: `${scope}.search.text.description`,
    defaultMessage: 'Chọn tòa nhà / tầng để tìm dữ liệu',
  },
  drawer_title: {
    id: `${scope}.drawer.title`,
    defaultMessage: 'Movement history',
  },
  drawer_live_view_btn: {
    id: `${scope}.drawer.live.view.btn`,
    defaultMessage: 'Live View',
  },
  drawer_view_detail_title: {
    id: `${scope}.drawer.view.detail.title`,
    defaultMessage: 'Playback',
  },
});
