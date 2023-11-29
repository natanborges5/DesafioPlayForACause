import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports: [DatabaseModule, CryptographyModule],
    controllers: [

    ],
    providers: [
    ],
})
export class HttpModule {}