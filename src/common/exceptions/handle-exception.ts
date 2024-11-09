import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

export class HandleHttpException extends HttpException {
  constructor(error: any, message: string = 'Internal Server Error') {
    if (error instanceof HttpException) {
      super(error.getResponse(), error.getStatus());
    } else {
      super(
        new InternalServerErrorException(message).getResponse(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
