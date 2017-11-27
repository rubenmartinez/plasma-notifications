// Not sure about the ECMAScript version supported, so better to play safe

function getFormattedDate() {
	return (new Date()).toISOString();
}

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
}

function logNotification(notification) {
    dataEngine("executable").connectSource("echo 'test2' >> /home/rmartinez/var/log/notifications.log", function() {} );

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