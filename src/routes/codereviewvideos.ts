import {Context} from "koa";
import Router from "koa-router";
import { validate } from "class-validator";
import { AddGameRequest } from "../request/AddGameRequest";
import * as storage from "../storage/redis";

const router = new Router();

router.post(`/codereviewvideos`, async (ctx: Context) => {
  try {

    const validatorOptions = {};

    const game = new AddGameRequest();
    game.name = ctx.request.body?.name as string || '';


    const errors = await validate(game, validatorOptions);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        data: errors
      };

      return ctx;
    }

    console.log('route storage', storage)

    ctx.status = 201;
    ctx.body = {
      games: 
        // ... a list of games
        // ctx.request.body?.game,
        await storage.redisStorage().get('my_game_list'),
    };
  } catch (err) {
    console.error(err);
  }
});

export default router;
