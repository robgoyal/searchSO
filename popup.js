/* Name: popup.js
   Author: Robin Goyal
   Last-Modified: August 9, 2017
   Purpose: Use stackoverflow to display search results in
            Chrome extension
*/

// String to hold extension query
var search = "";

function sendData() {
    /* Retrieve the question ID's based off of the search query
       from the form input */

    // Prevents default form submission
    event.preventDefault();

    // Retrieve form submission results
    var form = document.getElementById('querySO');

    // Prepare request for stackoverflow
    var xhr = new XMLHttpRequest();
    var urlEncodedData = "";
    var urlEncodedDataPairs = [];

    // Add pagesize and search inputs from form to SO API parameters
    for (var i = 0; i < form.elements.length - 1; i++) {
        urlEncodedDataPairs.push(encodeURIComponent(form.elements[i].name) + '=' + encodeURIComponent(form.elements[i].value));
    }

    // Save search
    search = form.elements[0].value;

    // Prepare URL for search
    var queryURL = 'https://api.stackexchange.com/2.2/search/excerpts?page=1&sort=relevance&site=stackoverflow&';
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    urlEncodedData = queryURL.concat(urlEncodedData);

    // Send request to receieve article ID's
    xhr.open('GET', urlEncodedData);
    xhr.responseType = 'json';
    xhr.send(null);

    xhr.onload = function() {
        var data = xhr.response;

        // Prepare question ID's for next request
        var questions = "";
        for (var i = 0; i < data['items'].length - 1; i++) {
            questions = questions.concat(data['items'][i]['question_id'].toString(), ";");
        }

        // Append ? for the last element in the items array 
        questions = questions.concat(data['items'][data['items'].length - 1]['question_id'].toString(), "?");

        retrieveLinks(questions);
    }
}

function retrieveLinks(data) {
    /* Retrieve the posts from the question ID's and pass the
       returned JSON object to the modifyHTML function */

    // URL for requesting questions from Stackexchange
    var questionsURL = 'https://api.stackexchange.com/2.2/questions/'.concat(data, 'site=stackoverflow');

    // Prepare request to retrieve links
    var xhr = new XMLHttpRequest();
    xhr.open('GET', questionsURL);
    xhr.responseType = 'json';
    xhr.send(null);

    xhr.onload = function() {
        var posts = xhr.response;
        displayResults(posts);
    }
}

function displayResults(jsonOBJ){
    /* Modify DOM to display results for the search */

    var resultsDIV = document.getElementById('results');

    // Remove all children of div to display new results for each search
    while (resultsDIV.firstChild) {
        resultsDIV.removeChild(resultsDIV.firstChild);
    }

    // Create header indicating results
    var results = document.createElement('h3');
    results.textContent = "Results:"

    // Add header to div
    resultsDIV.appendChild(results);

    // Initialize unordered list and add to div
    var resultsLIST = document.createElement('ul');
    resultsDIV.appendChild(resultsLIST);

    for (var i = 0; i < jsonOBJ['items'].length; i++) {
        // Create list element for unordered list
        var listElem = document.createElement('li');

        // Prepare anchor tag for title and link to SO result
        var elemTag = document.createElement('a');
        elemTag.setAttribute('href', jsonOBJ['items'][i]['link']);
        elemTag.setAttribute('target', "_blank");
        elemTag.innerHTML = jsonOBJ['items'][i]['title'] + " [" + jsonOBJ['items'][i]['score'] + "]";

        // Append elements to parent node
        listElem.appendChild(elemTag);
        resultsLIST.appendChild(listElem);
    }

    // URL for link to stackoverflow search page from query
    var searchURL = 'https://stackoverflow.com/search?q='
    search = search.replace(/%20/g, '+');
    searchURL = searchURL.concat(search);

    // Create paragraph and anchor tag
    var searchP = document.createElement('p');
    var searchATag = document.createElement('a');

    // Prepare anchor tag for link to SO search results page
    searchATag.setAttribute('href', searchURL);
    searchATag.setAttribute('target', "_blank");
    searchATag.innerHTML = "Stackoverflow Results Page";

    // Add to parent nodes
    searchP.appendChild(searchATag);
    resultsDIV.appendChild(searchP);

}

// Listen for form submission and call sendData function upon submit
window.addEventListener('load', function(evt) {
    document.getElementById('querySO').addEventListener('submit', sendData);
});