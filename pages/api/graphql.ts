// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ApolloServer } from 'apollo-server-micro';
import { schema } from 'src/schema';

const server = new ApolloServer({
  schema
});

// handler receives requests from users
const handler = server.createHandler({
  path: '/api/graphql'
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
