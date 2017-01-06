import { ActionServer } from '@manekinekko/google-actions-server';

const elasticlunr = require('elasticlunr');
const request = require('request');
const cheerio = require('cheerio');

class LearnAngularAction {
    constructor() {
        // create a google action server
        this.agent = new ActionServer();

        this.agent.setGreetings([`
            Hello, The NgBot is designed to help you learn Angular!

            It knows the whole Angular documentation and can answer differenet questions about it.

            You can ask different things about Angular. Here are some examples:
                What is Angular?
                I need to know what is component?
                Or, Tell me about directives.
        `]);

        this.assistant = null;

    }

    // the (default) intent triggered to welcome the user
    welcomeIntent(assistant) {
        this.agent.randomGreeting();
    }

    // the intent triggered on user's requests
    textIntent(assistant) {
        this.assistant = assistant;

        const timer = setTimeout(() => {

            assistant.tell('Sorry NgBot is having some technical issues. Please try later.');

        }, 5000);

        const rawInput = assistant.getRawInput();

        this.search(rawInput, (error, content) => {
            clearTimeout(timer);
            this.agent.ask(content);
        });


    }

    search(rawInput, responseCallback) {

        this.agent.request({
            method: 'POST',
            url: 'http://ngbot.io:4242/search',
            json: {
                question: rawInput
            }
        }, (error, httpResponse, body) => {
            responseCallback(error, body.result);
        });
    }

    // start everything!!
    listen() {
        // register intents and start server
        this.agent.welcome(this.welcomeIntent.bind(this));
        this.agent.intent(ActionServer.intent.action.TEXT, this.textIntent.bind(this));
        this.agent.listen();
    }
}

(new LearnAngularAction()).listen();