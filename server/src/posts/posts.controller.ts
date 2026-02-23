import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Delete,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PoliciesGuard } from '../rbac/guards/policies.guard';
import { CheckPermission } from '../rbac/decorators/check-permission.decorator';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Controller('posts')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @CheckPermission('posts', 'read')
  list() {
    return this.postsService.findAll();
  }

  @Post()
  @CheckPermission('posts', 'create')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Put(':id')
  @CheckPermission('posts', 'update')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @CheckPermission('posts', 'delete')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Get(':id')
  @CheckPermission('posts', 'read')
  getPostById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }
}
