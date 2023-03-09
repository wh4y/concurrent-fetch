const input = require('./requests');
const fetch = require('node-fetch');

const makeRequest = ({ url, options }) => {
    return fetch(url, options).then((response) => response.json());
};

const makeRequests = (input, concurrency = 3) => {
    return new Promise((resolve) => {
        const promisedResults = [];
        const requestOptions = [...input];

        const makeNextRequest = () => {
            const currentRequestOptions = requestOptions.shift();

            if(!currentRequestOptions) {
                resolve(Promise.all(promisedResults));
                return;
            }

            const promisedResult = makeRequest(currentRequestOptions)
                .then((res) => {
                    makeNextRequest();
                    return res;
                })

            promisedResults.push(promisedResult);
        }

        for (let i = 0; i < concurrency; i++) {
            makeNextRequest()
        }
    });
}

makeRequests(input).then((result) => console.log(result));
