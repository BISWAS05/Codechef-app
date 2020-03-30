import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import ErrorStatus from './ErrorStatus';
import Config from './Config.json';
import Loading from './Loading';
import Title from './Title';

const Rankings = (props) => {
    const [httpStatusCode, setHttpStatusCode] = useState(200);
    const [isLoading, setIsLoading] = useState(true);
    const [rankingsContent, setRankingsContent] = useState(null);
    const [cookies, setCookies] = useCookies(['cookies']);

    useEffect(() => {
        console.log(cookies);
        if (cookies.accessToken === undefined) {
            props.history.push('/login');
        }

        fetchRankings();
    }, []);

    const fetchRankings = async () => {
        const accessToken = cookies.accessToken;
        const url = Config.API_BASE_URL + 'rankings/' + props.match.params.contestCode;
        const options = {
            method: 'get',
            headers: new Headers({
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            })
        };
        await fetch(url, options)
            .then(async (fetchedRankings) => {
                console.log(fetchedRankings);
                const jsonRankings = await fetchedRankings.json();
                console.log(jsonRankings);
                const status = fetchedRankings.status;
                const rankings = fetchedRankings.ok ? jsonRankings.result.data.content : null;

                setRankingsContent(rankings);
                setHttpStatusCode(status);
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

    const renderRankings = () => {
        if (rankingsContent === null) {
            return (
                <div>
                    No Content
                </div>
            );
        }
        return (
            <div className="px-5 table-responsive rankings-content">
                <table className="table table-sm table-hover text-center">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">USERNAME</th>
                            <th scope="col">SCORE</th>
                            <th scope="col">TOTAL PENALTY</th>
                            {
                                rankingsContent[0].problemScore.map((problem, i) => {
                                    return (
                                        <th key={ i } scope="col">{ problem.problemCode }</th>
                                    );
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rankingsContent.map((ranker, i) => {
                                return (
                                    <tr key={ i }>
                                        <td>{ ranker.rank }</td>
                                        <td>{ ranker.username }</td>
                                        <td>{ ranker.totalScore }</td>
                                        <td>{ ranker.totalTime }</td>
                                        {
                                            ranker.problemScore.map((problem, i) => {
                                                return (
                                                    <td key={ i }>{ problem.score }</td>
                                                );
                                            })
                                        }
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>

        );
    };

    return (
        <React.Fragment>
            { Title('Rankings - ' + props.match.params.contestCode) }

            <div id="rankings" className="row px-1">
                <div className="col-10">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to="/contests">Contests</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={ "/contests/" + props.match.params.contestCode }>{ props.match.params.contestCode }</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Rankings</li>
                        </ol>
                    </nav>
                </div>
                <div className="col-10">
                    <div className="py-3 px-5">
                        <h3 style={ { borderBottom: '2px striped' } }>
                            RANKS - <Link to={ "/contests/" + props.match.params.contestCode }>{ props.match.params.contestCode }</Link>
                        </h3>
                    </div>
                </div>
                <div className="col-10">
                    { renderRankings() }
                </div>
            </div>
        </React.Fragment>
    );
};

export default Rankings;