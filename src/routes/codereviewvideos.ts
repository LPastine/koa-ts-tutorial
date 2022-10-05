import {Context} from "koa";
import { AddGameRequest } from "../request/AddGameRequest";
import { validate } from "class-validator";
import { redisStorage as storage } from "../storage/redis";
import Router from "koa-router";
import { DeleteGameRequest } from "../request/DeleteGameRequest";

const router = new Router();

router.post(`/codereviewvideos`, async (ctx: Context) => {
  try {

    const validatorOptions = {};

    const addGameRequest = new AddGameRequest();
    addGameRequest.name = ctx.request.body?.name as string || '';


    const errors = await validate(addGameRequest, validatorOptions);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        data: errors
      };

      return ctx;
    }

    const store = storage();
    const list_name = "my_game_list"

    await store.add(list_name, addGameRequest.name );

    ctx.status = 201;
    ctx.body = {
      games: await store.get(list_name),
    };
  } catch (err) {
    console.error(err);
  }
});

router.delete(`/codereviewvideos`, async (ctx: Context) => {
  try {
    const validatorOptions = {};

    const deleteGameRequest = new DeleteGameRequest();
    deleteGameRequest.name = ctx.request.body?.name as string || '';

    const errors = await validate(deleteGameRequest, validatorOptions);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        data: errors
      };

      return ctx;
    }

    const store = storage();
    const list_name = "my_game_list"

    await store.remove(list_name, deleteGameRequest.name);

    ctx.status = 200;
    ctx.body = {
      games: await store.get(list_name)
    };
  } catch (err) {
    console.error(err);
  }
});


export default router;
