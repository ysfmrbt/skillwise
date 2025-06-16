import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50, {
    message: 'Category name must be between 2 and 50 characters',
  })
  name: string;
}
