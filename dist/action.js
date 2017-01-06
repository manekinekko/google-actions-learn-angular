'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _googleActionsServer = require('@manekinekko/google-actions-server');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var elasticlunr = require('elasticlunr');
var request = require('request');
var cheerio = require('cheerio');

var LearnAngularAction = function () {
    function LearnAngularAction() {
        _classCallCheck(this, LearnAngularAction);

        // create a google action server
        this.agent = new _googleActionsServer.ActionServer();

        this.agent.setGreetings(['\n            Hello, The NgBot is designed to help you learn Angular!\n\n            It knows the whole Angular documentation and can answer differenet questions about it.\n\n            You can ask different things about Angular. Here are some examples:\n                What is Angular?\n                I need to know what is component?\n                Or, Tell me about directives.\n        ']);

        this.assistant = null;
    }

    // the (default) intent triggered to welcome the user


    _createClass(LearnAngularAction, [{
        key: 'welcomeIntent',
        value: function welcomeIntent(assistant) {
            this.agent.randomGreeting();
        }

        // the intent triggered on user's requests

    }, {
        key: 'textIntent',
        value: function textIntent(assistant) {
            var _this = this;

            this.assistant = assistant;

            var timer = setTimeout(function () {

                assistant.tell('Sorry NgBot is having some technical issues. Please try later.');
            }, 5000);

            var rawInput = assistant.getRawInput();

            this.search(rawInput, function (error, content) {
                clearTimeout(timer);
                _this.agent.ask(content);
            });
        }
    }, {
        key: 'search',
        value: function search(rawInput, responseCallback) {

            this.agent.request({
                method: 'POST',
                url: 'http://ngbot.io:4242/search',
                json: {
                    question: rawInput
                }
            }, function (error, httpResponse, body) {
                responseCallback(error, body.result);
            });
        }

        // start everything!!

    }, {
        key: 'listen',
        value: function listen() {
            // register intents and start server
            this.agent.welcome(this.welcomeIntent.bind(this));
            this.agent.intent(_googleActionsServer.ActionServer.intent.action.TEXT, this.textIntent.bind(this));
            this.agent.listen();
        }
    }]);

    return LearnAngularAction;
}();

new LearnAngularAction().listen();