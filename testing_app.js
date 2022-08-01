//const iliasApiPath = "http://192.168.20.137/Customizing/global/plugins/Services/UIComponent/UserInterfaceHook/REST/api.php";

import axios from 'axios';
import oauth from 'axios-oauth-client';
import tokenProvider from 'axios-token-interceptor';
import config from './config.json' assert {type: 'json'};

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

async function test_oauth2() {
    const auth = await getOwnerCredentials(); // => { "access_token": "...", "expires_in": 900, ... }
    console.log(auth);
};

async function main() { 
    const response = await instance.get("/v1/learning-module/94");
    console.log(response.data)
}
main();