import React from 'react';
import Title from './Title';

const Loading = () => {
    return (
        <React.Fragment>
            { Title('Loading...') }
            <div className="row py-3">
                <div className="col text-center">
                    Loading...
                </div>
            </div>
        </React.Fragment>
    );
};

export default Loading;