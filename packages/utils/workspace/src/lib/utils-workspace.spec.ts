import { utilsWorkspace } from './get-directory-files';

describe('utilsWorkspace', () => {
  it('should work', () => {
    expect(utilsWorkspace()).toEqual('utils-workspace');
  });
});
