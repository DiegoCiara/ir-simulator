import { QueryBuilder } from 'typeorm-express-query-builder';

export default function queryBuilder(query: any) {
  const builder = new QueryBuilder(query);

  return builder.build();
}
