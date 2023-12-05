import { ApiProperty } from '@nestjs/swagger';

export class UserSwaggerDTO {
  @ApiProperty({
    example: 'natanborges@gmail.com',
    description: 'The email of an user'
  })
  email!: string;
  @ApiProperty({ example: '123123', description: 'The password' })
  password!: string;
}
