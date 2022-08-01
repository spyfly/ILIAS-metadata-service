import axios from 'axios';
import oauth from 'axios-oauth-client';
import tokenProvider from 'axios-token-interceptor';
import config from '../../config.json' assert {type: 'json'};

const iliasApiPath = config.ILIAS.apiPath;
const getOwnerCredentials = oauth.client(axios.create(), {
    url: iliasApiPath + '/v2/oauth2/token',
    grant_type: 'password',
    client_id: config.ILIAS.apiKey,
    username: config.ILIAS.username,
    password: config.ILIAS.password,
    scope: ''
});

const instance = axios.create({
    baseURL: iliasApiPath
});
instance.interceptors.request.use(
    // Wraps axios-token-interceptor with oauth-specific configuration,
    // fetches the token using the desired claim method, and caches
    // until the token expires
    oauth.interceptor(tokenProvider, getOwnerCredentials)
);

const iliasRESTApiClient = {
    async getLearningModule(ref_id) {
        const response = await instance.get("/v1/learning-module/" + ref_id);
        return response.data;
    }
};

export default iliasRESTApiClient;