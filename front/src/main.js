import { createApp } from 'vue';
import { provideApolloClient } from '@vue/apollo-composable';
import apolloClient from './apollo-client';
import App from './App.vue';
import { router } from './router';

const app = createApp(App);

// Интеграция Apollo в приложение
app.use(router)
provideApolloClient(apolloClient);

app.mount('#app');
