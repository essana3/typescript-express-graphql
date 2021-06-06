import { AuthChecker } from 'type-graphql';

import { Context } from '../types';

export const authChecker: AuthChecker<Context> = ({ context }): boolean => !!context.user;
