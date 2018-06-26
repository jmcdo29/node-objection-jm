import { request, chai } from './setup.spec';

describe('get the homepage', () => {
  it('should return a 200 and render the homepage', () => {
    request('/')
      .expect(200)
  })
})