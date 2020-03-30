import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div id="home" className="row px-10 pb-4">
            <div className="col-sm-10 text-baseline">
                <img src="https://www.codechef.com/sites/all/themes/abessive/logo.svg" className=" mx-auto" alt="---" style={ { width: '200px' } } />
            </div>
            <div className="p-3 my-6 col-sm-12 text-centre">
                <h1>CODECHEF LITE </h1>
                <strong className="text-centre">
                    By <a href="https://www.codechef.com/users/biswas8927">biswas8927</a>
                </strong>
            </div>
            <div className="col-1 text-centre">
                <Link to="/login">
                    <button className="btn btn-md btn-info">Login</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;