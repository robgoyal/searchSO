function sendData(form) {
    alert("Hello");
    // Prepare request for stackoverflow
    var xhr = new XMLHttpRequest();
    var urlEncodedData = "";
    var urlEncodedDataPairs = [];

    // Add pagesize and search inputs from form to SO API parameters
    for (var i = 0; i < form.elements.length - 1; i++) {
        //alert(form.elements[i].name);
        urlEncodedDataPairs.push(encodeURIComponent(form.elements[i].name) + '=' + encodeURIComponent(form.elements[i].value));
    }

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
    var requestURL = 'https://api.stackexchange.com/2.2/questions/'.concat(data, 'site=stackoverflow');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', requestURL);
    xhr.responseType = 'json';
    xhr.send(null);

    xhr.onload = function() {
        var posts = xhr.response;
        modifyHTML(posts);
    }
    alert(requestURL);
}

function modifyHTML(jsonOBJ){
    var myList = document.getElementById('test');

    while (myList.firstChild) {
        myList.removeChild(myList.firstChild);
    }

    for (var i = 0; i < jsonOBJ['items'].length; i++) {
        var listElem = document.createElement('li');
        listElem.textContent = jsonOBJ['items'][i]['title'];
        myList.appendChild(listElem);
    }
}