import { redisStorage } from "../../src/storage/redis";

describe('storage/redis', () => {

  describe('get', () => {

    it('should initially return an empty list', async () => {
      expect(
        await redisStorage().get('my_test_list_1')
      ).toEqual(
        []
      )
    });

  });

  describe('add', () => {

    const list_name = 'my_test_list_2';

    it('should allow adding an entry to the list', async () => {
      expect(
        await redisStorage().add(list_name, "chris")
      ).toEqual(
        true
      );

      expect(
        await redisStorage().get(list_name)
      ).toEqual(
        [ "chris" ]
      );

      await redisStorage().remove(list_name, "chris");
    });

  });

  describe('remove', () => {
    it('should allow removing an entry from the list', async () => {

      const list_name = 'my_test_list_3';

      await redisStorage().add(list_name, "chris");
      await redisStorage().add(list_name, "paul");

      expect(
        await redisStorage().remove(list_name, "paul")
      ).toEqual(
        true
      );

      expect(
        await redisStorage().get(list_name)
      ).toEqual(
        [ "chris" ]
      );

      await redisStorage().remove(list_name, "chris");
    });

  });

});
