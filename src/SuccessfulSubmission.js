import React from 'react';
import { Link } from 'react-router-dom';

const SuccessfulSubmission = ({ successfulSubmission }) => {
    console.log(successfulSubmission);

    if (successfulSubmission.length === 0) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Time</th>
                        <th>Memory</th>
                        <th>Language</th>
                        <th>Solution</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            No successful submissions
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    return (
        <div className="table-responsive successful-submission-content">
            <table className="table table-sm table-hover text-center">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">User</th>
                        <th scope="col">Time</th>
                        <th scope="col">Memory</th>
                        <th scope="col">Language</th>
                        <th scope="col">Solution</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        successfulSubmission.map((submission, i) => {
                            return (
                                <tr key={ i }>
                                    <td>{ submission.username }</td>
                                    <td>{ submission.time }</td>
                                    <td>{ submission.memory }</td>
                                    <td>{ submission.language }</td>
                                    <td>
                                        <Link to={ '/viewsolution/' + submission.id }>
                                            <button className="btn btn-sm btn-primary">View</button>
                                        </Link>
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

export default SuccessfulSubmission;