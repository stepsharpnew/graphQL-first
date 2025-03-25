import { createApp } from 'vue';
import { provideApolloClient, DefaultApolloClient } from '@vue/apollo-composable';
import apolloClient from './apollo-client';
import App from './App.vue';
import { router } from './router';

const app = createApp(App);

// Интеграция Apollo в приложение
app.use(router);

// Здесь важно использовать `app.provide()`
app.provide(DefaultApolloClient, apolloClient);

app.mount('#app');
