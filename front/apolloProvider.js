import { createApolloProvider } from '@vue/apollo-option'
import client from './src/apollo-client'

const apolloProvider = createApolloProvider({
  defaultClient: client,
})

export default apolloProvider