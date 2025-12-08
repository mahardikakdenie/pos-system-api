import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class ProjectDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Point Of Sales (Laukita Theme)',
    description: 'Nama proyek',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'laukita-theme',
    description: 'Slug atau identifier unik untuk URL',
  })
  link: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '/laukita.png',
    description: 'URL gambar utama proyek',
  })
  image?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Web App',
    description: 'Jenis proyek (Web App, Mobile App, CLI, dll)',
  })
  type: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['Vue3', 'Nuxt3', 'SEO', 'Pinia', 'TailwindCss', 'MockAPI'],
    description: 'Daftar teknologi/tools yang digunakan',
  })
  tools: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: `Developed a modern and responsive website theme tailored for Point of Sale (POS) systems...`,
    description: 'Deskripsi singkat proyek',
  })
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['/laukita.png', '/dashboard-laukita.png'],
    description: 'Daftar URL gambar pendukung (galeri)',
  })
  images: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'beta',
    description: 'Badge status proyek (misal: beta, live, deprecated)',
  })
  badge?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'https://laukita.mahardikakdenie.my.id',
    description: 'URL live demo atau repo proyek',
  })
  url?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 0,
    description: 'Resume Id for register the resume relates',
  })
  resume_id: number;
}

class ProjectResponseMeta {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Success' })
  message: string;
}

export class ProjectListResponseDto {
  @ApiProperty({ type: ProjectResponseMeta })
  meta: ProjectResponseMeta;

  @ApiProperty({ type: [ProjectDTO] })
  data: ProjectDTO[];
}
