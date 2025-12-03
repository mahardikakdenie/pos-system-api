import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProfileResponse } from 'user/user.dto';

export enum RESUME_TYPE {
  WEB = 'web',
  DOC = 'doc',
}

export class ResumeDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'My Resume' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Professional frontend developer' })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'active' })
  status: string;

  @IsEnum(RESUME_TYPE)
  @IsNotEmpty()
  @ApiProperty({ enum: RESUME_TYPE, example: RESUME_TYPE.WEB })
  type: RESUME_TYPE;
}

export class ResumeItemResponse {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'Admin Resume' })
  name: string;

  @ApiProperty({ example: '287d7a48-75cf-4aab-8512-2ba8e5be8aaf' })
  owner_id: string;

  @ApiProperty({ example: 'admin-resume' })
  slug: string;

  @ApiProperty({ example: 'web' })
  type: string;

  @ApiProperty({ example: 'ative' })
  status: string;

  @ApiProperty({ example: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, beatae." })
  description: string;

  @ApiProperty({ type: () => ProfileResponse })
  profile: ProfileResponse;
}

export class ResumeListMeta {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ example: 1 })
  total: number;
}

export class ResumeListResponse {
  @ApiProperty({ type: () => ResumeListMeta })
  meta: ResumeListMeta;

  @ApiProperty({ type: () => [ResumeItemResponse] })
  data: ResumeItemResponse[];
}
