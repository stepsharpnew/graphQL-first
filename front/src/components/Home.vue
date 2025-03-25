<template>
	<div class="home-container">
		<div class="navigation-buttons">
			<router-link to="/login" class="nav-button">Войти</router-link>
			<router-link to="/reg" class="nav-button">Регистрация</router-link>
		</div>
	  <h1 class="home-title">Список пользователей</h1>
	  <!-- <div v-if="loading" class="loading">Загрузка...</div> -->
	  <div class="user-cards">
		<div v-for="user in users" :key="user.id" class="user-card">
		  <div class="user-info">
			<p><strong>ID:</strong> {{ user.id }}</p>
			<p><strong>Email:</strong> {{ user.email }}</p>
			<p><strong>Возраст:</strong> {{ user.age }}</p>
			<!-- <p><strong>Описание:</strong> {{ user.description }}</p> -->
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
<script>
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { watch } from 'vue';

export default {
  data() {
    return {
      users: []
    };
  },
  created() {
    const { result, error } = useQuery(gql`
      query getUsers {
        getUsers {
          email
          age
        }
      }
    `);

    // Следим за изменением результата запроса
    watch(result, (data) => {
      if (data && data.getUsers) {
        this.users = data.getUsers;
        console.log('Полученные пользователи:', this.users);
      }
    });

    // Обработка ошибок
    watch(error, (err) => {
      if (err) {
        console.error('GraphQL error:', err);
      }
    });
  }
};
</script>
  
  <style scoped>
  .home-container {	
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
  }
  
  .home-title {
	text-align: center;
	font-size: 28px;
	margin-bottom: 20px;
	color: #333;
  }
  
  .loading {
	text-align: center;
	font-size: 18px;
	color: #777;
  }
  
  .user-cards {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 20px;
  }
  
  .user-card {
	background-color: #fff;
	border: 1px solid #ddd;
	border-radius: 10px;
	padding: 20px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .user-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .user-info {
	font-size: 16px;
	color: #555;
  }
  
  .user-info p {
	margin: 10px 0;
  }
  
  .user-info strong {
	color: #333;
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