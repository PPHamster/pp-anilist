import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsBase64,
} from 'class-validator';
import { SeasonCreateDto } from '@/utils/dtos/SeasonDto';
import { WaifuCreateDto } from '@/utils/dtos/WaifuDto';

export class AnimeCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  public titleJp: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  public titleEn: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  public titleTh: string;

  @IsInt()
  @Min(0)
  @Max(5)
  public rating: number;

  @IsBase64()
  public image: string;

  @IsBoolean()
  public isWatching: boolean;

  @ValidateNested({ each: true })
  @Type(() => SeasonCreateDto)
  @IsOptional()
  public seasons?: SeasonCreateDto[];

  @ValidateNested({ each: true })
  @Type(() => WaifuCreateDto)
  @IsOptional()
  public waifu?: WaifuCreateDto;
}

export class AnimeUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  public titleJp?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  public titleEn?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  public titleTh?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  public rating?: number;

  @IsOptional()
  @IsBase64()
  public image?: string;

  @IsOptional()
  @IsBoolean()
  public isWatching?: boolean;
}
