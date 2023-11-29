import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ApiProperty } from '@nestjs/swagger';

export interface MessageProps {
  content: string;
  authorId: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date | null;
}
export abstract class Message<
  Props extends MessageProps
> extends Entity<Props> {
  @ApiProperty({ example: 'Hellow world', description: 'Conteudo da mensagem' })
  get content() {
    return this.props.content;
  }
  @ApiProperty({
    example: new UniqueEntityID().toString(),
    description: 'Id do sender'
  })
  get authorId() {
    return this.props.authorId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  private touch() {
    this.props.updatedAt = new Date();
  }
  set content(content: string) {
    this.props.content = content;
    this.touch();
  }
}
