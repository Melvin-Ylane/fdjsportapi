import { Logger, LogLevel } from '@nestjs/common';
import * as fs from "fs";

export const envFilePath = () => {
  let envPath = './src/environments/.dev.env';
  if (process.env.NODE_ENV === 'production') {
    envPath = './src/environments/.prod.env';
  }
  Logger.debug(`Environment selected: ${envPath}`, 'envFilePath');
  return envPath;
};

export const removeSysFile = async (folder: string, filePath: string) => {
  const folderPath = `./uploads/${folder}`;
  try {
    if(!fs.existsSync(folderPath)){
      throw new Error(`Folder at path: ${folderPath} not exists`);
    }
    fs.unlinkSync(`${folderPath}/${filePath}`);
  } catch (error) {
    throw new Error(`File at path: ${folderPath}/${filePath} not exists`);
  }
};

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

export const imageFields:string[] = ["picture"];
export const videoFields:string[] = [];
export const docFields:string[] = ["schoolcertif","parentalcertif","obligation"];
export const wordExcelFields:string[] = ["datadoc"];
export const audioFields:string[] = [];

export const passwordSaltRounds = 10;
export const MAX_ITEMS_PER_VIEW = 30;

export const assignFiles = <E,D>(entity: E, dto: D, filesFields: string[]) => {
  filesFields.forEach(async (fileField) => {
      if (dto[fileField] && dto[fileField] instanceof Array && dto[fileField].length > 0) {
        entity[fileField] = dto[fileField][0].filename;
      }
  });
  return entity;
}

export const removeFiles = async <E,D>(entity: E, filesFields: string[], dto?: D) => {
  if (dto) {
      filesFields.forEach(async (fileField) => {
          if (entity[fileField] && dto[fileField] instanceof Array && dto[fileField].length > 0) {
              await removeSysFile(fileField, entity[fileField]);
          }
      });
  }else{
    filesFields.forEach(async (fileField) => {
      if (entity[fileField]) {
          await removeSysFile(fileField, entity[fileField]);
      }
    });
  }
}
