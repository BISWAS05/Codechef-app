import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Pagination from 'react-js-pagination';
import ErrorStatus from './ErrorStatus';
import TimerStatus from './TimerStatus';
import RecentActivity from './RecentActivity';
import Config from './Config.json';
import Loading from './Loading';
import Title from './Title';
import HtmlParser from './HtmlParser';

function ContestDetails (props) {
    const [httpStatusCode, setHttpStatusCode] = useState(200);
    const [isLoading, setIsLoading] = useState(true);
    const [contestContent, setContestContent] = useState(null);
    const [timer, setTimer] = useState(0);
    const [timerStatus, setTimerStatus] = useState(3);
    const [recentActivity, setRecentActivity] = useState([]);
    const [showRecentActivity, setShowRecentActivity] = useState(false);
    const [cookies, setCookies] = useCookies(['cookies']);
    const [currPage, setCurrPage] = useState(1);

    useEffect(() => {
        console.log(cookies);
        if (cookies.accessToken === undefined) {
            props.history.push('/login');
        }

        fetchContestDetails();
    }, [props.match.params.contestCode]);

    const convertStringToDate = (dateString) => {
        var dateTimeParts = dateString.split(' '),
            timeParts = dateTimeParts[1].split(':'),
            dateParts = dateTimeParts[0].split('-'),
            date;

        date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10),
            timeParts[0], timeParts[1], timeParts[2]);
        return date.getTime();
    };

    const getTimer = (startDate, endDate, currentTime) => {
        var startTime = convertStringToDate(startDate);
        var endTime = convertStringToDate(endDate);
        currentTime *= 1000;

        var timer = 0, timerStatus = 3;
        if (currentTime <= startTime) {
            timer = startTime - currentTime;
            timerStatus = 0;
        } else if (startTime < currentTime && currentTime <= endTime) {
            timer = endTime - currentTime;
            timerStatus = 1;
        } else {
            timer = 0;
            timerStatus = 2;
        }
        setTimer(timer);
        setTimerStatus(timerStatus);
    };

    const fetchContestDetails = async () => {
        setIsLoading(true);
        const accessToken = cookies.accessToken;
        const url = Config.API_BASE_URL + 'contests/' + props.match.params.contestCode +
            '?sortBy=successfulSubmissions&sortOrder=desc';
        const options = {
            method: 'get',
            headers: new Headers({
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            })
        };
        await fetch(url, options)
            .then(async function(fetchContest) {
                console.log(fetchContest);
                var status = fetchContest.status;
                var jsonContest = await fetchContest.json();
                console.log(jsonContest);
                var content = fetchContest.ok ? jsonContest.result.data.content : null;

                setContestContent(content);
                setHttpStatusCode(status);
                setIsLoading(false);

                if (content) {
                    getTimer(content.startDate, content.endDate, content.currentTime);
                }
            });
    };

    const fetchRecentActivity = async () => {
        const accessToken = cookies.accessToken;
        if (showRecentActivity === true) {
            setShowRecentActivity(false);
            return;
        }
        const url = Config.API_BASE_URL + 'submissions/?contestCode=' + props.match.params.contestCode;
        const options = {
            method: 'get',
            headers: new Headers({
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            })
        };
        await fetch(url, options)
            .then(async (fetchedRecentActivity) => {
                console.log(fetchedRecentActivity);
                const jsonRecentActivity = await fetchedRecentActivity.json();
                console.log(jsonRecentActivity);

                setRecentActivity(jsonRecentActivity.result.data.content);
                setShowRecentActivity(true);
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

    const renderProblems = () => {
        return (
            <div className="table-responsive">
                <table className="table table-sm table-striped text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Code</th>
                            <th scope="col">Successful Submissions</th>
                            <th scope="col">Accuracy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            contestContent.problemsList.map((problem, i) => {
                                return (
                                    <tr key={ i }>
                                        <td scope="row">
                                            <Link to={ '/contests/' + problem.contestCode + '/problems/' + problem.problemCode } key={ i }>
                                                { problem.problemCode }
                                            </Link>
                                        </td>
                                        <td>
                                            { problem.successfulSubmissions }
                                        </td>
                                        <td>
                                            {
                                                parseFloat(problem.accuracy).toFixed(2)
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    };

const renderAccordingToContestType = () => {
        if (contestContent === null) {
            return (
                <div />
            );
        }
        if (contestContent.isParent) {
            return (
                renderParentContest()
            );
        }
        return (
            renderProblems()
        );
    };
    const renderParentContest = () => {
        return (
            <div>
                <h3>Rating Division System</h3>
                <p>
                    You can know in detail about the Rating Division System <a href="https://www.codechef.com/ratings/divisions">here</a>.
                    <br></br>
                    Based on the user rating, CodeChef user can proceed with the applicable division mentioned below to participate.
                </p>
                <div className="row text-center">
                    {
                        contestContent.children.map((child, i) => {
                            return (
                                <div className="col m-3 p-3" style={ { background: 'whitesmoke' } } key={ i }>
                                    <Link to={ '/contests/' + child }>{ child }</Link>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    };


    const renderRankingsButton = () => {
        if (contestContent === null || contestContent.isParent) {
            return (
                <div />
            );
        }
        return (
            <div id="contest-rankings" className="text-center">
                <span className="h5" style={
                    {
                        'border-bottom': '1px solid',
                        'border-bottom': '1px solid'
                    }
                }>
                    Contest Ranks
                </span>
                <br></br>
                <Link to={ '/rankings/' + contestContent.code }>
                    <button className="btn btn-info mt-4">Go to Contest Ranks</button>
                </Link>
            </div>
        );
    };

    const renderRecentActivity = () => {
        if (contestContent === null || contestContent.isParent) {
            return (
                <div />
            );
        }
        return (
            <div id="recent-activity" className="text-right">
                <span className="h5 float-left">
                    Recent Activity
                </span>
                <button className="btn btn-sm btn-info" onClick={ () => fetchRecentActivity() }>+</button>
            </div>
        );
    };

    const handleChange = (currPage) => {
        console.log(currPage);
        setCurrPage(currPage);
    };

    return (
        <React.Fragment>
            { Title(contestContent.name) }
            {/* { getTimer(contestContent.startDate, contestContent.endDate, contestContent.currentTime) } */ }
            <div id="contest-details" className="row px-1">
                <div className="col-sm-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to="/contests">Contests</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                { contestContent.name }
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="col-sm-12">
                    <div className="row px-1 py-3">
                        <div className="col-8 shadow-right">
                            <img src={ contestContent.bannerFile } className="img-fluid" alt='contest banner'></img>
                            <br></br>
                            <br></br>
                            { renderAccordingToContestType() }
                            <div>
                                <h3 className="announcements">Announcement:</h3>
                                <div className="row">
                                    <div className="col" dangerouslySetInnerHTML={ { __html: contestContent.announcements } } />
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <TimerStatus timer={ timer } timerStatus={ timerStatus } />
                            { renderRankingsButton() }
                            { renderRecentActivity() }
                            { showRecentActivity && <RecentActivity recentActivity={ recentActivity } /> }

                            <Pagination activePage={ currPage } itemsCountPerPage={ 10 } totalItemsCount={ 100 } pageRangeDisplayed={ 1 }
                                onChange={ (currPage) => handleChange(currPage) } itemClass="page-item" linkClass="page-link" />

                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ContestDetails;