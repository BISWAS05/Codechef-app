import React from 'react';

const RunDetails = (props) => {
    console.log(props);
    const runDetails = props.runDetails;
    if (runDetails == null) {
        return null;
    }

    const toggleRunInfo = () => {
        if (document.getElementById('run-info').style.display == 'block') {
            document.getElementById('run-info').style.display = 'none';
        } else {
            document.getElementById('run-info').style.display = 'block';
        }

    };
    const renderDetailsInfo = () => {
        var status = 'Successfully Executed';
        if (runDetails.cmpinfo !== "") {
            status = "Compilation Error";
        } else if (runDetails.stderr !== "") {
            status = "Standard Error";
        }
        return (
            <div className="d-flex justify-content-between run-details">
                <div className="d-flex run-details-info">
                    <div className="key">Status</div>
                    <div className="value">{ status }</div>
                </div>
                <div className="d-flex run-details-info">
                    <div className="key">Date</div>
                    <div className="value">{ runDetails.date }</div>
                </div>
                <div className="d-flex run-details-info">
                    <div className="key">Time</div>
                    <div className="value">{ runDetails.time } Secs</div>
                </div>
                <div className="d-flex run-details-info">
                    <div className="key">Mem</div>
                    <div className="value">{ runDetails.memory } Kb</div>
                </div>
                <button type="button" className="btn btn-sm btn-secondary float-right" onClick={ toggleRunInfo }>X</button>
            </div>
        );
    };

    const renderCompilationError = () => {
        if (runDetails.cmpinfo === "") {
            return null;
        }
        return (
            <div className="run-output-info">
                <div className="key">Compilation Info</div>
                <div className="value">
                    <textarea className="form-control" rows="4" value={ runDetails.cmpinfo } disabled></textarea>
                </div>
            </div>
        );
    };

    const renderOutput = () => {
        if (runDetails.output === "") {
            return null;
        }
        return (
            <div className="run-output-info">
                <div className="key">Output</div>
                <div className="value">
                    <textarea className="form-control" rows="4" value={ runDetails.output } disabled></textarea>
                </div>
            </div>
        );
    };

    const renderStandardError = () => {
        if (runDetails.stderr === "") {
            return null;
        }
        return (
            <div className="run-output-info">
                <div className="key">Standard Error</div>
                <div className="value">
                    <textarea className="form-control" rows="4" value={ runDetails.stderr } disabled></textarea>
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            { toggleRunInfo() }
            { renderDetailsInfo() }
            <div className="run-output">
                { renderCompilationError() }
                { renderOutput() }
                { renderStandardError() }
            </div>
        </React.Fragment>
    );
};

export default RunDetails;