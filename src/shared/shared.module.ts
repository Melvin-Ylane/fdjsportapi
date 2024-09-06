import { Module, forwardRef } from '@nestjs/common';
import { SharedService } from './services/shared/shared.service';

@Module({
    imports: [],
    providers: [SharedService],
    exports: [SharedService]
})
export class SharedModule {}
