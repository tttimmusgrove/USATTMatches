//Returns a given stat such as wins, losses, both or ratio for a given year and player
function getStat(data, selection, yearBeg, yearEnd, type) {
    var wins = 0, losses = 0;
    var subcontainer = $(this);
    for (var year=yearBeg; year<yearEnd; year++){
        for (var i=1; i<data[year].length; i++) {
            if ((selection == getName(year, i, data)) && (type=="both" || type=="win" || type=="ratio")) {
                wins++;
            }
            else if ((selection == getNameOpponent(year, i, data)) && (type=="both" || type=="loss" || type=="ratio")) {
                losses++;
            }
        }
    }
    if (type=="both") {
        return wins+losses;
    }
    else if (type=="win") {
        return wins;
    }
    else if (type=="loss") {
        return losses;
    }
    else if (type="ratio") {
        if (losses == 0) {
            return 0;
        }
        else {
            return ((wins/losses).toFixed(2));
        }
    }
}

//Will print out table and graph with all information on first page of player profile
function printTable(data, selection) {
    var subcontainer = $(this);
    $('#hint').fadeOut();

    subcontainer.append("<p style='font-size:1rem; color: darkblue;'><strong>" + selection + "</strong></p><br/>");

    subcontainer.append("<table class='table'><tr><td></td><th scope='col'>All</th><th scope='col'>Wins</th><th scope='col'>Losses</th><th scope='col'>Ratio</th></tr><tr><th scope='row'>All</th><td>"+getStat(data,selection, 0, 4, "both")+"</td><td>"+getStat(data,selection,0,4,'win')+"</td><td>"+getStat(data,selection,0,4,'loss')+"</td><td>"+getStat(data,selection,0,4,"ratio")+"</td></tr><tr><th scope='row'>2015</th><td>"+getStat(data,selection, 0, 1, "both")+"</td><td>"+
    getStat(data,selection,0,1,'win')+"</td><td>"+getStat(data,selection,0,1,'loss')+"</td><td>"+getStat(data,selection,0,1,"ratio")+"</td></tr><tr><th scope='row'>2014</th><td>"+getStat(data,selection, 1, 2, 'both')+"</td><td>"+
    getStat(data,selection,1,2,'win')+"</td><td>"+getStat(data,selection,1,2,'loss')+"</td><td>"+getStat(data,selection,1,2,"ratio")+"</td></tr><tr><th scope='row'>2013</th><td>"+getStat(data,selection, 2, 3, 'both')+"</td><td>"+
    getStat(data,selection,2,3,'win')+"</td><td>"+getStat(data,selection,2,3,'loss')+"</td><td>"+getStat(data,selection,2,3,"ratio")+"</td></tr><tr><th scope='row'>2012</th><td>"+getStat(data,selection, 3, 4, 'both')+"</td><td>"+
    getStat(data,selection,3,4,'win')+"</td><td>"+getStat(data,selection,3,4,'loss')+"</td><td>"+getStat(data,selection,3,4,"ratio")+"</td></tr></table><br/>");

    subcontainer.append('<div class="surroundGraph"><h5 id="title">Win/Loss Ratio</h5><div id="placeholder"></div></div>');
    var options = {yaxis: {ticks:4, tickDecimals:0}, xaxis: {ticks:4, tickDecimals:0}, colors:["blue"], series: {points: {show:true, radius:2, fill:true}, lines:{show:true}}};

    $.plot(subcontainer.find('#placeholder'), [[[2012,getStat(data,selection,3,4,"ratio")], [2013,getStat(data,selection,2,3,"ratio")], [2014,getStat(data,selection,1,2,"ratio")], [2015,getStat(data,selection,0,1,"ratio")]]],options);

    subcontainer.append("<br/><input type='button' class='seeMatches' value='See ALL Matches'>");
}

//Empties both subcontainers and midcontainer so it appears as a "homepage"
function emptyEverything() {
    $('.subcontainer').empty();
    $('.midcontainer').empty();
}

//Prints out the most played opponent given a certain filter
function printMostPlayedOpponent(data) {
    var subcontainer = $(this);
    var answer;
    var currentOpponents = [];
    var totalP = subcontainer.find('p');
    var length = totalP.length-1;
    for(var i=1; i<length; i++) {
        currentOpponents.push(totalP[i].innerText.substring(10,totalP[i].innerText.indexOf(")")+1));
    }
    if (currentOpponents.length == 0)
        return null;

    var nameMap = {},
        mostFrequentName = currentOpponents[0],
        maxCount = 1;

    length = currentOpponents.length;
    for(var i = 0; i < length; i++)
    {
        var frequentName = currentOpponents[i];

        if (nameMap[frequentName] == null)
            nameMap[frequentName] = 1;
        else
            nameMap[frequentName]++;

        if (nameMap[frequentName] > maxCount)
        {
            mostFrequentName = frequentName;
            maxCount = nameMap[frequentName];
        }
        else if (nameMap[frequentName] == maxCount)
        {
            mostFrequentName += ', ' + frequentName;
            maxCount = nameMap[frequentName];
        }
    }
    subcontainer.find('input:nth-child(5)').after("<p><strong>Most Played Opponent(s):</strong></br>"+mostFrequentName+"<br/><strong>Games:</strong> "+maxCount+"</p>");
}

//This function will allow the win/loss toggle to filter the match data for each player
function selectType(data) {
    var subcontainer = $(this).parents('.subcontainer');
    subcontainer.find('.typeFilter option:selected').attr("selected", true);
    subcontainer.find('.yearSelection option:selected').attr("selected", true);
    var selectedName = subcontainer.find('p:nth-child(1)').text();
    var selectedOption = subcontainer.find('.typeFilter option:selected').val();
    var selectedYear = subcontainer.find('.yearSelection option:selected').val();
    if(selectedYear == "All") {
        var first = 0;
        var second = 4;
        var option = '.yearSelection option:nth-child(1)';
    }
    else if(selectedYear == "2015") {
        var first = 0;
        var second = 1;
        var option = '.yearSelection option:nth-child(2)';
    }
    else if(selectedYear == "2014") {
        var first = 1;
        var second = 2;
        var option = '.yearSelection option:nth-child(3)';
    }
    else if(selectedYear == "2013") {
        var first = 2;
        var second = 3;
        var option = '.yearSelection option:nth-child(4)';
    }
    else if(selectedYear == "2012") {
        var first = 3;
        var second = 4;
        var option = '.yearSelection option:nth-child(5)';
    }
    subcontainer.empty();
    if(selectedOption == "both") {
        printMatchData.bind(subcontainer)(data, selectedName, first, second, "both");
        subcontainer.find('.both').attr("selected", true);
    }
    else if(selectedOption == "wins") {
        printMatchData.bind(subcontainer)(data, selectedName, first, second, "win");
        subcontainer.find('.wins').attr("selected", true);
    }
    else if(selectedOption == "losses") {
        printMatchData.bind(subcontainer)(data, selectedName, first, second, "loss");
        subcontainer.find('.losses').attr("selected", true);
    }
    subcontainer.find(option).attr("selected", true);
}

//This function will allow the year selection to filter the match data for each player
function selectYear(data) {
    var subcontainer = $(this).parents('.subcontainer');
    subcontainer.find('.typeFilter option:selected').attr("selected", true);
    $(this).find('option:selected').attr("selected", true);
    var selectedName = subcontainer.find('p:nth-child(1)').text();
    var selectedOption = $(this).find('option:selected').val();
    var selectedType = subcontainer.find('.typeFilter option:selected').val();
    if(selectedType == "both") {
        var type = "both";
        var option = ".typeFilter option:nth-child(1)";
    }
    else if(selectedType == "wins") {
        var type = "win";
        var option = ".typeFilter option:nth-child(2)";
    }
    if(selectedType == "losses") {
        var type = "loss";
        var option = ".typeFilter option:nth-child(3)";
    }
    subcontainer.empty();
    if(selectedOption == "All") {
        printMatchData.bind(subcontainer)(data, selectedName, 0, 4, type);
        subcontainer.find('.All').attr("selected", true);
    }
    else if(selectedOption == 2015) {
        printMatchData.bind(subcontainer)(data, selectedName, 0, 1, type);
        subcontainer.find('.2015').attr("selected", true);
    }
    else if(selectedOption == 2014) {
        printMatchData.bind(subcontainer)(data, selectedName, 1, 2, type);
        subcontainer.find('.2014').attr("selected", true);
    }
    else if(selectedOption == 2013) {
        printMatchData.bind(subcontainer)(data, selectedName, 2, 3, type);
        subcontainer.find('.2013').attr("selected", true);
    }
    else if(selectedOption == 2012) {
        printMatchData.bind(subcontainer)(data, selectedName, 3, 4, type);
        subcontainer.find('.2012').attr("selected", true);
    }
    subcontainer.find(option).attr("selected", true);
}

//Will clear out all match, graph, and player information for one of the players
function clearPlayer() {
    var subcontainer = $(this).parents('.subcontainer');
    subcontainer.empty();
}

//Populates the middle section of the website and shows the matches that the two players played against each other
function printSimilarMatches(data) {
    var subcontainer = $(this);
    var person1 = $('#subcontainer1 p:nth-child(1)').text();
    var person2 = $('#subcontainer2 p:nth-child(1)').text();
    var person1Score = 0, person2Score = 0;
    $('.midcontainer').empty();
    for(var year=0; year<4; year++){
        for(var i = 1; i< data[year].length; i++) {
            if(person1 == getName(year, i, data) && person2 == getNameOpponent(year, i, data)) {
                $('.midcontainer').append("<p>" + getHeadToHead(year, i, data) + "</p>");
                person1Score++;
            }
            else if (person1 == getNameOpponent(year, i, data) && person2 == getName(year, i, data)) {
                $('.midcontainer').append("<p>" + getHeadToHeadOpponent(year, i, data) + "</p>");
                person2Score++;
            }
        }
    }
    $('.midcontainer').prepend("<p class='score'>" + person1Score + " - " + person2Score + "</p>");
    $('.midcontainer').prepend("<h4>Head-to-Head Match Score</h4>");
}

//This function prints out the player you select as well as all their matches below with details
function printMatchData(data, selection, yearBeg, yearEnd, type) {
    var wins = 0, losses = 0;
    var subcontainer = $(this);
    subcontainer.empty();
    subcontainer.append("<p style='font-size:1rem; color: darkblue;'><strong>" + selection + "</strong></p>");
    for(var year=yearBeg; year<yearEnd; year++){
        for(var i=1; i<data[year].length; i++) {
            if(selection == getName(year, i, data) && (type=="both" || type=="win")) {
                subcontainer.append("<p>" + getGameStats(year, i, data) + "</p>");
                wins++;
            }
            else if(selection == getNameOpponent(year, i, data) && (type=="both" || type=="loss")) {
                subcontainer.append("<p>" + getGameStatsOpponent(year, i, data) + "</p>");
                losses++;
            }
        }
    }
    subcontainer.find('p:first-child').after("<h3>Match History ("+wins+"-"+losses+")</h3>");

    subcontainer.find('p:first-child').after("<input type='button' value='Table Format' class='returnTable'>");

    subcontainer.find('p:first-child').after("<input type='button' value='Clear Player' class='clear'>");

    subcontainer.find('p:first-child').after("<select class='typeFilter'><option value='both' class='both'>Both wins/losses</option><option value='wins' class='wins'>wins</option><option value='losses' class='losses'>losses</option></select>");

    subcontainer.find('p:first-child').after("<select class='yearSelection'><option value='All' class='All'>All years</option><option value='2015' class='2015'>2015</option><option value='2014' class='2014'>2014</option><option value='2013' class='2013'>2013</option><option value='2012' class='2012'>2012</option></select>");

    subcontainer.append("<a href='index.html#top'>Back to Top</a>");

    printMostPlayedOpponent.bind(subcontainer)(data);
    $('#hint').fadeOut();
}

//This function prints out the names of all people with names that equal the name in the search box only once
function printNames(data) {
    var search = $(this).parents('.search');
    var currentArray = [];
    var counter = 0;
    var nameBox = search.find('.nameBox').val().toLowerCase();
    nameBox = nameBox.trim();
    if(nameBox == "") {
        nameBox = null;
    }
    var subcontainer = search.find('.subcontainer');
    var name = "name";
    var length = nameBox.length;
    subcontainer.empty();
    for(var year=0; year<4; year++){
        for(var i=1; i<data[year].length; i++) {
            var playerName = null;
            if(nameBox == data[year][i]["FirstName"].substr(0,length).toLowerCase()) {
                counter++;
                playerName = getName(year, i, data);
            }

            else if(nameBox == data[year][i]["Opponent First Name"].substr(0,length).toLowerCase()) {
                counter++;
                playerName = getNameOpponent(year, i, data);
            }
            else if(nameBox == data[year][i]["LastName"].substr(0,length).toLowerCase()) {
                counter++;
                playerName = getName(year, i, data);
            }
            else if (nameBox == data[year][i]["Opponent Last Name"].substr(0,length).toLowerCase()) {
                counter++;
                playerName = getNameOpponent(year, i, data);
            }
            else if (nameBox == (data[year][i]["FirstName"].toLowerCase() + " " + data[year][i]["LastName"].toLowerCase())) {
                counter++;
                playerName = getName(year, i, data);
            }
            else if (nameBox == (data[year][i]["Opponent First Name"].toLowerCase() + " " + data[year][i]["Opponent Last Name"].toLowerCase())) {
                counter++;
                playerName = getNameOpponent(year, i, data);
            }

            if(playerName) {
                if(counter==1) {
                    subcontainer.append("<br/><br/><h4>Select a person</h4>");
                    subcontainer.append("<p class="+name+">" + playerName + "</p>");
                    currentArray.push(playerName);
                }
                var truth = false;
                for(var j =0; j<currentArray.length; j++) {
                    if(playerName == currentArray[j]){
                        truth = true;
                    }
                }
                if(truth == false) {
                    currentArray.push(playerName);
                    subcontainer.append("<p class="+name+">" + playerName + "</p>");
                }
            }
        }
    }
    $('#hint').fadeOut();
}

//This function returns a string with the First Players First Name + Last Name + USATT ID
function getName(year, index, JSONdata) {
    return JSONdata[year][index]["FirstName"] + " " + JSONdata[year][index]["LastName"] + " (" + JSONdata[year][index]["USATT #"] + ")";
}

//This function returns a string with the Opponent Players First Name + Last Name + USATT ID
function getNameOpponent(year, index, JSONdata) {
    return JSONdata[year][index]["Opponent First Name"] + " " + JSONdata[year][index]["Opponent Last Name"] + " (" + JSONdata[year][index]["Opponent USATT #"] + ")";
}

//This function returns a string with the Opponent Players Match Statistics for a certain match.
function getGameStatsOpponent(year, index, JSONdata) {
    return "<strong>Opponent: </strong>" + JSONdata[year][index]["FirstName"] + " "+ JSONdata[year][index]["LastName"] + " (" + JSONdata[year][index]["USATT #"] + ")<br/><strong>Date:</strong> " + JSONdata[year][index]["Date"] + "<br/><strong>Game Scores: (L)</strong> " + JSONdata[year][index]["Match Score"]
    + "<br/><strong>Tournament: </strong>" + JSONdata[year][index]["Tournament Name"] + " (" + JSONdata[year][index]['Tournament ID'] + ")<br/><strong>Event: </strong>" + JSONdata[year][index]["Event"];
}

//This function returns a string with the First Players Match Statistics for a certain match.
function getGameStats(year, index, JSONdata) {
    return "<strong>Opponent: </strong>" + JSONdata[year][index]["Opponent First Name"] + " "+ JSONdata[year][index]["Opponent Last Name"] + " (" + JSONdata[year][index]["USATT #"] + ")<br/><strong>Date:</strong> " + JSONdata[year][index]["Date"] + "<br/><strong>Game Scores: (W)</strong> " + JSONdata[year][index]["Match Score"]
    + "<br/><strong>Tournament: </strong>" + JSONdata[year][index]["Tournament Name"] + " (" + JSONdata[year][index]['Tournament ID'] + ")<br/><strong>Event: </strong>" + JSONdata[year][index]["Event"];
}

//This function returns a string that shows the head to head data format.
function getHeadToHead(year, index, JSONdata) {
    return "<strong>" + JSONdata[year][index]["FirstName"] + " " + JSONdata[year][index]["LastName"] + "</strong> vs " + JSONdata[year][index]["Opponent First Name"] + " "+ JSONdata[year][index]["Opponent Last Name"] + "<br/><strong>Date:</strong> " + JSONdata[year][index]["Date"]
    + "<br/><strong>Game Scores: </strong> " + JSONdata[year][index]["Match Score"] + "<br/><strong>Tournament: </strong>" + JSONdata[year][index]["Tournament Name"] + " (" + JSONdata[year][index]['Tournament ID'] + ")<br/><strong>Event: </strong>" + JSONdata[year][index]["Event"];
}

//This function returns a string that shows the head to head data format for the opponent.
function getHeadToHeadOpponent(year, index, JSONdata) {
    return JSONdata[year][index]["Opponent First Name"] + " " + JSONdata[year][index]["Opponent Last Name"] + " vs <strong>" + JSONdata[year][index]["FirstName"] + " "+ JSONdata[year][index]["LastName"] + "</strong><br/><strong>Date:</strong> " + JSONdata[year][index]["Date"] + "<br/><strong>Game Scores: </strong> "
    + JSONdata[year][index]["Match Score"] + "<br/><strong>Tournament: </strong>" + JSONdata[year][index]["Tournament Name"] + " (" + JSONdata[year][index]['Tournament ID'] + ")<br/><strong>Event: </strong>" + JSONdata[year][index]["Event"];
}