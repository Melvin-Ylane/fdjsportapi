import { Injectable, ParseFilePipe, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseFilesPipe {
  constructor(private readonly pipe: ParseFilePipe) {}

  /* async transform(
    files: Express.Multer.File[] | { [key: string]: Express.Multer.File },
  ) {
    let dataFiles: any;
    if (typeof files === 'object') {
        dataFiles = {...files};
        files = Object.values(files);
    }else{
        dataFiles = [...files];
    }
    if (files) {
        for (const file of files) await this.pipe.transform(file);
    }

    return dataFiles;
  } */
}