/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.e7a1c34a-2a07-431c-890e-7526440e7474";  // TODO replace with your app ID (OPTIONAL).
const LAUNCH_MESSAGE = "Welcome to the day of week, you can ask me to tell the day of any particular date you remember.";
const LAUNCH_MESSAGE_REPROMPT ="Welcome to the day of week";
const SKILL_NAME ="day of the week";
const HELP_MESSAGE= "you can say \"Alexa, what is the day on the date followed by <break time='0s'/> YOUR DATE\"";
const STOP_MESSAGE ="Good Bye";
var userDate= null;

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
const handlers = {
    'LaunchRequest': function () {
        console.log("Hello");
        const speechOutput = LAUNCH_MESSAGE;
        const repromptOutput = LAUNCH_MESSAGE_REPROMPT;
        this.emit(':askWithCard', speechOutput, repromptOutput, SKILL_NAME, removeSSML(speechOutput));
    },
    'GetDayOfTheWeek': function () {
        this.emit('GetDay');
    },
    'GetDay': function () {
        if (this.event.request.intent != null) {
          	userDate = this.event.request.intent.slots.DATE.value;
						if(!isDate(userDate)){
                userDate = "";
								this.emit(':ask', "Sorry the given date is not supported.", "Please specify a proper formated date.");
						}
        }
        //yyyy-mm-dd
        console.log("User Date:", userDate);
        var date, month, year;
        date = parseInt(userDate.substr(8, 2));
        month = parseInt(userDate.substr(5,2));
        year = parseInt(userDate.substr(0,4));
        
        var curdate=(new Date()).toLocaleDateString();
        console.log("CurrDate",curdate, curdate.length);
        var dt, mt, yr, i;
        for(i = 0 ; i < curdate.length ; i++){
            if(curdate[i] == '/'){
                mt = parseInt(curdate.substr(0, i));
                break;
            }
        }
        var j;
        for(j = i + 1 ; j < curdate.length ; j++){
            if(curdate[j] == '/'){
                dt = parseInt(curdate.substr(i + 1, j - i - 1));
                break;
            }
        }
        yr=parseInt(curdate.substr(j + 1, curdate.length - j));
        console.log("Cur data", yr, mt, dt);
        var day = dayofweek(parseInt(date), parseInt(month), parseInt(year));
        console.log("Day", day);
        var flag = "";
   
        // Create speech output
        
        if(year > yr){
            flag = "is";
        }
        else if (year < yr){
            flag = "was";
        }
        else {
            if (month > mt){
                flag = "is";
            }
            else if (month < mt){
                flag = "was";
            }
            else{
                if(date >= dt){
                    flag = "is"
                }
                else {
                    flag = "was";
                }
            }
        }
        const speechOutput = "The day of the week on the date " + userDate + " " + flag + " " + day;  
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, removeSSML(speechOutput));
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_MESSAGE;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};

function removeSSML (s) {
    return s.replace(/<\/?[^>]+(>|$)/g, "");
}

function dayofweek( d,  m,  y)
{
    console.log("Function", "dayofweek");
    const  t = [ 0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4 ];
    y -= m < 3;
    var d =  ( y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) + t[m-1] + d) % 7;
    console.log("Value of d", d);
    var dayOfTheWeek = "";
    switch(d){
        case 0:dayOfTheWeek="Sunday";
            break;
        case 1: dayOfTheWeek = "Monday";
            break;
        case 2: dayOfTheWeek="Tuesday";
            break;
        case 3: dayOfTheWeek="Wednesday";
            break;
        case 4: dayOfTheWeek="Thursday";
            break;
        case 5: dayOfTheWeek="Friday";
            break;
        case 6: dayOfTheWeek="Saturday";
            break;  
        default : 
            dayOfTheWeek = "is not a Valid Date";
        }
    return dayOfTheWeek;
}
var isDate = function(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}
