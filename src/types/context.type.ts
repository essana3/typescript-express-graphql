import { Request } from 'express';

import { User } from '../models/user.model';

interface Context {
  req: Request;
  user: User;
}

export default Context;
