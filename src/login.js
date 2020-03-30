import React, { useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Title from './Title';
import Config from './Config.json';

const Login = (props) => {
	const [cookies, setCookies] = useCookies(['cookies']);

	useEffect(() => {
		console.log(cookies);
		deleteAllCookies();
		console.log(cookies);
	}, []);

	const deleteAllCookies = () => {
		var cookies = document.cookie.split(";");

		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf("=");
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	};

	const handleSubmit = async (event) => {
		const clientId = event.target.elements.clientId.value;
		const clientSecret = event.target.elements.clientSecret.value;
		console.log(clientId + ' ' + clientSecret);

		setCookies('clientId', clientId, { path: '/' });
		setCookies('clientSecret', clientSecret, { path: '/' });

		const params = new URLSearchParams({
			response_type: 'code',
			client_id: clientId,
			redirect_uri: Config.APP_AUTH_REDIRECT_URI,
			state: Config.APP_AUTH_STATE
		}).toString();
		const url = Config.API_BASE_URL + 'oauth/authorize?' + params;

		window.location.href = url;
		event.preventDefault();
	};

	return (
		<React.Fragment>
			{ Title('Login') }

			<div id="login" className="row px-1">
				<div className="col-12">
					<nav aria-label="breadcrumb">
						<ol className="breadcrumb">
							<li className="breadcrumb-item">
								<Link to="/">Home</Link>
							</li>
							<li className="breadcrumb-item active" aria-current="page">
								Login
                            </li>
						</ol>
					</nav>
				</div>
				<div className="col-12 text-left px-5 py-3">
					<form onSubmit={ handleSubmit }>
						<div className="form-group row">
							<label htmlFor="clientId" className="col-2 col-form-label">Client Id</label>
							<div className="col-10">
								<input type="text" name="clientId" className="form-control" id="clientId" placeholder="enter your Client Id" required></input>
							</div>
						</div>
						<div className="form-group row">
							<label htmlFor="clientSecret" className="col-2 col-form-label">Client Secret</label>
							<div className="col-10">
								<input type="text" name="clientSecret" className="form-control" id="clientSecret" placeholder="enter your Client Secret" required></input>
							</div>
						</div>
						<div className="form-group row">
							<div className="col-6">
								<button type="submit" className="btn btn-sm btn-Secondary float-right">Login</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</React.Fragment>
	);
};

export default withRouter(Login);