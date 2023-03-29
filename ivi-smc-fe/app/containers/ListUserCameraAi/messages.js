/*
 * ListUserCameraAi Messages
 *
 * This contains all the text for the ListUserCameraAi container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ListUserCameraAi';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Looking for people',
  },
  not_found_text: {
    id: `${scope}.not.found`,
    defaultMessage: 'No data',
  },
  search_box_placeholder: {
    id: `${scope}.search.box.placeholder`,
    defaultMessage: 'Input search value',
  },
  recently_searched: {
    id: `${scope}.recently.search`,
    defaultMessage: 'Recently searched',
  },
  search_results: {
    id: `${scope}.search.results`,
    defaultMessage: 'Results',
  },
  related_results: {
    id: `${scope}.related.results`,
    defaultMessage: 'Related results',
  },
  similar_images: {
    id: `${scope}.similar.images`,
    defaultMessage: 'Similar images',
  },
  playback_text: {
    id: `${scope}.playback.text`,
    defaultMessage: 'Playback',
  },
  search_text: {
    id: `${scope}.search.text`,
    defaultMessage: 'Search',
  },
  datebox_placeholder: {
    id: `${scope}.datebox_placeholder`,
    defaultMessage: 'Select time',
  },
  error_message: {
    id: `${scope}.error.message`,
    defaultMessage:
      'Please choose a picture that is clear, well-lit, without editing .Only jpeg, gif, png, jpg,.tiff and .bmp files are allowed, the maximum size of the image is 2MB and one file at a time',
  },
  search_image_title: {
    id: `${scope}.search.image.title`,
    defaultMessage: 'Search by image',
  },
  drop_image_title: {
    id: `${scope}.drop.image.title`,
    defaultMessage: 'Drop image here',
  },
});
