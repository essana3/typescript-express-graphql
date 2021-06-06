import { ObjectId } from 'mongodb';

import { ObjectIdScalar } from './object-id.scalar';

const scalars = [{ type: ObjectId, scalar: ObjectIdScalar }];

export default scalars;
