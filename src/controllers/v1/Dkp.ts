import { Controller, Post, UseInterceptors, FileInterceptor, UploadedFile, UseGuards } from '@nestjs/common';
import DkpService from 'services/v1/Dkp';
import { AdminGuard } from 'guards/auth';

@Controller('dkp')
export default class DkpController {
  constructor(
    private readonly dkpService: DkpService
  ) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AdminGuard)
  private async addDkpHistory(@UploadedFile() file: any) { // eslint-disable-line @typescript-eslint/no-explicit-any, idk what the correct type is
    return this.dkpService.addDkpHistory(file);
  }
}
