function test(jsonOBJ) {
    alert("HELLO");
    var myList = document.getElementById('test');

    while (myList.firstChild) {
        myList.removeChild(myList.firstChild);
    }

    myList.textContent = "Results:"
    var listElem = document.createElement('li');
    listElem.textContent = jsonOBJ['items'][0]['title'];
    myList.appendChild(listElem);
}

function sendData(data) {
    var xhr = new XMLHttpRequest();
    var urlEncodedData = "";
    var urlEncodedDataPairs = [];
    var name;

    //alert(data.elements[0].value);

   // urlEncodedDataPairs.push(encodeURIComponent(data.elements[0].name) + '=' + encodeURIComponent(data.elements[0].value));

    for (var i = 0; i < data.elements.length - 1; i++) {
        urlEncodedDataPairs.push(encodeURIComponent(data.elements[i].name) + '=' + encodeURIComponent(data.elements[i].value));
    }

    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    var base_url = 'https://api.stackexchange.com/2.2/search/excerpts?page=1&sort=relevance&site=stackoverflow&';

    urlEncodedData = base_url.concat(urlEncodedData);
    alert(urlEncodedData);

    //xhr.open('GET', 'https://api.stackexchange.com/2.2/search/excerpts?page=1&pagesize=2&sort=relevance&q=javascript HTTP get request&site=stackoverflow');
    xhr.open('GET', urlEncodedData);
    xhr.responseType = 'json';
    xhr.send(null);

    xhr.onload = function() {
        var data = xhr.response;
        //alert(data['items'][0]['title']);
        test(data);
    }
}