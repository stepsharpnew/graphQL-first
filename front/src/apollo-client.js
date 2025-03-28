import { ApolloClient, InMemoryCache, HttpLink, split, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import axios from 'axios';
import { fromPromise } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Настраиваем HTTP-ссылку
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include',
});

// const getAuthToken = () => `Bearer ${localStorage.getItem('accessToken') || ''}`;

// Настраиваем WebSocket ссылку для подписок
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:3000/graphql',
    connectionParams: () => {
      const token = localStorage.getItem('accessToken');
      return token
        ? { Authorization: `Bearer ${token}` }
        : {};
    },
    on: {
      closed: (event) => console.error('WebSocket закрыт:', event),
      error: (error) => console.error('Ошибка WebSocket:', error),
    },
  })
);

// Настраиваем аутентификацию для HTTP-запросов
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
  },
}));

// Функция для запроса нового токена
const refreshToken = () =>
  axios
    .post(
      'http://localhost:3000/graphql',
      {
        query: `mutation Refresh { refresh { accessToken } }`,
        variables: {},
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    )
    .then(response => {
      const newAccessToken = response?.data?.data?.refresh?.accessToken;
      if (!newAccessToken) throw new Error('Не удалось обновить токен');

      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    })
    .catch(error => {
      console.error('Ошибка обновления токена:', error);
      return null;
    });

// Обработчик ошибок
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors && graphQLErrors.some(error => error.extensions.code === 'FORBIDDEN')) {
    console.log('FORBIDDEN ошибка, пробуем обновить токен');

    return fromPromise(
      refreshToken().then(newAccessToken => {
        if (!newAccessToken) return;

        // Обновляем заголовки с новым токеном
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        }));

        // Повторяем запрос
        return forward(operation);
      })
    ).flatMap(result => result || []);
  }
});

// Разделяем HTTP и WebSocket запросы
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  from([errorLink, authLink.concat(httpLink)]) // HTTP-запросы через errorLink + authLink
);

// Создаём Apollo Client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
