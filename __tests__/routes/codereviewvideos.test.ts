import server from "../../src/server";
import * as storage from "../../src/storage/redis";
import request from "supertest";

jest.mock("../../src/storage/redis")
console.log('storage', storage)

afterEach((done) => {
  server.close();
  done();
});

describe("routes/codereviewvideos", () => {

  describe('post', function() {
    const games = [
      "World of Warships",
      "Battlefield",
    ];
  
    games.forEach((game: string) => {
      it(`should allow adding a game to the list - ${game}`, async () => {
  
        const mockGet = jest.fn((list: string) => Promise.resolve([game]));
  
        //@ts-ignore
        storage.redisStorage = jest.fn(() => {
          return {
            get: mockGet,
            add: (list: string) => Promise.resolve(false),
            remove: (list: string) => Promise.resolve(false),
          }
        });
        const response = await request(server)
          .post("/codereviewvideos")
          .send({ name: game });
  
        expect(response.status).toEqual(201);
        expect(response.type).toEqual("application/json");
        expect(response.body).toEqual({
          games: [
            game,
          ]
        });
  
        expect(mockGet).toHaveBeenCalled();
      });
    });
  
    it(`should keep track of all games added to the list'`, async () => {
  
      const list_of_games: string[] = [];
  
      const mockGet = jest.fn((list: string) => Promise.resolve(list_of_games));
      const mockAdd = jest.fn((list: string, game: string) => {
        list_of_games.push(game);
        return Promise.resolve(list_of_games.length > 0)
      });
  
      //@ts-ignore
      storage.redisStorage = jest.fn(() => {
        return {
          get: mockGet,
          add: mockAdd,
          remove: (list: string) => Promise.resolve(false),
        }});
  
      const game1 = { name: "Half Life 3" };
      const response1 = await request(server)
        .post("/codereviewvideos")
        .send(game1);
  
      expect(response1.status).toEqual(201);
      expect(response1.type).toEqual("application/json");
      expect(response1.body).toEqual({
        games: list_of_games.slice(0,1)
      });
  
      const game2 = { name: "FSX 2020" };
      const response2 = await request(server)
        .post("/codereviewvideos")
        .send(game2);
  
      expect(response2.status).toEqual(201);
      expect(response2.type).toEqual("application/json");
      expect(response2.body).toEqual({
        games: list_of_games
      });
  
      expect(storage.redisStorage().add).toHaveBeenCalledTimes(2);
      expect(storage.redisStorage().get).toHaveBeenCalledTimes(2);
  
    });
  
    it('should return a validation failure if the game data is incorrect', async () => {
      const response = await request(server)
        .post("/codereviewvideos")
        .send({ name: "" });
  
      expect(response.status).toEqual(400);
      expect(response.type).toEqual("application/json");
      expect(response.body).toEqual({
        "status": "error",
        "data": [
          {
            "target": {
              "name": ""
            },
            "value": "",
            "property": "name",
            "children": [],
            "constraints": {
              "length": "name must be longer than or equal to 1 characters"
            }
          }
        ]
      });
    });
  })

  describe('delete', function() {
    it('returns an empty list when the list is empty', async () => {

      const game = "Overwatch";

      const list_of_games: string[] = [
        game
      ];

      const mockGet = jest.fn((list: string) => Promise.resolve(list_of_games));
      const mockAdd = jest.fn();
      const mockRemove = jest.fn((list: string, game: string) => {
        const index = list_of_games.indexOf(game);
        if (index === -1) {
          return false;
        }
        list_of_games.splice(index, 1);
        return true;
      });

      //@ts-ignore
      storage.redisStorage = jest.fn(() => {
        return {
          get: mockGet,
          add: mockAdd,
          remove: mockRemove,
        }});

      const response = await request(server)
        .delete("/codereviewvideos")
        .send({ name: game });

      expect(response.status).toEqual(200);
      expect(response.type).toEqual("application/json");
      expect(response.body).toEqual({
        games: []
      });

      expect(mockGet).toHaveBeenCalled();
      expect(mockRemove).toHaveBeenCalled();
      expect(mockAdd).not.toHaveBeenCalled();
    });
  })

  it('returns an updated list when deleting a game', async () => {
    const game = "Overwatch";

    const list_of_games: string[] = [
      "GTA 5",
      game,
      "Diablo 3"
    ];

    const mockGet = jest.fn((list: string) => Promise.resolve(list_of_games));
    const mockAdd = jest.fn();
    const mockRemove = jest.fn((list: string, game: string) => {
      const index = list_of_games.indexOf(game);
      if (index === -1) {
        return false;
      }
      list_of_games.splice(index, 1);
      return true;
    });

    //@ts-ignore
    storage.redisStorage = jest.fn(() => {
      return {
        get: mockGet,
        add: mockAdd,
        remove: mockRemove,
      }});

    const response = await request(server)
      .delete("/codereviewvideos")
      .send({ name: game });

    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual({
      games: list_of_games.filter(item => item !== game)
    });

    expect(mockGet).toHaveBeenCalled();
    expect(mockRemove).toHaveBeenCalled();
    expect(mockAdd).not.toHaveBeenCalled();
  });

});
