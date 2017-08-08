var search = "";

function sendData() {
    event.preventDefault();

    var form = document.getElementById('soQuery');
    // Prepare request for stackoverflow
    var xhr = new XMLHttpRequest();
    var urlEncodedData = "";
    var urlEncodedDataPairs = [];

    // Add pagesize and search inputs from form to SO API parameters
    for (var i = 0; i < form.elements.length - 1; i++) {
        //alert(form.elements[i].name);
        urlEncodedDataPairs.push(encodeURIComponent(form.elements[i].name) + '=' + encodeURIComponent(form.elements[i].value));
    }

    // Save search query
    search = form.elements[0].value;

    // Prepare URL for search query 
    var baseURL = 'https://api.stackexchange.com/2.2/search/excerpts?page=1&sort=relevance&site=stackoverflow&';
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    urlEncodedData = baseURL.concat(urlEncodedData);

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
        questions = questions.concat(data['items'][data['items'].length - 1]['question_id'].toString(), "?");

        // 
        retrievePosts(questions);
    }

}

function retrievePosts(data) {

    // URL for requesting questions from Stackexchange
    var requestURL = 'https://api.stackexchange.com/2.2/questions/'.concat(data, 'site=stackoverflow');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', requestURL);
    xhr.responseType = 'json';
    xhr.send(null);

    xhr.onload = function() {
        var posts = xhr.response;
        modifyHTML(posts);
    }
}

function modifyHTML(jsonOBJ){
    var resultsDIV = document.getElementById('results');

    while (resultsDIV.firstChild) {
        resultsDIV.removeChild(resultsDIV.firstChild);
    }

    // Create header indicating results
    var results = document.createElement('h3');
    results.textContent = "Results:"
    resultsDIV.appendChild(results);

    // Initialize unordered list
    var resultsLIST = document.createElement('ul');
    resultsDIV.appendChild(resultsLIST);

    for (var i = 0; i < jsonOBJ['items'].length; i++) {
        var listElem = document.createElement('li');

        var elemTag = document.createElement('a');
        elemTag.setAttribute('href', jsonOBJ['items'][i]['link']);
        elemTag.setAttribute('target', "_blank");
        elemTag.innerHTML = jsonOBJ['items'][i]['title'] + " [" + jsonOBJ['items'][i]['score'] + "]";

        listElem.appendChild(elemTag);
        resultsLIST.appendChild(listElem);
    }

    var searchURL = 'https://stackoverflow.com/search?q='
    search = search.replace(/%20/g, '+');
    searchURL = searchURL.concat(search);

    var searchQuery = document.createElement('p');
    var searchATag = document.createElement('a');
    searchATag.setAttribute('href', searchURL);
    searchATag.setAttribute('target', "_blank");
    searchATag.innerHTML = "Stackoverflow Link";
    searchQuery.appendChild(searchATag);
    resultsDIV.appendChild(searchQuery);

}

window.addEventListener('load', function(evt) {
    document.getElementById('soQuery').addEventListener('submit', sendData);
});