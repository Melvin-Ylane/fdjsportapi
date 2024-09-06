import { Logger, LogLevel } from "@nestjs/common";

export const logLevels = (): LogLevel[] => {
    Logger.debug(`Logs Level: ${process.env.DB_CONNECTION}`, 'logLevels');
    if (process.env.PRODUCTION === "true") {
      Logger.debug(`Logs Level: Production`, 'logLevels');
      return ['warn', 'error', 'log'];
    } else {
      Logger.debug(`Logs Level: Development`, 'logLevels');
      return ['log', 'debug', 'warn', 'error', 'verbose'];
    }
  };