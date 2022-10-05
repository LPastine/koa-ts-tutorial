import { IsString, Length } from "class-validator"

export abstract class GameRequest {

  @IsString()
  @Length(1, 20)
  name!: string;
}
