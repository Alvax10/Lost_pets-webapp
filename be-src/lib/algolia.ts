import "dotenv/config";
import algoliasearch from "algoliasearch";

const client = algoliasearch(process.env.APLICATION_ID_ALGOLIA, process.env.API_KEY_ALGOLIA);
const index = client.initIndex('Mascots');

export { index };