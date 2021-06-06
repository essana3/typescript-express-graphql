import { Request } from 'express';

import { User } from '../models';

export interface Context {
  req: Request;
  user: User;
}
