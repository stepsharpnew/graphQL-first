<template>
  <div class="registration-container">
    <h2 class="registration-title">Регистрация</h2>
    <form @submit.prevent="register" class="registration-form">
      <div class="form-group">
        <label for="email" class="form-label">Email:</label>
        <input type="text" id="email" v-model="email" required class="form-input">
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Пароль:</label>
        <input type="password" id="password" v-model="password" required class="form-input">
      </div>
      <div class="form-group">
        <label for="age" class="form-label">Возраст:</label>
        <input type="text" id="age" v-model="age" class="form-input">
      </div>
      <div class="form-group">
        <label for="description" class="form-label">Описание:</label>
        <input type="text" id="description" v-model="description" class="form-input">
      </div>
      <button type="submit" class="submit-button">Зарегистрироваться</button>
    </form>

    <div class="navigation-buttons">
      <router-link to="/login" class="nav-button">Войти</router-link>
      <router-link to="/" class="nav-button">На главную</router-link>
    </div>
  </div>
</template>
<script>
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

export default {
  data() {
    return {
      description: 'asdadadsadadsa',
      age: 12,
      email: '123',
      password: '123',
      mutation : null
    };
  },
  created() {
    // Определяем мутацию при создании компонента
    this.mutation = useMutation(gql`
      mutation Registration($dto: UserRegisterInput!) {
        registration(dto: $dto) {
          accessToken
          age
          email
          id
          refreshToken
        }
      }
    `);
  },
  methods: {
    async register() {
      try {
        const { mutate } = this.mutation;
        const response = await mutate({
          dto: {
            email: this.email,
            password: this.password,
            age: parseInt(this.age) || null,
            description: this.description,
          },
        });
        localStorage.setItem('accessToken', response.data.registration.accessToken)
        console.log(response.data);
        
      } catch (error) {
        console.error('GraphQL error:', error);
      }
    },
  },
};
</script>

<style scoped>
.registration-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.registration-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.submit-button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.nav-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-button:hover {
  background-color: #218838;
}

.nav-button:first-child {
  background-color: #6c757d;
}

.nav-button:first-child:hover {
  background-color: #5a6268;
}
</style>