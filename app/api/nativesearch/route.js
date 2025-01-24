import axios from 'axios';

export async function POST(req) {
    const { searchTerm, facets } = await req.json(); // Get search parameters from request body
    
    const index_name_product_vector = "joule-bt-hbt-epim-product-vector-prod";
    const api_key_product_vector = "ApiKey VkhRMnlaTUJWekFWT3B6QU5laXA6dDUtN0gycV9UdEMzZWNkT3ByMEZQdw=="; //"ApiKey MDNRRHNwTUJWekFWT3B6QXAtV0Q6dTlHNVl2ZWdTY2VVY3hOS2tEWG1OQQ==";
    const elastic_host_url_poc = "https://4e3a008083f540afb109eecf8cbef841.us-east-2.aws.elastic-cloud.com";
    const search_template_product_vector = "ba-product-vector-search-v1";

    const index_name_aemcontent_vector = "idx-joule-bt-hbt-vector-prod";
    const search_template_aemcontent_vector = "ba-aem-content-vector-search-v1";

    const index_name_edamcontent_vector = "idx-joule-bt-hbt-edam-vector-prod";
    const search_template_edamcontent_vector = "ba-edam-content-vector-search-v1";


    const multiSearchPayload = `{ "index": "${index_name_product_vector}" }
        { "id": "${search_template_product_vector}", "params": { "search_term": "${searchTerm}", "from": 0, "page_size": 25 } }
        { "index": "${index_name_aemcontent_vector}" }
        { "id": "${search_template_aemcontent_vector}", "params": { "search_term": "${searchTerm}", "from": 0, "page_size": 25 } }
        { "index": "${index_name_edamcontent_vector}" }
        { "id": "${search_template_edamcontent_vector}", "params": { "search_term": "${searchTerm}", "from": 0, "page_size": 25 } }\n`;


    const multi_search_url = `${elastic_host_url_poc}/_msearch/template`;

    try {

        var results = {};

        const response = await axios.post(multi_search_url, multiSearchPayload, {
            headers: {
                'Content-Type': 'application/x-ndjson',
                'Authorization': api_key_product_vector
            },
            // Prevent Axios from transforming the payload
            transformRequest: [(data) => data]
        })
        
        const productHits = response.data.responses[0].hits.hits;
        const productTotalResults = response.data.responses[0].hits['total']['value'];

        const skuTotalResults = 0;

        const contentHits = response.data.responses[1].hits.hits;
        const contentHitsTotalResults = response.data.responses[1].hits['total']['value'];

        const techPubHits = response.data.responses[2].hits.hits;
        const techPubHitsTotalResults = response.data.responses[2].hits['total']['value'];

        const productResponse = productHits.map(hit => ({
            title: hit._source.title,
            description: hit._source.description,
            thumbnail: hit._source.thumbnail,
            sku_list: hit._source.sku_list,
            url: hit._source.url
        }));

        const contentResponse = contentHits.map(hit => ({
            title: hit._source.title,
            description: hit._source.description,
            thumbnail: hit._source.thumbnail,
            tags: hit._source.tags,
            url: hit._source.url
        }));

        const techPubResponse = techPubHits.map(hit => ({
            title: hit._source.title,
            description: hit._source.description,
            category: hit._source.category,
            url: hit._source.url
        }));
        
        
        results = {
            products: productResponse,
            skus: [],
            skuTotalResults: skuTotalResults,
            aemcontents: contentResponse,
            techpubs: techPubResponse,
            productTotalResults: productTotalResults,            
            aemTotalResults: contentHitsTotalResults,
            techPubTotalResults: techPubHitsTotalResults
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
