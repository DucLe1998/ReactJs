import { updatePassword } from '../actions';
import { UPDATE_PASSWORD } from '../constants';

describe('UpdatePassword actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: UPDATE_PASSWORD,
      };
      expect(updatePassword()).toEqual(expected);
    });
  });
});
