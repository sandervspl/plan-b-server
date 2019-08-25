import {
  Controller, Post, UseInterceptors, FileInterceptor, UploadedFile, UseGuards, Get, Body,
} from '@nestjs/common';
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
  private async addDkpHistory(@UploadedFile() file: any, @Body() body: { name: string }) { // eslint-disable-line @typescript-eslint/no-explicit-any, idk what the correct type is
    return this.dkpService.addDkpHistory(file, body.name);
  }

  @Get('/guild_average')
  private getAverageGuildDkp() {
    return this.dkpService.getAverageGuildDkp();
  }
}
