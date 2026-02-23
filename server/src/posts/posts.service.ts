import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { PostsModel } from 'src/sequelize/models/posts.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostsModel)
    private readonly postModel: typeof PostsModel,
  ) {}

  async findAll() {
    return this.postModel.findAll();
  }

  async create(postDto: any) {
    return this.postModel.create(postDto);
  }

  async update(id: string, post: Partial<PostsModel>) {
    const existingPost = await this.postModel.findByPk(id);
    if (!existingPost) {
      throw new Error('Post not found');
    }
    return existingPost.update(post);
  }

  async remove(id: string) {
    const existingPost = await this.postModel.findByPk(id);
    if (!existingPost) {
      throw new Error('Post not found');
    }
    await existingPost.destroy();
    return { message: 'Post deleted successfully' };
  }

  async findById(id: string) {
    const post = await this.postModel.findByPk(id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }
}
