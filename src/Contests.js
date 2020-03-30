import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import ErrorStatus from './ErrorStatus';
import Title from './Title';
import Config from './Config.json';
import Loading from './Loading';

function Contests (props) {
	const [isLoading, setIsLoading] = useState(true);
	const [httpStatusCode, setHttpStatusCode] = useState(200);
	const [contestCode, setContestCode] = useState('');
	const [typedValue, setTypedValue] = useState('');
	const [contestList, setContestList] = useState([]);
	const [suggestions, setSuggestions] = useState([]);
	const [cookies, setCookies] = useCookies(['cookies']);

	useEffect(() => {
		console.log(cookies);
		if (cookies.accessToken === undefined) {
			props.history.push('/login');
		}

		fetchContestsDetails();
	}, []);

	const fetchContestsDetails = async () => {
		const accessToken = cookies.accessToken;
		const url = Config.API_BASE_URL + 'contests?fields=name%2C%20code&sortBy=code&sortOrder=asc';
		const options = {
			method: 'get',
			headers: new Headers({
				'content-type': 'application/json',
				'Authorization': 'Bearer ' + accessToken
			})
		};
		await fetch(url, options)
			.then(async (fetchContests) => {
				console.log(fetchContests);
				var status = fetchContests.status;
				var jsonContests = await fetchContests.json();
				var contests = fetchContests.ok ? jsonContests.result.data.content.contestList : null;
				console.log(jsonContests);

				setContestList(contests);
				setHttpStatusCode(status);
				setIsLoading(false);
			})
			.catch((error) => {
				setHttpStatusCode(0);
				setIsLoading(false);
			});
	};

	if (isLoading) {
		return (
			<Loading />
		);
	}

	if (httpStatusCode != 200) {
		return (
			ErrorStatus(httpStatusCode)
		);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		if (contestCode === '') {
			alert('Select from the list below');
			return;
		}
		props.history.push('/contests/' + contestCode);
	};


	const handleSelect = (contest) => {
		console.log(contest);
		setContestCode(contest.code);
		setTypedValue(contest.name + ' - ' + contest.code);
		setSuggestions([]);
	};

	const handleChange = (event) => {
		const value = event.target.value;
		var suggestions = [];
		if (value != '') {
			contestList.every((contest, i) => {
				if (contest.name.toLowerCase().startsWith(value.toLowerCase())
					|| contest.code.toLowerCase().startsWith(value.toLowerCase())) {
					suggestions.push(contest);
				}
				if (suggestions.length >= 10) {
					return false;
				}
				return true;
			});
		}

		setSuggestions(suggestions);
		setTypedValue(value);
		setContestCode('');
	};

	

	return (
		<React.Fragment>
			{ Title('Contests') }

			<div className="row-1 px-5 py-5">
				<div className="col-11 text-center">
				<h1>Search for any contest</h1>
					<form className="form-inline" onSubmit={ handleSubmit }>
						<input
							type="text" name="contestNameOrCode"
							placeholder="enter Contest Code or Contest Name" value={ typedValue }
							onChange={ handleChange } className="form-control col-11 mr-sm-2" autoComplete="off">

						</input>
						<input type="hidden" name="contestCode" value={ contestCode }></input>
						<button type="submit" className="btn btn-sm btn-info">Submit</button>
						<ul id="suggestions" className="col-11 text-left">
							{
								suggestions.map((contest, i) => {
									return (
										<li key={ i } onClick={ () => handleSelect(contest) }>
											{ contest.name } - { contest.code }
										</li>
									);
								})
							}
						</ul>
					</form>
				</div>
			</div>
		</React.Fragment>
	);
}

export default withRouter(Contests);