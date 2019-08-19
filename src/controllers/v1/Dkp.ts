import { Controller, Post, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import DkpService from 'services/v1/Dkp';

@Controller('dkp')
export default class DkpController {
  constructor(
    private readonly dkpService: DkpService
  ) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  private async addDkpHistory(@UploadedFile() file: any) {
    return this.dkpService.addDkpHistory(file);
  }
}