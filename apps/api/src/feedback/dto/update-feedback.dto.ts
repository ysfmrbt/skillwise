import { IsString, IsOptional, IsInt, Min, Max, Length } from 'class-validator';

export class UpdateFeedbackDto {
  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating?: number;

  @IsString()
  @IsOptional()
  @Length(10, 1000, {
    message: 'Comment must be between 10 and 1000 characters',
  })
  comment?: string;
}
