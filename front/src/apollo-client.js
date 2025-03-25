import { ApolloClient, InMemoryCache, HttpLink, from, gql } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import axios from 'axios';
import { fromPromise } from '@apollo/client/core';

// Настраиваем HTTP-ссылку
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include',
});

// Настраиваем аутентификацию для каждого запроса
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: `Bearer ${localStorage.getItem('access') || ''}`,
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

      localStorage.setItem('access', newAccessToken);
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

// Создаём Apollo Client
const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

export default client;
