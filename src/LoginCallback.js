import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Title from './Title';
import ErrorStatus from './ErrorStatus';
import Config from './Config.json';

const LoginCallback = (props) => {
    const [httpStatusCode, setHttpStatusCode] = useState(200);
    const [cookies, setCookies] = useCookies(['cookies']);

    useEffect(() => {
        console.log(props);
        const params = new URLSearchParams(props.location.search);
        const authCode = params.get('code');

        if (cookies.clientId === undefined || cookies.clientSecret === undefined) {
            props.history.push('/login');
        }
        getAccessToken(authCode, cookies.clientId, cookies.clientSecret);
    }, []);

    const getAccessToken = async (authCode, clientId, clientSecret) => {
        const url = Config.API_BASE_URL + 'oauth/token';
        const options = {
            method: 'post',
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify({
                "grant_type": 'authorization_code',
                "code": authCode,
                "client_id": clientId,
                "client_secret": clientSecret,
                "redirect_uri": Config.APP_AUTH_REDIRECT_URI
            })
        };
        await fetch(url, options)
            .then(async (fetchedAccessToken) => {
                console.log(fetchedAccessToken);
                const jsonAccessToken = await fetchedAccessToken.json();
                console.log(jsonAccessToken);

                if (fetchedAccessToken.ok) {
                    const data = jsonAccessToken.result.data;
                    const accessToken = data.access_token;
                    const refreshToken = data.refresh_token;
                    console.log(accessToken);
                    console.log(refreshToken);
                    setCookies('accessToken', accessToken, { path: '/' });
                    setCookies('refreshToken', refreshToken, { path: '/' });
                    props.history.push('/contests');
                } else {
                    props.history.push('/login');
                }
            })
            .catch((error) => {
                setHttpStatusCode(0);
            });
    };

    if (httpStatusCode != 200) {
        return (
            ErrorStatus(httpStatusCode)
        );
    }

    return (
        <React.Fragment>
            { Title('Please wait...') }

            <div id="login-callback" className="row px-1">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to="/login">Login</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Login Callback
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="col-12 py-3 text-center">
                    Please wait...
                </div>
            </div>
        </React.Fragment>
    );
};

export default withRouter(LoginCallback);