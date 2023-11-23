import algoliasearch from 'algoliasearch/lite'

const APP_ID = import.meta.env.VITE_APP_ID
const API_KEY = import.meta.env.VITE_API_KEY

const searchClient = algoliasearch(APP_ID, API_KEY)
const index = searchClient.initIndex('text')

export { searchClient, index }
