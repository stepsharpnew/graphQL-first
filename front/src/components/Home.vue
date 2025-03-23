<template>
	<div class="home-container">
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
  
  export default {
	data(){
		return {
			users : [],
			query : null
		}
	},
	async mounted(){
		await this.setup()
	},
	created () {
		this.query = useQuery(gql`
				query getUsers {
					getUsers {
						email
						age
					}
				}
			`);
	},
	methods : {
		async setup() {
			try {
				const { result, refetch } = this.query;
				await refetch();
				if (result) {
				this.users = result.getUsers;
				console.log("Полученные пользователи:", this.users);
				}
			} catch (error) {
				console.error("GraphQL error:", error);
			}
		},
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
  </style>