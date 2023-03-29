import { showLoading } from '../actions';
import { LOADING } from '../constants';

describe('ListUserCameraAi actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: LOADING,
      };
      expect(showLoading()).toEqual(expected);
    });
  });
});
