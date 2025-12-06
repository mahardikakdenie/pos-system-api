import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
class IngredientItem {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;
}

class InstructionStep {
  @IsInt()
  @IsNotEmpty()
  stepNumber: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}

class TagItem {
  @IsString()
  @IsNotEmpty()
  name: string;
}

class MealTypeItem {
  @IsString()
  @IsNotEmpty()
  type: string;
}

// --- Main DTO ---
export class RecipeDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Nasi Goreng', description: 'Nama resep' })
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientItem)
  @ApiProperty({
    example: [
      { name: 'Cooked rice', quantity: '2 cups' },
      { name: 'Egg', quantity: '2 pieces' },
      { name: 'Soy sauce', quantity: '1 tbsp' },
      { name: 'Shallot', quantity: '3 cloves, minced' },
    ],
    description: 'Daftar bahan yang dibutuhkan',
  })
  ingredient: IngredientItem[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionStep)
  @ApiProperty({
    example: [
      { stepNumber: 1, description: 'Heat oil in a pan and sauté minced shallots until fragrant.' },
      { stepNumber: 2, description: 'Add beaten eggs and scramble until cooked.' },
      { stepNumber: 3, description: 'Add cooked rice and stir well.' },
      { stepNumber: 4, description: 'Pour in soy sauce and mix evenly. Cook for 3–5 minutes.' },
    ],
    description: 'Langkah-langkah memasak',
  })
  instructions: InstructionStep[];

  @IsInt()
  @ApiProperty({ example: 15, description: 'Waktu persiapan dalam menit' })
  prepTimeMinutes: number;

  @IsInt()
  @ApiProperty({ example: 15, description: 'Waktu memasak dalam menit' })
  cookTimeMinutes: number;

  @IsInt()
  @ApiProperty({ example: 4, description: 'Jumlah porsi' })
  servings: number;

  @IsString()
  @IsIn(['Easy', 'Medium', 'Hard'])
  @ApiProperty({ example: 'Easy', description: 'Tingkat kesulitan', enum: ['Easy', 'Medium', 'Hard'] })
  difficulty: string;

  @IsString()
  @ApiProperty({ example: 'Indonesian', description: 'Asal masakan' })
  cuisine: string;

  @IsInt()
  @ApiProperty({ example: 350, description: 'Kalori per porsi' })
  caloriesPerServing: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagItem)
  @ApiProperty({
    example: [{ name: 'Spicy' }, { name: 'Quick' }, { name: 'Vegetarian' }],
    description: 'Tag untuk klasifikasi resep',
  })
  tags: TagItem[];

  @IsString()
  @ApiProperty({ example: 'https://example.com/images/nasi-goreng.jpg', description: 'URL gambar resep' })
  image?: string;

  @IsInt()
  @ApiProperty({ example: 4, description: 'Rating rata-rata (1-5)' })
  rating?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealTypeItem)
  @ApiProperty({
    example: [{ type: 'Dinner' }, { type: 'Lunch' }],
    description: 'Jenis waktu makan yang cocok',
  })
  mealType: MealTypeItem[];

  @IsUUID()
  userId?: string;
}
