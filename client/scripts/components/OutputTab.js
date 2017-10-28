import React from 'react'
import renderHTML from 'react-render-html';

import socket from '../model/socket'

class OutputTab extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            question: 0,
            loading: false,
            QAs: []
        };
        socket.on('user code result', this.onResult.bind(this));
    }

    onResult (result) {
        const QAs = this.state.QAs;
        const qa = QAs[result.inputId] = {};

        console.log(result);

        qa.input = result.input;

        qa.output = '';

        if (result.output) {
            qa.output += `<span>${result.output}</span>\n`
        }

        if (result.hasErrors) {
            qa.output += `<span class="red">${result.error}</span>`;
        }

        qa.score = result.score;
        qa.duration = result.duration;
        qa.steps = result.steps;

        this.setState({ QAs, loading: false });
    }

    changeQuestionTo (i) {
        this.setState({ question: i })
    }

    submitTheCode () {
        this.startLoading();

        const code = window.localStorage['hacka-editor-code'] || '';
        const language = window.localStorage['hacka-editor-language'] || '';
        const username = window.localStorage['hacka-username'] || '';
        const password = window.localStorage['hacka-password'] || '';

        socket.emit('user run code', {
            username: username,
            password: password,
            type: 'submit',
            language: language,
            code: code
        })
    }

    startLoading () {
        this.setState({ loading: true })
    }

    get questionItems () {
        const ret = [];
        for (let i = 1; i <= this.props.inputsCount; i++) ret.push(
            <li
                key={i}
                className={this.state.question === (i - 1) ? 'active' : ''}
                onClick={() => this.changeQuestionTo(i - 1)}
            >
                {i}
            </li>
        )
        return ret;
    }

    get tabStyle () {
        return { display: this.props.hidden ? 'none' : 'flex' };
    }

    get current () {
        const question = this.state.QAs[this.state.question];
        if (question) return question;
        return { input: '', output: '' }
    }

    render() {

        const loader = this.state.loading ? (<div className="cssload-container">
            <div className="cssload-whirlpool" />
            <span>Running The Code...</span>
        </div>) : null;

        return (
            <div style={this.tabStyle} className="tab-page" id="output">
                {loader}
                <aside>{this.questionItems}</aside>
                <section>
                    <div className="input">
                        <h1>Input:</h1>
                        <pre>{ this.current.input }</pre>
                    </div>
                    <div className="output">
                        <h1>Output:</h1>
                        <pre>{ renderHTML(this.current.output) }</pre>
                    </div>
                    <div className="result">
                        <div>Duration<span>{this.current.duration ? this.current.duration + 'ms' : '-'}</span></div>
                        <div>Score<span>{this.current.score || '-'}</span></div>
                        <div>Steps<span>{this.current.steps || '-'}</span></div>
                    </div>
                    <div className="submit-container"><button onClick={this.submitTheCode.bind(this)}>Submit The Code</button></div>
                </section>
            </div>
        )
    }
}

export default OutputTab