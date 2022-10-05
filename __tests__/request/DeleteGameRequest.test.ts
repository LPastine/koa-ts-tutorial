import { DeleteGameRequest } from '../../src/request/DeleteGameRequest';
import { validate } from "class-validator";

describe("request/DeleteGameRequest", () => {

  let deleteGameRequest: DeleteGameRequest;
  const validatorOptions = {};

  beforeAll(() => {
    deleteGameRequest = new DeleteGameRequest();
  });

  it(`has the expected class properties'`, async () => {
    deleteGameRequest.name = "a game name here";
    expect(deleteGameRequest.name).toBeDefined();
  });

  describe(`'name' validation`, () => {

    it('is valid', async () => {
      for (let i = 1; i <= 20; ++i) {
        deleteGameRequest.name = "x".repeat(i);
        expect(
          await validate(deleteGameRequest, validatorOptions)
        ).toHaveLength(0);
      }
    });

    it('must be a string', async () => {
      deleteGameRequest.name = '';
      expect(
        await validate(deleteGameRequest, validatorOptions)
      ).toHaveLength(1);
    });

    it('must have length of 1 character or greater', async () => {
      deleteGameRequest.name = '';
      expect(
        await validate(deleteGameRequest, validatorOptions)
      ).toHaveLength(1);
    });

    it('must have a length of 20 characters or fewer', async () => {
      deleteGameRequest.name = 'y'.repeat(21);
      expect(
        await validate(deleteGameRequest, validatorOptions)
      ).toHaveLength(1);
    });
  });
});
