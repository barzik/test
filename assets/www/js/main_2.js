
var logger;
var display;

function initialize() {
	logger = $("#spani"); 
	display = $("#display");
	addLog("init");
}

function addLog(str) {
	$(logger).html($(logger).html() + str + "<br>");
}

function clickButton() {
	addLog("click");
	var offset = $("#offset");
	var url = "http://ws.cache.mobile1.co.il/ws.ashx/GetGamesByDay?i_Offset=" + $(offset).val() + "&os=android&ver=14";
	var client = new XMLHttpRequest();
	client.open("GET", url, false);
	client.setRequestHeader("Content-Type", "text/plain");
	addLog("sending request to " + url);
	client.send();
	
	if (client.status == 200) {
		addLog("The request succeeded!");
		document.getElementById("response").innerHTML = client.responseText;
		handleXml(client.responseText);
	}				
	else {
		addLog("The request did not succeed!");
		addLog("The response status was: " + client.status + " " + client.statusText + ".");
	}
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
	addLog("useFilter " + document.getElementById("useFilter").checked);
	//document.getElementById("useFilter").checked
	// run on all GamesBySubject
	$(rootNode).children().each(function(index, node){
		
		$(display).append("</br>");
		//"Subject"					
		var subject = $(node).find("Subject")[0];
		addLog("Found subject '" + subject.textContent + "'");
		
		// check filter
		
		var str="<div class=\"liga\">" + subject.textContent + "</div>";
		$(display).append(str);
	
		// Games
		//var games = node.childNodes[3];
		var games = $(node).find("LiveGame");
		addLog("found " + games.length + " games");

		$(games).each(function(index, node){
			var gameDiv = getGame(node);
			$(display).append(gameDiv);
		});			
	});
}

function getGame(gameNode) {

	var gameDiv = $("<div></div>");
	$(gameDiv).addClass("divGame");
	
	//LiveID
	var gameId = $(gameNode).find("LiveID")[0].textContent;
	addLog("LiveID " + gameId);
	
	// HomeIcon
	var homeIcon = $(gameNode).find("HomeIcon")[0].textContent;
	addLog("HomeIcon " + homeIcon);
	if (homeIcon.length > 0) {
		var imgHomeIcon = $("<img>");
		imgHomeIcon.attr("src", homeIcon);
		imgHomeIcon.attr("id", "imgleft" + gameId);
		imgHomeIcon.attr("width", "20");
		imgHomeIcon.attr("height", "20");
		imgHomeIcon.attr("align", "left");
		$(gameDiv).append(imgHomeIcon);
	}
			
	//GuestTeam
	var guestTeam = $(gameNode).find("GuestTeam")[0].textContent;
	addLog("GuestTeam " + guestTeam);
	var spanGuestTeam = $("<span></span>");
	$(spanGuestTeam).addClass("spanTeam");				
	$(spanGuestTeam).text(guestTeam + " ");
	$(gameDiv).append(spanGuestTeam);
	
	//GuestScore
	var guestScore = $(gameNode).find("GuestScore")[0].textContent;
	addLog("GuestScore " + guestScore);
	var spanGuestScore = $("<span></span>");
	$(spanGuestScore).addClass("spanScore");
	$(spanGuestScore).text(guestScore + " - ");
	$(gameDiv).append(spanGuestScore);

	//HomeScore
	var homeScore = $(gameNode).find("HomeScore")[0].textContent;
	addLog("HomeScore " + homeScore);
	var spanHomeScore = $("<span></span>");
	$(spanHomeScore).addClass("spanScore");				
	$(spanHomeScore).text(homeScore + " ");
	$(gameDiv).append(spanHomeScore);

	//HomeTeam
	var homeTeam = $(gameNode).find("HomeTeam")[0].textContent;
	addLog("homeTeam " + homeTeam);
	var spanHomeTeam = $("<span></span>");
	$(spanHomeTeam).addClass("spanTeam");
	$(spanHomeTeam).text(homeTeam);
	$(gameDiv).append(spanHomeTeam);
	
	//GuestIcon
	var guestIcon = $(gameNode).find("GuestIcon")[0].textContent;
	addLog("GuestIcon " + guestIcon);
	if (guestIcon.length > 0) {
		var imgGuestIcon = $("<img>");
		imgGuestIcon.attr("src", guestIcon);
		imgHomeIcon.attr("id", "imgright" + gameId);
		imgGuestIcon.attr("width", "20");
		imgGuestIcon.attr("height", "20");
		imgGuestIcon.attr("align", "right");
		$(gameDiv).append(imgGuestIcon);
	}

	//Condition 
	var gameCondition = $(gameNode).find("Condition")[0].textContent;
	addLog("Condition " + gameCondition);
	var spanGameCondition = $("<span></span>");
	$(spanGameCondition).addClass("spanCondition");
	if (gameCondition.valueOf() == "Ended".valueOf()) {
		addLog("Game ended");
		$(spanGameCondition).text(" End");
	} else if (gameCondition.valueOf() == "NotStarted".valueOf()) {
		addLog("Game NotStarted");
		//StartTime
		var startTime = $(gameNode).find("StartTime")[0].textContent;
		addLog("StartTime " + startTime);
		$(spanGameCondition).text(" " + startTime);
	} else {
		//GameMinute
		var gameMinute = $(gameNode).find("GameMinute")[0].textContent;
		addLog("GameMinute " + gameMinute);
		$(spanGameCondition).text(" " + gameMinute);
	}
	$(gameDiv).append(spanGameCondition);

	//GameType
	var gameType = $(gameNode).find("GameType")[0].textContent;
	addLog("GameType " + gameType);
	
	return gameDiv;
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