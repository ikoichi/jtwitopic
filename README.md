jTwiTopic
=========

[jTwiTopic](http://www.jtwitopic.com) - An easy jQuery Plugin showing Tweets

####1. Include necessary JS files

Load jQuery and the jTwitopic library on your server.

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
	<script type="text/javascript" src="jtwitopic.js"></script>

####2. Add jTwitopic CSS file

Add the jTwitopic style sheet or create your custom.

	<link rel="stylesheet" href="jtwitopic.css" type="text/css" media="screen">

####3. Fire plugin

Syntax is:

	jTwiTopic.request(keyWord,[options]);

where `keyWord` is the word to query (i.e. **#followfriday**, **@username**, **username** etc.)

Available options are (from the Twitter Search API ):

* `container` (required): the HTML element ID where append the widget
* `width` Optional: width of the widget in pixels (i.e. '300px')
* `tweetsNumber`: Optional, default is 3. The number of tweet to be displayed at the same time
* `lang`: Optional: Restricts tweets to the given language, given by an ISO 639-1 code.
* `since`: Optional: Returns tweets with since the given date. Date should be formatted as YYYY-MM-DD.
* `geocode`: Optional: Returns tweets by users located within a given radius of the given latitude/longitude. The location is preferentially taking from the Geotagging API, but will fall back to their Twitter profile. The parameter value is specified by "latitide,longitude,radius", where radius units must be specified as either "mi" (miles) or "km" (kilometers). Note that you cannot use the near operator via the API to geocode arbitrary locations; however you can use this geocode parameter to search near geocodes directly.
* `until`: Optional: Returns tweets with generated before the given date. Date should be formatted as YYYY-MM-DD

Example.
Code:

	/* 
		This shows the last tweets grouped by 2 elements, 
  		containing the hashtags #ff and #followfriday and 
  		puts the widget into the HTML element with id='tweets' 
  	*/
  
	$(document).ready(function() {
					
		jTwiTopic.request("#ff #followfriday",{
			container: 'tweets',
			width: '700px',
			tweetsNumber: '2',
			lang: 'en'
		});
					
	});
	
	
#### Preview
Have a look at the [demo page](http://www.jtwitopic.com/service/)