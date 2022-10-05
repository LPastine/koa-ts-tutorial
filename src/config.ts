import * as Interfaces from "./types/interfaces";

export const config: Interfaces.IConfig = {
  port: process.env.PORT || "7654",
  redis: {
    host: process.env.REDIS__HOST || "0.0.0.0",
    port: process.env.REDIS__PORT || "6401",
  }
}
