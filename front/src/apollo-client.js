import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

// Создаём HTTP-ссылку на GraphQL API
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include', 
});

// Middleware для добавления токена
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers, // Сохранение других заголовков
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), // authLink → httpLink
  cache: new InMemoryCache(),
});

export default client;
