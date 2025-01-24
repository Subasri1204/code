import axios from 'axios';

export async function POST(req) {
    const { searchTerm, facets } = await req.json(); // Get search parameters from request body

     //const productSearchUrl = `${elastic_host_url}/${index_name_product}/_search/template`;

    const index_name_product_vector = "";
    const api_key_product_vector = "";
    const elastic_host_url_poc = "";
    const search_template_product_vector = "";


    const instance = axios.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });

    const multiSearchPayload = `{ "index": "${index_name_product_vector}" }
        { "id": "${search_template_product_vector}", "params": { "search_term": "${searchTerm}", "from": 0, "page_size": 10 } }\n`;


    const multi_search_url = `${elastic_host_url_poc}/_msearch/template`;
    console.log(multi_search_url)
    try {

        var results = {};

        const response = await instance.post(multi_search_url, multiSearchPayload, {
            headers: {
                'Content-Type': 'application/x-ndjson',
                'Authorization': api_key_product_vector
            },
            // Prevent Axios from transforming the payload
            transformRequest: [(data) => data]
        })

        const productHits = response.data.responses[0].hits.hits;
        const productTotalResults = response.data.responses[0].hits['total']['value'];
 

        const productResponse = productHits.map(hit => ({
            title: hit._source.title,
            description: hit._source.description,
            thumbnail: hit._source.thumbnail,
            sku_list: hit._source.sku_list,
            url: hit._source.url
        }));

        //const skuResponse = skuHits.map(hit => ({
        //    title: hit._source.title,
        //    sku_description: hit._source.sku_description,
        //    thumbnail: hit._source.thumbnail
        //}));

        results = {
            products: productResponse,
            skus: [],
            productTotalResults: productTotalResults,
            skuTotalResults: skuTotalResults
        };

        const searchResponse = {
            status: 200,
            errors: [],
            results: results
        };
        return new Response(JSON.stringify(searchResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error during search:', error);
        return new Response(
            JSON.stringify({ status: 500, errors: [error.message], results: [] }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
