// Returns the 2 most relevant items from page 1
var req = new XMLHttpRequest();
req.open("GET", 'https://api.stackexchange.com/2.2/search/excerpts?page=1&pagesize=2&sort=relevance&q=javascript HTTP get request&site=stackoverflow');
req.responseType = 'json';
req.send();

req.onload = function() {
    var data = req.response;
    test(data);
}

function test(jsonOBJ){
    console.log(jsonOBJ['items'][0]['title']);
    console.log(jsonOBJ['items'][1]['title']);
}