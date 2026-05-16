import { IsNotEmpty, IsString, IsUrl, MaxLength, ValidateIf } from 'class-validator';

export class SendMessageDto {
  @ValidateIf((o) => !o.imageUrl)
  @IsString()
  @IsNotEmpty()
  @MaxLength(32_000)
  content?: string;

  /** Public HTTPS URL of an image (e.g. Firebase Storage download URL) */
  @ValidateIf((o) => !(o.content && o.content.trim().length > 0))
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2048)
  imageUrl?: string;
}
