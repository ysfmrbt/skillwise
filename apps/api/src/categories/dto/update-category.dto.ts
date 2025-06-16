import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @Length(2, 50, {
    message: 'Category name must be between 2 and 50 characters',
  })
  name?: string;
}
