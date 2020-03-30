import React from 'react';
import { Link } from 'react-router-dom';
import Title from './Title';

const ErrorStatus = (httpStatusCode) => {
    switch (httpStatusCode) {
        case 0:
            return (
                <React.Fragment>
                    { Title('Failed To Fetch') }
                    <div className="row py-3">
                        <div className="col text-center">
                            <h1>Failed To Fetch</h1>
                            <p>
                                Error Occured! Try to reload the page or Check your internet connctivity.
                            </p>
                        </div>
                    </div>
                </React.Fragment>
            );
        case 400:
            return (
                <React.Fragment>
                    { Title('Bad Request') }
                    <div className="row py-3">
                        <div className="col text-center">
                            <h1>{ httpStatusCode }</h1>
                            <p>
                                Error Occured! Bad Request.
                            </p>
                        </div>
                    </div>
                </React.Fragment>
            );
        case 401:
            return (
                <React.Fragment>
                    { Title('Unauthorized') }
                    <div className="row py-3">
                        <div className="col text-center">
                            <h1>{ httpStatusCode }</h1>
                            <p>
                                Error Occured! Unauthorized. Please <Link to={ '/login' }>login</Link> again.
                            </p>
                        </div>
                    </div>
                </React.Fragment>
            );
        case 404:
            return (
                <React.Fragment>
                    { Title('Page Not Found') }
                    <div className="row py-3">
                        <div className="col text-center">
                            <h1>{ httpStatusCode }</h1>
                            <p>
                                Error Occured! Page Not Found.
                            </p>
                        </div>
                    </div>
                </React.Fragment>
            );
        case 500:
            return (
                <React.Fragment>
                    { Title('Internal Server Error') }
                    <div className="row py-3">
                        <div className="col text-center">
                            <h1>{ httpStatusCode }</h1>
                            <p>
                                Error Occured! Internal Server Error.
                            </p>
                        </div>
                    </div>
                </React.Fragment>
            );
        default:
            return (
                <React.Fragment>
                    { Title('Unknown Error') }
                    <div className="row py-3">
                        <div className="col text-center">
                            <h1>{ httpStatusCode }</h1>
                            <p>
                                Error Occured! Please <Link to={ '/login' }>login</Link> again.
                            </p>
                        </div>
                    </div>
                </React.Fragment>
            );
    }
};

export default ErrorStatus;