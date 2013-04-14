
var logger;
var display;
var filter;

$(document).ready(function() {
	initialize();
});

function initialize() {
	logger = $("#spani"); 
	display = $("#display");
	addLog("init");

	if (JSInterface !== undefined) {
		var filterString = JSInterface.getFilter();
		addLog("JSInterface.getFilter() " + filterString);
		filter = filterString.split(";");
	} else {
		filter = new array("tamir2");
	}
}

function addLog(str) {
	$(logger).html($(logger).html() + str + "<br>");
}

function clickButton() {
	addLog("click");
	var offset = $("#offset");
	var url = "http://ws.cache.mobile1.co.il/ws.ashx/GetGamesByDay?i_Offset=" + $(offset).val() + "&os=android&ver=14";
	var client = new XMLHttpRequest();
	client.open("GET", url, true);
	client.setRequestHeader("Content-Type", "text/plain");
	addLog("sending request to " + url);
	
	client.onreadystatechange=function() {
		if (client.readyState==4 && client.status==200) {
			addLog("The request succeeded!");
			handleXml(client.responseText);
		} else {
			addLog("The request did not succeed!");
			addLog("The response status was: " + client.status + " " + client.statusText + ".");
		}
	}
	client.send();
}

function handleXml(xmlResponse) {
	addLog("handleXml");
	// alert(xmlResponse);
	var xmlDoc = $.parseXML(xmlResponse);
	
	// ArrayOfGamesBySubject
	var rootNode = $(xmlDoc).find("ArrayOfGamesBySubject");
	if (!rootNode) {
		addLog("ArrayOfGamesBySubject not exist");
		return;
	}
	addLog("ArrayOfGamesBySubject exist");
	addLog("rootNode.children().length " + rootNode.children().length);
	if (rootNode.children().length == 0) {
		addLog("there are no GamesBySubject");
		return;				
	}
	checkGamesBySubject(rootNode);
}

function checkGamesBySubject(rootNode) {
	
	$(display).text("");
	displayTable = $("<table></table>");
	addLog("useFilter " + document.getElementById("useFilter").checked);
	//document.getElementById("useFilter").checked
	// run on all GamesBySubject
	$(rootNode).children().each(function(index, node){
		
		var spaceTr = $("<tr></tr>");
		var spaceTd = $("<td></td>");
		spaceTd.attr("colspan", "4");
		$(spaceTd).html("&nbsp;");
		$(spaceTr).append(spaceTd);
		$(displayTable).append(spaceTr);
		
		//"Subject"					
		var subject = $(node).find("Subject")[0].textContent;
		addLog("Found subject '" + subject + "'");
		
		// check filter
		if (filterSubject(subject) == false) {
			var subjectTr = $("<tr></tr>");
			var subjectTd = $("<td></td>");
			subjectTd.attr("colspan", "4"); // TODO: check # of td
			$(subjectTd).html(subject);
			$(subjectTd).addClass("liga");
			$(subjectTr).append(subjectTd);
			$(displayTable).append(subjectTr);
		
			// Games
			//var games = node.childNodes[3];
			var games = $(node).find("LiveGame");
			addLog("found " + games.length + " games");

			$(games).each(function(index, node){
				var gameTr = getGame(node);
				$(displayTable).append(gameTr);
			});
		}
	});
	$(display).append(displayTable);
}

function getGame(gameNode) {

	var gameTr = $("<tr></tr>");
	$(gameTr).addClass("divGame");
	
	//LiveID
	var gameId = $(gameNode).find("LiveID")[0].textContent;
	addLog("LiveID " + gameId);
	
	// HomeIcon
	var homeIcon = $(gameNode).find("HomeIcon")[0].textContent;
	addLog("HomeIcon " + homeIcon);
	var imgHomeIconTd = $("<td></td>");
	if (homeIcon.length > 0) {
		var imgHomeIcon = $("<img>");
		imgHomeIcon.attr("src", homeIcon);
		imgHomeIcon.attr("id", "imgleft" + gameId);
		imgHomeIcon.attr("width", "20");
		imgHomeIcon.attr("height", "20");
		imgHomeIcon.attr("align", "left");	
		$(imgHomeIconTd).append(imgHomeIcon)
	} else {
		$(imgHomeIconTd).text(" ");
	}
	$(gameTr).append(imgHomeIconTd);
			
	//GuestTeam
	var guestTeam = $(gameNode).find("GuestTeam")[0].textContent;
	addLog("GuestTeam " + guestTeam);
	var tdGuestTeam = $("<td></td>");
	$(tdGuestTeam).addClass("tdTeam");
	$(tdGuestTeam).attr("align", "right");
	$(tdGuestTeam).text(guestTeam);
	$(gameTr).append(tdGuestTeam);
	
	//Score
	var tdScore = $("<td></td>");
	$(tdScore).addClass("tdScore");
	//GuestScore
	var guestScore = $(gameNode).find("GuestScore")[0].textContent;
	addLog("GuestScore " + guestScore);
	//HomeScore
	var homeScore = $(gameNode).find("HomeScore")[0].textContent;
	addLog("HomeScore " + homeScore);
	$(tdScore).text(guestScore + " - " + homeScore);
	$(gameTr).append(tdScore);
	
	//HomeTeam
	var homeTeam = $(gameNode).find("HomeTeam")[0].textContent;
	addLog("homeTeam " + homeTeam);
	var tdHomeTeam = $("<td></td>");
	$(tdHomeTeam).addClass("tdTeam");
	$(tdHomeTeam).attr("align", "left");
	$(tdHomeTeam).text(homeTeam);
	$(gameTr).append(tdHomeTeam);

	//GuestIcon
	var guestIcon = $(gameNode).find("GuestIcon")[0].textContent;
	addLog("GuestIcon " + guestIcon);
	var imgGuestIconTd = $("<td></td>");
	if (guestIcon.length > 0) {
		var imgGuestIcon = $("<img>");
		imgGuestIcon.attr("src", guestIcon);
		imgHomeIcon.attr("id", "imgright" + gameId);
		imgGuestIcon.attr("width", "20");
		imgGuestIcon.attr("height", "20");
		imgGuestIcon.attr("align", "right");
		$(imgGuestIconTd).append(imgGuestIcon);
	} else {
		$(imgGuestIconTd).text(" ");
	}
	$(gameTr).append(imgGuestIconTd);
	
	//StartTime
	var startTime = $(gameNode).find("StartTime")[0].textContent;
	addLog("StartTime " + startTime);
	//Condition 
	var gameCondition = $(gameNode).find("Condition")[0].textContent;
	addLog("Condition " + gameCondition);
	var tdGameCondition = $("<td></td>");
	$(tdGameCondition).addClass("tdCondition");
	if (gameCondition.valueOf() == "Ended".valueOf()) {
		addLog("Game ended");
		$(tdGameCondition).text("End");
	} else if (gameCondition.valueOf() == "NotStarted".valueOf()) {
		addLog("Game NotStarted");		
		$(tdGameCondition).text(startTime);
	} else {
		//GameType
		var gameType = $(gameNode).find("GameType")[0].textContent;
		addLog("GameType " + gameType);
		if (gameType.valueOf() == "Basketball".valueOf()) {
			$(tdGameCondition).text(startTime);
		} else {
			//GameMinute
		var gameMinute = $(gameNode).find("GameMinute")[0].textContent;
		addLog("GameMinute " + gameMinute);
		$(tdGameCondition).text(" " + gameMinute);
		}
	}
	$(gameTr).append(tdGameCondition);

	
	
	return gameTr;
/*
<LiveID>188325</LiveID>
<PeriodType>None</PeriodType>
<HomeHalfScore>-1</HomeHalfScore>
<GuestHalfScore>-1</GuestHalfScore>
<PenaltyHomeScore>-1</PenaltyHomeScore>
<PenaltyGuestScore>-1</PenaltyGuestScore>
<GameDate>2013-04-08T00:00:00</GameDate>
<HasEvents>false</HasEvents>			
*/
}

function filterSubject(subject) {
	if (!filter) {
		return false;
	}
	
	$(filter).each(function(index, str) {
		//if (subject.index)
		
	});
	
	return false;
}