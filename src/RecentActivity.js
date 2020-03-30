import React from 'react';
import { Link } from 'react-router-dom';

const RecentActivity = ({ recentActivity }) => {
    console.log(recentActivity);

    if (recentActivity.length === 0) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Problem</th>
                        <th>User</th>
                        <th>Result</th>
                        <th>Language</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            No recent activity
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    return (
        <div className="table-responsive recent-activity-content">
            <table className="table table-sm table-striped text-center">
                <thead className="thead-Dark">
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">User</th>
                        <th scope="col">Problem</th>
                        <th scope="col">Result</th>
                        <th scope="col">Language</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        recentActivity.map((activity, i) => {
                            return (
                                <tr key={ i }>
                                    <td>{ activity.date }</td>
                                    <td>{ activity.username }</td>
                                    <td>
                                        <Link to={ '/contests/' + activity.contestCode + '/problems/' + activity.problemCode }>
                                            { activity.problemCode }
                                        </Link>
                                    </td>
                                    <td>{ activity.result }</td>
                                    <td>{ activity.language }</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default RecentActivity;