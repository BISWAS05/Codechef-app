import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { withRouter, Link } from 'react-router-dom';
import { ControlledEditor } from "@monaco-editor/react";
import ErrorStatus from './ErrorStatus';
import SuccessfulSubmission from './SuccessfulSubmission';
import Config from './Config.json';
import Loading from './Loading';
import Title from './Title';
import RunDetails from './RunDetails';

function Problems (props) {
    const [httpStatusCode, setHttpStatusCode] = useState(200);
    const [isLoading, setIsLoading] = useState(true);
    const [problemContent, setProblemContent] = useState({});
    const [successfulSubmission, setSuccessfulSubmission] = useState([]);
    const [showSuccessfulSubmission, setShowSuccessfulSubmission] = useState(false);
    const [language, setLanguage] = useState('cpp');
    const [editorTheme, setEditorTheme] = useState('light');
    const [sourceCode, setSourceCode] = useState('//write your code');
    const [editorLineColumn, setEditorLineColumn] = useState({ Line: 0, Column: 0 });
    const [runDetails, setRunDetails] = useState(null);
    const [cookies, setCookies] = useCookies(['cookies']);

    useEffect(() => {
        console.log(cookies);
        if (cookies.accessToken === undefined) {
            props.history.push('/login');
        }

        fetchProblemDetails();
    }, []);

    const fetchProblemDetails = async () => {
        const accessToken = cookies.accessToken;
        const url = Config.API_BASE_URL + 'contests/' + props.match.params.contestCode + '/problems/' + props.match.params.problemCode;
        const options = {
            method: 'get',
            headers: new Headers({
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            })
        };
        await fetch(url, options)
            .then(async (fetchProblem) => {
                console.log(fetchProblem);
                var status = fetchProblem.status;
                var jsonProblem = await fetchProblem.json();
                var content = fetchProblem.ok ? jsonProblem.result.data.content : null;

                setProblemContent(content);
                setHttpStatusCode(status);
                setIsLoading(false);

                if (content) {
                    document.title = content.problemName + ' | CodeChef';
                }
            });
    };

    const fetchSuccessfulSubmission = async () => {
        const accessToken = cookies.accessToken;
        if (showSuccessfulSubmission === true) {
            setShowSuccessfulSubmission(false);
            return;
        }
        const url = Config.API_BASE_URL + 'submissions/?result=AC&contestCode=' + props.match.params.contestCode + '&problemCode=' + props.match.params.problemCode;
        const options = {
            method: 'get',
            headers: new Headers({
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            })
        };
        await fetch(url, options)
            .then(async (fetchedSuccessfulSubmission) => {
                console.log(fetchedSuccessfulSubmission);
                var status = fetchedSuccessfulSubmission.status;
                var jsonSuccessfulSubmission = await fetchedSuccessfulSubmission.json();
                var content = fetchedSuccessfulSubmission.ok ? jsonSuccessfulSubmission.result.data.content : null;

                setSuccessfulSubmission(content);
                setHttpStatusCode(status);
                setShowSuccessfulSubmission(true);
            });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const accessToken = cookies.accessToken;
        const lang = event.target.elements.lang.value;
        const code = sourceCode;
        const input = event.target.elements.input.value;
        console.log(lang);
        console.log(code);
        console.log(input);
        document.getElementById('submission-queued').innerHTML = "Submission Queued";
        document.getElementById('run-info').style.display = 'none';
        const url = Config.API_BASE_URL + 'ide/run';
        const options = {
            method: 'post',
            headers: new Headers({
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }),
            body: JSON.stringify({
                "sourceCode": code,
                "language": lang,
                "input": input,
            })
        };
        console.log(options);
        await fetch(url, options)
            .then(async (fetchResult) => {
                console.log(fetchResult);
                const jsonResult = await fetchResult.json();
                console.log(jsonResult);
                setTimeout(await showResult(jsonResult.result.data.link), 10000);
            });
    };

    const showResult = async (link) => {
        console.log(link);
        const accessToken = cookies.accessToken;
        const url = Config.API_BASE_URL + 'ide/status?link=' + link;
        const options = {
            method: 'get',
            headers: new Headers({
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            })
        };
        await fetch(url, options)
            .then(async (fetchResult) => {
                console.log(fetchResult);
                const jsonResult = await fetchResult.json();
                console.log(jsonResult);
                document.getElementById('submission-queued').innerHTML = "";
                setRunDetails(jsonResult.result.data);
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

    const renderTags = () => {
        if (problemContent == null || problemContent.tags.length === 0) {
            return (
                <div />
            );
        }
        var str = "";
        problemContent.tags.map((tag, i) => {
            if (i === problemContent.tags.length - 1) {
                str += tag;
            } else {
                str += tag + ", ";
            }
        });
        console.log(str);
        return (
            <div className="row">
                <div className="col-3">Tags:</div>
                <div className="col-9">
                    { str }
                </div>
            </div>
        );
    };

    const renderLanguages = () => {
        if (problemContent == null || problemContent.languagesSupported.length === 0) {
            return (
                <div />
            );
        }
        var str = "";
        problemContent.languagesSupported.map((lang, i) => {
            if (i === problemContent.languagesSupported.length - 1) {
                str += lang;
            } else {
                str += lang + ", ";
            }
        });
        console.log(str);
        return (
            <div className="row">
                <div className="col-3">Languages:</div>
                <div className="col-9">
                    { str }
                </div>
            </div>
        );
    };

    const renderSuccessfulSubmission = () => {
        if (problemContent === null) {
            return (
                <div />
            );
        }
        return (
            <div id="successful-submission" className="text-right">
                <span className="h5 float-left">
                    Successful Submissions
                </span>
                <button className="btn btn-sm btn-primary" onClick={ () => fetchSuccessfulSubmission() }>+</button>
            </div>
        );
    };

    const handleEditorChange = (ev, value) => {
        // console.log(ev);
        // console.log(value);
        setSourceCode(value);
        const linColumn = { Line: ev.changes[0].range.startLineNumber, Column: ev.changes[0].range.startColumn };
        setEditorLineColumn(linColumn);
    };

    const changeLanguage = (event) => {
        const lang = event.target.value;
        const langMap = {
            "C": "c",
            "C#": "csharp",
            "C++ 4.3.2": "cpp",
            "C++ 6.3": "cpp",
            "C++14": "cpp",
            "CLOJ": "clojure",
            "F#": "fsharp",
            "GO": "go",
            "JAVA": "java",
            "JS": "javascript",
            "NODEJS": "javascript",
            "KTLN": "kotlin",
            "LUA": "lua",
            "PAS gpc": "pascal",
            "PAS fpc": "pascal",
            "PERL": "perl",
            "PERL6": "perl",
            "PHP": "php",
            "PYTH": "python",
            "PYTH 3.6": "python",
            "PYPY": "python",
            "PYPY3": "python",
            "R": "r",
            "RUBY": "ruby",
            "rust": "rust",
            "SCM qobi": "scheme",
            "SCM guile": "scheme",
            "SCM chicken": "scheme",
            "ST": "st",
            "SQL": "sql",
            "swift": "swift",
            "TCL": "tcl"
        };
        if (langMap[lang] === undefined) {
            alert('Highlighting of code is not supported for the choosen language');
            return;
        }
        setLanguage(langMap[lang]);
    };

    const changeTheme = (event) => {
        const theme = event.target.value;
        setEditorTheme(theme);
    };

    const handleFileSelect = (event) => {
        var file = event.target.files[0];
        console.log(file);
        var start = 0, stop = file.size - 1;
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            if (evt.target.readyState == FileReader.DONE) {
                console.log(evt.target.result);
                setSourceCode(evt.target.result);
            }
        };
        var blob = file.slice(start, stop + 1);
        reader.readAsBinaryString(blob);
    };

    const toggleCustomInput = (event) => {
        console.log(event.target.value);
        var checkBox = document.getElementById('customInputCheckBox');
        var customInputDiv = document.getElementById('customInputDiv');
        var customInput = document.getElementById('customInput');
        if (checkBox.checked == true) {
            customInputDiv.style.display = 'block';
        } else {
            customInputDiv.style.display = 'none';
            customInput.value = '';
        }
    };

    return (
        <React.Fragment>
            { Title(problemContent.problemName) }

            <div id="problem" className="row px-1">
                <div className="col-sm-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/contests">Contests</Link></li>
                            <li className="breadcrumb-item"><Link to={ "/contests/" + props.match.params.contestCode }>{ props.match.params.contestCode }</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{ problemContent.problemName }</li>
                        </ol>
                    </nav>
                </div>
                <div className="col-sm-12">
                    <div className="row">
                        <div className="col">
                            <h2 className="problem-header">
                                { problemContent.problemName }
                                <span >
                                    | Problem Code: <strong>{ problemContent.problemCode }</strong>
                                </span>
                                <button className="btn btn-sm btn-info float-right">Submit</button>
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="row px-1 py-3">
                        <div className="col-8 shadow-right">
                            <div dangerouslySetInnerHTML={ { __html: problemContent.body } } />
                            <div className="row">
                                <div className="problem-info">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-3">Author:</div>
                                            <div className="col-9">{ problemContent.author }</div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        { renderTags() }
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-3">Date Added:</div>
                                            <div className="col-9">{ problemContent.dateAdded }</div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-3">Time Limit:</div>
                                            <div className="col-9">{ problemContent.maxTimeLimit } Secs</div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-3">Source Limit:</div>
                                            <div className="col-9">{ problemContent.sourceSizeLimit } Bytes</div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        { renderLanguages() }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            { renderSuccessfulSubmission() }
                            { showSuccessfulSubmission && <SuccessfulSubmission successfulSubmission={ successfulSubmission } /> }
                        </div>
                    </div>
                    <br></br>
                    <div className="row px-1 py-3">
                        <div className="col-11 d-sm-flex justify-content-left">
                            <div className="row w-75">
                                <div className="col-11">
                                    <form onSubmit={ handleSubmit }>
                                        <div className="editor-header">
                                            <div className="col-11">
                                                <div className="row">
                                                    <div className="col">
                                                        <select name="lang" className="custom-select" onChange={ changeLanguage }>
                                                            {
                                                                problemContent.languagesSupported.map((lang, i) => {
                                                                    return (
                                                                        <option value={ lang } key={ i }>{ lang }</option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col">
                                                        <select className="custom-select" onChange={ changeTheme }>
                                                            <option value="light">Light</option>
                                                            <option value="dark">Dark</option>
                                                             <option value="Active4D">Active4D</option>
                                                <option value="Amy">Amy</option>
                                                <option value="Blackboard">Blackboard</option>
                                                <option value="Clouds">Clouds</option>
                                                <option value="Cobalt">Cobalt</option>
                                                <option value="Dawn">Dawn</option>
                                                <option value="Dreamweaver">Dreamweaver</option>
                                                <option value="Eiffel">Eiffel</option>
                                                <option value="GitHub">GitHub</option>
                                                <option value="IDLE">IDLE</option>
                                                <option value="Katzenmilch">Katzenmilch</option>
                                                <option value="LAZY">LAZY</option>
                                                <option value="Merbivore">Merbivore</option>
                                                <option value="Monokai">Monokai</option>
                                                <option value="Solarized-dark">Solarized-dark</option>
                                                <option value="Solarized-light">Solarized-light</option>
                                                <option value="SpaceCadet">SpaceCadet</option>
                                                <option value="Sunburst">Sunburst</option>
                                                <option value="Tomorrow-Night-Blue">Tomorrow-Night-Blue</option> 
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="editor">
                                            <ControlledEditor
                                                height="65vh"
                                                theme={ editorTheme }
                                                language={ language }
                                                value={ sourceCode }
                                                onChange={ handleEditorChange }
                                            />
                                        </div>
                                        <div className="editor-footer d-flex justify-content-between">
                                            <div className="editor-line-column">
                                                { editorLineColumn.Line + " : " + editorLineColumn.Column }
                                            </div>
                                            <div className="" id="submission-queued">

                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <button type="button" className="btn btn-info" onClick={ () => { document.getElementById('selectFile').click(); } } >
                                                    Open File
                                                </button>
                                                <input type="file" id="selectFile" onChange={ handleFileSelect } style={ { display: 'none' } }></input>
                                            </div>
                                            <div>
                                                <div className="custom-control custom-checkbox custom-control-inline">
                                                    <input type="checkbox" className="custom-control-input" id="customInputCheckBox" onClick={ toggleCustomInput }></input>
                                                    <label className="custom-control-label" htmlFor="customInputCheckBox">Custom Input</label>
                                                </div>
                                                <button type="submit" className="btn btn-info run-button" data-toggle="button" aria-pressed="false" autocomplete="off">Run</button>
                                                <button type="submit" className="btn btn-info submit-button" disabled>Submit</button>
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="form-group" id="customInputDiv">
                                            <label htmlFor="customInput">Custom Input</label>
                                            <textarea className="form-control" id="customInput" name="input" rows="4"></textarea>
                                        </div>
                                    </form>
                                    <br></br>
                                    <div className="run-info" id="run-info">
                                        <RunDetails runDetails={ runDetails } />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default withRouter(Problems);