import axios from 'axios';
import oauth from 'axios-oauth-client';
import tokenProvider from 'axios-token-interceptor';
import config from '../../config.json' assert {type: 'json'};

const iliasApiPath = config.ILIAS.apiPath;

const instance = axios.create({
    baseURL: iliasApiPath
});

function getOwnerCredentials() {
    // Get OAuth 2.0 Session
    const credentials = oauth.client(axios.create(), {
        url: iliasApiPath + '/v2/oauth2/token',
        grant_type: 'password',
        client_id: config.ILIAS.apiKey,
        username: config.ILIAS.username,
        password: config.ILIAS.password,
        scope: ''
    })();
    createIliasSession(credentials);
    return credentials;
}

async function createIliasSession(credentialsPromise) {
    const credentials = await credentialsPromise;
    // Create ILIAS Session
    instance.post('/v2/bridge/oauth2', JSON.stringify({
        api_key: config.ILIAS.apiKey,
        access_token: credentials.access_token
    }), {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(
        (resp) => {
            //console.log("Created ILIAS Session!");
            iliasRESTApiClient.sessionId = resp.data.cookies.PHPSESSID;
        }
    ).catch((err) => {
        console.log("Error creating ILIAS Session!");
        //console.log(err);
    });
}

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
    },

    async getSessionId() {
        return this.sessionId;
    }
};

export default iliasRESTApiClient;