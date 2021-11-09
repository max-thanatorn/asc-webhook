const testFunction = require('firebase-functions-test')();
const index = require('../src/index');

testFunction.mockConfig({
  env: require("../env.json")
})

describe('apiKeyToIndexPrefix', () => {
    it('successfully translated api key to index prefix', async () => {
      const postTestFunction = testFunction.wrap(index.post);
      const req = { query: {hashtag: 'hokkaido', size: 10, page: 0} };
      const res = {
        json: (json: any) => {
          expect(json).toStrictEqual({success: true, data: {}});
        }
      };
      postTestFunction(req, res)
    })
  })