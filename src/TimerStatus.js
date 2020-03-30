import React from 'react';
import Timer from 'react-compound-timer';

const TimerStatus = ({ timer, timerStatus }) => {
    console.log(timer);
    console.log(timerStatus);

    switch (timerStatus) {
        case 0:
            return (
                <div id="contest-timer" className="text-center">
                    <span className="h5 span-h5">
                        Contest Starts In
                    </span>
                    <br></br>
                    <Timer initialTime={ timer } direction="backward">
                        { () => (
                            <React.Fragment>
                                <ul className="timer-ul">
                                    <li className="timer-li">
                                        <span className="timer-span">
                                            <Timer.Days />
                                        </span>
                                        days
                                    </li>
                                    <li className="timer-li">
                                        <span className="timer-span">
                                            <Timer.Hours />
                                        </span> hours
                                    </li>
                                    <li className="timer-li">
                                        <span className="timer-span">
                                            <Timer.Minutes />
                                        </span> minutes
                                    </li>
                                    <li className="timer-li">
                                        <span className="timer-span">
                                            <Timer.Seconds />
                                        </span> seconds
                                    </li>
                                </ul>
                            </React.Fragment>
                        ) }
                    </Timer>
                </div>
            );
        case 1:
            return (
                <div id="contest-timer" className="text-center">
                    <span className="h5 span-h5">
                        Contest Ends In
                    </span>
                    <br></br>
                    <Timer initialTime={ timer } direction="backward">
                        { () => (
                            <React.Fragment>
                                <ul className="timer-ul">
                                    <li className="timer-li">
                                        <span className="timer-span">
                                            <Timer.Days />
                                        </span>
                                        days
                                    </li>
                                    <li className="timer-li">
                                        <span className="timer-span">
                                            <Timer.Hours />
                                        </span> hours
                                    </li>
                                    <li className="timer-li">
                                        <span className="timer-span">
                                            <Timer.Minutes />
                                        </span> minutes
                                    </li>
                                    <li className="timer-li">
                                        <span className="timer-span">
                                            <Timer.Seconds />
                                        </span> seconds
                                    </li>
                                </ul>
                            </React.Fragment>
                        ) }
                    </Timer>
                </div>
            );
        case 2:
            return (
                <div id="contest-timer" className="text-center">
                    <span className="h5 span-h5">
                        Contest Ended
                    </span>
                </div>
            );
        default:
            return (
                <div></div>
            );
    }
};

export default TimerStatus;