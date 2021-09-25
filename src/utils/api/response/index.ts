import { Response } from "express";

enum HTTPStatusCodes {
    OK = 200,
    CREATED = 201,
    NOT_FOUND = 404,
    BAD_REQUEST = 400
}

abstract class AbstractResponse {
    constructor(protected code: HTTPStatusCodes, protected message: string) {}

    protected prepareResponse<T extends AbstractResponse>(res: Response, response: T): Response {
        return res.status(this.code).send(response);
    }

    public send(res: Response): Response {
        return this.prepareResponse<AbstractResponse>(res, this);
    }
}

export class OKResponse<T> extends AbstractResponse {
    constructor(message: string, private data: T) {
        super(HTTPStatusCodes.OK, message);
    }

    send(res: Response): Response {
        return super.prepareResponse<OKResponse<T>>(res, this);
    }
}

export class CreatedResponse<T> extends AbstractResponse {
    constructor(message: string, private data: T) {
        super(HTTPStatusCodes.CREATED, message);
    }

    send(res: Response): Response {
        return super.prepareResponse<CreatedResponse<T>>(res, this);
    }
}

export class BadRequestResponse<T> extends AbstractResponse {
    //TODO ERROR TYPE
    constructor(message: string, private error: T) {
        super(HTTPStatusCodes.BAD_REQUEST, message);
    }

    send(res: Response): Response {
        return super.prepareResponse<BadRequestResponse<T>>(res, this);
    }
}

export class NotFoundResponse<T> extends AbstractResponse {
    constructor(message: string, private error: T) {
        super(HTTPStatusCodes.NOT_FOUND, message);
    }

    send(res: Response): Response {
        return super.prepareResponse<NotFoundResponse<T>>(res, this);
    }
}
