import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

export class HandleHttpException extends HttpException {
  constructor(error: any, message: string = 'API Request Failed') {
    if (error instanceof HttpException) {
      super(error.getResponse(), error.getStatus());
    } else {
      message = error?.message || error.toString();
      super(
        new InternalServerErrorException(message).getResponse(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
