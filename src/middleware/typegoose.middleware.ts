import { getClassForDocument } from '@typegoose/typegoose';
import { Model, Document } from 'mongoose';
import { MiddlewareFn } from 'type-graphql';

export const TypegooseMiddleware: MiddlewareFn = async (_, next) => {
  const result = await next();

  if (Array.isArray(result)) {
    return result.map((item) => (item instanceof Model ? convertDocument(item) : item));
  }

  if (result instanceof Model) {
    return convertDocument(result);
  }

  return result;
};

export const convertDocument = (doc: Document): any => {
  const convertedDocument = doc.toJSON();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const DocumentClass = getClassForDocument(doc)!;
  Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
  return convertedDocument;
};
