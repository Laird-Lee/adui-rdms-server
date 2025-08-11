import { SetMetadata } from '@nestjs/common';

export const SKIP_RESPONSE_WRAP = 'SKIP_RESPONSE_WRAP';
export const SkipResponseWrap = () => SetMetadata(SKIP_RESPONSE_WRAP, true);
