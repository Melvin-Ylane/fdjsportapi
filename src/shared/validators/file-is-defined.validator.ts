import { FileValidator } from "@nestjs/common";

export class FileIsDefinedValidator extends FileValidator {
    constructor() {
        // parent class constructor requires any object as
        // argument, i think it is type mistake, so i pass
        // empty object
        super({});
    }

    isValid(file?: unknown): boolean {
        return file ? true : false;
    }
    buildErrorMessage(): any {
        return ["File is not defined"];
    }
}