import { IsString, Length } from "class-validator"

export class AddGameRequest {

  @IsString()
  @Length(1, 20)
  name!: string;
}
