var STREETVIEW_API_KEY="AIzaSyDO_9zojyjphv2OV8MZgypJmqb1jgiBEjg";
var NYTIMES_API_KEY = "612ab9d3887e4e72b43548ad198e75b1";
var STREETVIEW_API = "https://maps.googleapis.com/maps/api/streetview?size=800x500"  
 + "&heading=151.78&pitch=-0.76&key=" + STREETVIEW_API_KEY
 + "&location=";

 var SAMPLE_API = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=46.414382,10.013988&heading=151.78&pitch=-0.76&key=AIzaSyDO_9zojyjphv2OV8MZgypJmqb1jgiBEjg";

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var street = $("#street").val();
    var city = $("#city").val();
    console.log("Street : " + street + " City : " + city);
    var streetViewApi = STREETVIEW_API + street + "," + city;
    // $body.css({'background-image': 'url(' + api + ')',
    //             "background-size": "100%"});

    $body.append('<img class="bgimg" src="'+ streetViewApi + '">');

    //Nytimes api
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
          'api-key': "612ab9d3887e4e72b43548ad198e75b1",
          'q': street,
          'sort': "newest",
          'hl': "true"
        });
    $.ajax({
          dataType: "json",  
          url: url,
          method: 'GET',
        }).done(function(result) {
            var articles = result.response.docs;
            $nytHeaderElem.text("Newyork Times articles about " + street);
            for(var i=0;i<articles.length;i++){
                var article = articles[i];
                $nytElem.append('<li class="article"> <a href="'  
                    + article.web_url +'">'
                    + article.headline.main + '</a>'
                    + '<p>'+article.snippet +'</p>' 
                    + '</li>');
            }
        }).fail(function(err) {
          $nytHeaderElem.text("Newyork Times Articles Could Not Be Loaded");
        });

        //Wikipedia

        
        var wikiRequestTimeout = setTimeout(function(){
            $wikiElem.text("Failed to get wikipedia resources");
        }, 8000);
 
        $.ajax({
            type: "GET",
            url: "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallback&search=" 
                + street,  // + " " + city,
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            success: function (data, textStatus, jqXHR) {
                var wikiTitle = data[1];
                var wikis = data[3];
                for(var i=0;i<wikis.length;i++){
                    $wikiElem.append('<li class="article"> <a href="'
                        + wikis[i] + '">'
                        + wikiTitle[i] + '</a>'
                        + '</li>')
                    console.log(wikis[i])
                }
                clearTimeout(wikiRequestTimeout);
                console.log(data);
            },
            error: function (errorMessage) {
            }
        });

        return false;
    };

$('#form-container').submit(loadData);
