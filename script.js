const debugMode = false;

class MessageLog {
    constructor(subformDataName, scope, buttonTitle) {
        this.field = $('[data-name="' + subformDataName + '"] [data-name="messageLog"]').length ? $('[data-name="' + subformDataName + '"] [data-name="messageLog"]') : null;
        this.scope = scope;
        this.entries = {};
        this.buttonTitle = buttonTitle;
        
        this.init();
        
        console.log(this);
    }

    isValid() {
        return debugMode || this.field !== null;
    }
    hasButton() {
        return this.isValid() && this.button != null;
    }

    sendMessage() {
        if (messageInput.attr('valid') === 'true') {
            this.addMessage(new Message(new Date().toISOString(), currentUserID, currentUserName, this.scope, messageInput.val()));
            messageInput.val('').change().trigger('input');
        }
    }
    addMessage(message) {
        if (this.isValid()) {
            this.field.val(this.field.val() + '\n' + message.id + '|' + message.edited + '|' + message.timestamp + '|' + message.userID + '|' + message.userName + '|' + message.message).change().trigger('input');
        }
    }

    updateAttribute(valid) {
        if (this.hasButton()) {
            this.button.attr('valid', valid);
        }
    }
    
    edited(event) {
        console.log("Changed " + event.data.log.scope);
    }
    clicked(event) {
        if (messageInput.attr('valid') === 'true') {
		  event.data.log.addMessage(new Message(new Date().toISOString(), currentUserID, currentUserName, event.data.log.scope, messageInput.val()));
		  messageInput.val('').change().trigger('input');
		}
    }
    init() {
        if (this.isValid()) {
            this.field.change({log: this}, this.edited);
            if (this.buttonTitle !== undefined) {
            	this.button = $('<button title="' + this.buttonTitle + '" id="button' + this.scope.charAt(0).toUpperCase() + this.scope.slice(1) + '"><svg viewBox="0 0 24 24"><path d="M 5.019 10.761 L 9.085 13.628 L 11.699 12.09 L 9.854 14.836 L 13.204 18.856 L 16.961 6.653 L 5.019 10.761 M 24 12 C 24 18.627 18.628 24 12.001 24 C 5.374 24 0 18.627 0 12 C 0 5.373 5.374 0 12.001 0 C 18.628 0 24 5.373 24 12 Z" /></svg></button>').appendTo(messageContainer);
            	this.button.click({log: this}, this.clicked);
            }
        }
    }
}

class Message {
    constructor(timestamp, userID, userName, scope, message, id, edited) {
        this.timestamp = timestamp;
        this.userID = userID;
        this.userName = userName;
        this.scope = scope;
        this.message = message;

        if (id === undefined) {
            id = crypto.randomUUID();
        }
        this.id = id;

        if (edited === undefined) {
            edited = false;
        }
        this.edited = edited;
    }
}

const messageContainer = $('#chatbox #input');
const messageInput = $('#chatbox #input #messageInput');
const messageHistory = $('#chatbox #history');
const currentUserID = '{#user_id}';
const currentUserName = '{#user_name}';

    var messageLogs = {
        base: new MessageLog('subMessageLog', 'external', 'Send'),
        internal: new MessageLog('subMessageLogInternal', 'internal', 'Send Internal'),
        caseviewer: new MessageLog('subMessageLogCase', 'caseviewer')
    };  



/*
	These functions and events control the message box input text field.
  The input is checked when it is changed and updates the valid attribute on itself and every button
  The buttons then use this for styling.
*/
messageInput.keyup(checkInputIsValid);
messageInput.change(checkInputIsValid);
messageInput.keypress(function(e) {
    if (e.which == 13) {
        messageLogs.base.addMessage();
        return false;
    }
});

function checkInputIsValid(inputField) {
    let flag = 'true';
    if ($(this).val() == '') {
        flag = 'false';
    }
    if ($(this).attr('valid') !== flag) {
        $(this).attr('valid', flag);

        for (const log of Object.values(messageLogs)) {
            log.updateAttribute(flag);
        }
    }
}

function logEdited(log) {
    console.log("log edited: " + log);
    log.entries = {};
    console.log("here: " + log.scope);
    /*log.field.val().split('\n').forEach(function(entry, index) {
        if (entry) {
            let messageParts = entry.split('|');
            log.entries[messageParts[0]] = new Message(parseISOString(messageParts[2]), messageParts[3], messageParts[4], log.scope, messageParts[5], messageParts[0], messageParts[1]);
        }
    });
    console.log("here1");

    messageHistory.empty();
    let entries = [];
    console.log("here2");
    for (const log of Object.values(messageLogs)) {
        entries = entries.concat(Object.values(log.entries));
    }
    console.log("here3");
    let sortedEntries = entries.sort((a, b) => a.timestamp - b.timestamp);
    sortedEntries.forEach(function(entry, index) {
        createMessage(entry);
    });
    console.log("here4");*/
}
