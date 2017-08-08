// Returns the 2 most relevant items from page 1
var req = new XMLHttpRequest();
req.open("GET", 'https://api.stackexchange.com/2.2/search/excerpts?page=1&pagesize=2&sort=relevance&q=javascript HTTP get request&site=stackoverflow');
req.responseType = 'json';
req.send();

req.onload = function() {
    var data = req.response;

    var articles = ""
    for (var step = 0; step < 1; step++) {
        articles = articles.concat(data['items'][step]['question_id'].toString(), ";");
    }
    articles = articles.concat(data['items'][1]['question_id'].toString(), "?");
    console.log(articles);

    var requestURL = 'https://api.stackexchange.com/2.2/questions/'.concat(articles, 'site=stackoverflow');
    console.log(requestURL);

    var articlereq = new XMLHttpRequest();
    articlereq.open("GET", requestURL);
    articlereq.responseType = 'json';
    articlereq.send();

    articlereq.onload = function() {
        var newdata = articlereq.response;
        console.log(newdata);
        test(newdata);
    }
}

function test(jsonOBJ){



    var myList = document.getElementById('test');

    for (var step = 0; step < 2; step++) {
        var listElem = document.createElement('li');
        listElem.textContent = jsonOBJ['items'][step]['title'];
        myList.appendChild(listElem);
    }
}