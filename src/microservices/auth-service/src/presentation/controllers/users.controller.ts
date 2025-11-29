import { Controller, Get, Put, Delete, Body, UseGuards, Param, Req, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Request } from "express";
import { GetUserUseCase } from "../../application/use-cases/users/get-user.use-case";
import { UpdateUserUseCase } from "../../application/use-cases/users/update-user.use-case";
import { AddPointsUseCase } from "../../application/use-cases/users/add-points.use-case";
import { DeleteUserUseCase } from "../../application/use-cases/users/delete-user.use-case";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { UpdateUserDto } from "../dtos/auth/update-user.dto";
import { AddPointsDto } from "../dtos/auth/add-points.dto";

@ApiTags("users")
  @Controller("api/users")
export class UsersController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly addPointsUseCase: AddPointsUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) { }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current authenticated user" })
  @ApiResponse({ status: 200, description: "Current user data retrieved successfully" })
  async getCurrentUser(@Req() request: Request) {
    const user = request.user as any;
    if (!user || !user.userId) {
      return { error: "User not authenticated" };
    }
    return this.getUserUseCase.execute(user.userId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User found successfully" })
  async getUser(@Param("id") id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  async updateUser(
    @Param("id") id: string,
    @Body() updateData: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, updateData);
  }

  @Put(":id/points")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add points to user" })
  @ApiResponse({ status: 200, description: "Points added successfully" })
  async addPoints(
    @Param("id") id: string,
    @Body() pointsData: AddPointsDto,   // 👈 ahora Swagger sabe que debe pedir points y reason
  ) {
    return this.addPointsUseCase.execute(id, pointsData.points, pointsData.reason);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  async deleteUser(@Param("id") id: string) {
    return this.deleteUserUseCase.execute(id);
  }

  @Post("favorites")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add media to user favorites" })
  @ApiResponse({ status: 201, description: "Media added to favorites" })
  async addFavorite(@Req() request: Request, @Body() body: { movieId: string }) {
    const user = request.user as any;
    if (!user || !user.userId) {
      return { error: "User not authenticated" };
    }
    // For now, we'll return a success response. In a real scenario, 
    // this would update the user's favorites in the database via a profile
    return { success: true, message: "Added to favorites", movieId: body.movieId };
  }

  @Post("watchlist")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add media to user watchlist" })
  @ApiResponse({ status: 201, description: "Media added to watchlist" })
  async addToWatchlist(@Req() request: Request, @Body() body: { movieId: string }) {
    const user = request.user as any;
    if (!user || !user.userId) {
      return { error: "User not authenticated" };
    }
    // For now, we'll return a success response. In a real scenario, 
    // this would update the user's watchlist in the database via a profile
    return { success: true, message: "Added to watchlist", movieId: body.movieId };
  }
}
