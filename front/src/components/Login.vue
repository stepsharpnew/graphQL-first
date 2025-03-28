<template>
	<div class="login-container">
	  <h2 class="login-title">Вход</h2>
	  <form @submit.prevent="loginUser" class="login-form">
		<div class="form-group">
		  <label for="email" class="form-label">Email:</label>
		  <input type="text" id="email" v-model="email" required class="form-input">
		</div>
		<div class="form-group">
		  <label for="password" class="form-label">Пароль:</label>
		  <input type="password" id="password" v-model="password" required class="form-input">
		</div>
		<button type="submit" class="submit-button">Войти</button>
	  </form>
	  
	  <div class="navigation-buttons">
		<router-link to="/reg" class="nav-button">Регистрация</router-link>
		<router-link to="/" class="nav-button">На главную</router-link>
	  </div>
	</div>
  </template>
  
  <script>
  import gql from 'graphql-tag';
  
  export default {
	data() {
	  return {
		email: '123',
		password: '123',
		mutation: null,
	  };
	},
	methods: {
    async loginUser() {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: gql`
            mutation Login($email: String!, $password: String!) {
              login(dto: { email: $email, password: $password }) {
                accessToken
              }
            }
          `,
          variables: {
            email: this.email,
            password: this.password,
          },
        });
        this.loginResponse = data;
        // console.log('Mutation result:', data.login);
		localStorage.setItem('accessToken', data.login.accessToken);
      } catch (error) {
        console.error('Mutation error:', error);
      }
    },
  },
};
  </script>
  
  <style scoped>
  .login-container {
	max-width: 400px;
	margin: 0 auto;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 10px;
	background-color: #f9f9f9;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .login-title {
	text-align: center;
	margin-bottom: 20px;
	font-size: 24px;
	color: #333;
  }
  
  .login-form {
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