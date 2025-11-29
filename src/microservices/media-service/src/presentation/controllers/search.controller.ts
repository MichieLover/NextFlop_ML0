import { Controller, Get, UseGuards, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"

import { SearchMediaUseCase } from "../../application/use-cases/media/search-media.use-case"
import { MediaSearchDto } from "../../application/dto/search.dto"

import { JwtAuthGuard } from "../guards/jwt-auth.guard"

@ApiTags("search")
@Controller("api/media")
export class SearchController {
  constructor(private readonly searchMediaUseCase: SearchMediaUseCase) {}

  @Get("search")
  @ApiOperation({ summary: "Search media content" })
  @ApiResponse({ status: 200, description: "Search results retrieved successfully" })
  async searchMedia(@Query() searchDto: MediaSearchDto) {
    const items = await this.searchMediaUseCase.execute(searchDto)
    return {
      items: items.map((m) => m),
    }
  }
}
