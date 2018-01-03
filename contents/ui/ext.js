// Not sure about the ECMAScript version supported, so better to play safe

function getFormattedDate() {
	return (new Date()).toISOString();
}

function elasticSearchPost(index, type, document) {
  // construct an HTTP request

  log("starting elasticSearchPost: " + document, "/home/rmartinez/var/log/notifications-debug.log");

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://http://localhost:9200/"+index+"/"+type, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

  log("URL: " + "http://http://localhost:9200/"+index+"/"+type);
  log("document: " + JSON.stringify(document));

  // send the collected data as JSON
  xhr.send(JSON.stringify(document));

 
  xhr.onloadend = function () {
    // done
  };
};

function logElectronNotification(notification) {
	var electronLogFile="/home/rmartinez/var/log/skype_events/skype_notifications.log";
	var date = getFormattedDate();

	var reGroupChat = /(.*) in "(.*)"$/;
	var sender = notification.summary;
	var groupChat = '-';
	if (notification.summary) {
		var found = notification.summary.match(reGroupChat)
		if (found) {
			sender = found[1];
			groupChat = found[2];
		}
	}

	var flags = '';
	reQuoted = /(.*) quoted you/
	found = sender.match(reQuoted)
	if (found) {
		sender = found[1];
		flags = 'quoted';
	}

	var str = date + " ["+sender+"]["+groupChat+"]["+flags+"]: " + notification.body;
	log(str, electronLogFile);

	var elasticSearchDocument = {
		"date": date,
		"sender": sender,
		"groupChat": groupChat,
		"flags": flags,
		"body": notification.body
	}
	elasticSearchPost("skype", "message", elasticSearchDocument);
}

function logNotification(notification) {
	var logFile="/home/rmartinez/var/log/notifications.log";
	var date = getFormattedDate();
	var str = '{ ' + 
	          '"date": "' + date + '", ' +
	          '"source": "' + notification.source + '", ' +
	          '"appName": "' + notification.appName + '", ' +
	          '"summary": "' + notification.summary + '", ' +
	          '"body": "' + notification.body + '", ' +
	          '"actions": "' + notification.actions + '", ' +
	          '"appRealName": "' + notification.appRealName + '" ' +
	          '}';

	log(str, logFile);
}

function log(str, logFile) {
	var command = "echo '"+str+"' >> "+logFile;
	dataEngine("executable").connectSource(command, function() {} );
}