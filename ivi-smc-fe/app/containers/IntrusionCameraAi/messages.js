/*
 * NotFoundPage Messages
 *
 * This contains all the text for the NotFoundPage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.IntrusionCameraAi';

export default defineMessages({
  image: {
    id: `${scope}.image`,
    defaultMessage: 'The offending image has been extracted from the camera',
  },
  area: {
    id: `${scope}.area`,
    defaultMessage: 'Area',
  },
  time: {
    id: `${scope}.time`,
    defaultMessage: 'Time occur',
  },
  device: {
    id: `${scope}.device`,
    defaultMessage: 'Device Name',
  },
  note: {
    id: `${scope}.note`,
    defaultMessage: 'Note',
  },
  enterNotes: {
    id: `${scope}.enterNotes`,
    defaultMessage: 'Enter notes',
  },
  liveStream: {
    id: `${scope}.liveStream`,
    defaultMessage: 'Live Stream',
  },
  playBack: {
    id: `${scope}.playBack`,
    defaultMessage: 'PlayBack',
  },
});
