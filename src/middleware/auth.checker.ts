import { AuthChecker } from 'type-graphql';

import Context from '../types/context.type';

const authChecker: AuthChecker<Context> = ({ context }): boolean => !!context.user;

export default authChecker;
