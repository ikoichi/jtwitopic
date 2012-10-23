/*
 * jTwiTopic
 * Show the tweet flux for a specific topic
 *
 * Examples and documentation at: http://jwww.jtwitopic.com/
 * 
 * Copyright (c) 2010 Luca Restagno
 *
 * Version: 1.0 (13/09/2010)
 * Requires: jQuery v1.4
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

var jTwiTopic = {
	verticalTweetNumber: 3,
	width: '600px',
	slideShowTime: 10000, //milliseconds
	refreshTime: 120000, //milliseconds
	slideShowOpacity: 1,
	/* DO NOT MODIFY FROM HERE */
	topic: null,
	options: null,
	container: null,
	shownElement: 0,
	numElements: 0,
	results: null,
	slideShowInterval: 0,
	orientation: 'horizontal'
};

jTwiTopic.request = function( topic, options ){

	if(!topic){
		document.write('jTwiTopic: specify a topic');
		return;
	}
	if(!options.container){
		document.write('jTwiTopic: specify a container (i.e. a div element)');
		return;
	}

	(options.container) ? jTwiTopic.container = options.container : jTwiTopic.container = null;
	(options.width) ? jTwiTopic.width = options.width : jTwiTopic.width = jTwiTopic.width;
	(options.rpp) ? rpp = options.rpp : rpp = '25';
	(options.result_type) ? result_type = options.result_type : result_type = '';
	(options.lang) ? lang = options.lang : lang = 'all';
	(options.tweetsNumber) ? jTwiTopic.verticalTweetNumber = options.tweetsNumber : jTwiTopic.verticalTweetNumber = 1;
	(options.since) ? since = options.since : since = '';
	(options.geocode) ? geocode = options.geocode : geocode = '';
	(options.until) ? until = options.until : until = '';
	
	jTwiTopic.topic = topic;
	jTwiTopic.options = options;
	
	$('#'+jTwiTopic.container).css({
		'-moz-border-radius-bottomleft': '5px',
		'-moz-border-radius-bottomright': '5px',
		'border-radius-bottomleft': '5px',
		'border-radius-bottomright': '5px',
		'-webkit-border-bottom-left-radius': '5px',
		'-webkit-border-bottom-right-radius': '5px'
	})
	
	var url = 'http://search.twitter.com/search.json?q='+encodeURIComponent(topic)+'&callback=jTwiTopic.gogogo&result_type='+result_type+'&rpp='+rpp+'&lang='+lang+'&since='+since+'&geocode='+geocode+'&until='+until;
	$('head').append( $('<script>').attr({'src':url}) );

};

jTwiTopic.refresh = function(){
	jTwiTopic.request( jTwiTopic.topic,  jTwiTopic.options);
	jTwiTopic.shownElement = 0;
};

jTwiTopic.gogogo = function(data){
	if(jTwiTopic.results !== data){
		jTwiTopic.results = data;
		
		var d = $('#'+jTwiTopic.container)
						.addClass('jtt-container')
						.css({
							'opacity': jTwiTopic.slideShowOpacity,
							'width': jTwiTopic.width
						})
						.text('');
		
		var ul = $('<ul>')
						.addClass('jtt-ul');
		
		 d.unbind()
		  .hover(function(){
					$('.jtt-up').fadeIn();
					clearInterval( jTwiTopic.slideShowInterval );
				},
				function(){
					$('.jtt-up').fadeOut();
					clearInterval( jTwiTopic.slideShowInterval );
					jTwiTopic.slideShowInterval = setInterval("jTwiTopic.showNext()",jTwiTopic.slideShowTime);
				}
			)
		
		
		if(data.error){
			/* Query error */
			d.css({ 'height':'60px'});
			ul.append(
				$('<li>')
				.addClass('jtt-li')
				.css({ 'margin' :'0px', 'color':'black'})
				.text("Error: " + data.error)
			);
			d.append( ul );
			jTwiTopic.appendHeader();
			clearInterval( jTwiTopic.slideShowInterval );
			return;
		}
		else if(!data.results){
			/* No results */
			d.css({ 'height':'60px'});
			ul.append(
				$('<li>')
				.addClass('jtt-li')
				.css({ 'margin' :'0px', 'color':'black'})
				.text("No results for topic: "+jTwiTopic.topic)
			);
			d.append( ul );
			jTwiTopic.appendHeader();
			clearInterval( jTwiTopic.slideShowInterval );
			return;
		}
		for( var i=0; i<data.results.length; i++){
			ul.append( 
				$('<li>')
				.attr({ 'id': 'element'+i })
				.addClass('jtt-li')
				.css({
					'padding-top': '5px',
					'padding-bottom': '5px',
					'padding-left': '5px'
				})
				.append( 
						$('<a>')
						.attr({
								'href': 'http://www.twitter.com/'+data.results[i].from_user, 
								'title':data.results[i].from_user,
								'target':'_blank'
						})
						.addClass('jtt-img')
						.css( {'background': 'url('+data.results[i].profile_image_url+')'} ) 
				)
				.append( $('<div>').addClass('jtt-user').text( data.results[i].from_user ) )
				.append( 
						$('<div>')
						.addClass('jtt-text')
						.html( replaceText( data.results[i].text) ) 
						.append( 
								$('<span>')
								.addClass('jtt-date')
								.html(
									"<a href='http://www.twitter.com/"+data.results[i].from_user+"/status/"+data.results[i].id+"' target='_blank'>" +
									prettyDate( data.results[i].created_at ) +
									"</a>" + 
									" via " + 
									$("<div/>").html(data.results[i].source).text() + 
									" :: <a title='Reply to "+data.results[i].from_user+"' href='http://twitter.com/?status=@"+data.results[i].from_user+"&in_reply_to_status_id="+data.results[i].id+"&in_reply_to="+data.results[i].from_user+"' target='_blank'>Reply</a>"
								) 
						)
				)
				
			)
		}
		
		jTwiTopic.numElements = data.results.length;
		
		d.append( ul );
		
		var liHeight = jTwiTopic.getMaxLiHeight();
		d.css({ 'height': (liHeight * jTwiTopic.verticalTweetNumber )+( 10 * jTwiTopic.verticalTweetNumber ) });
		$( ".jtt-li" ).each(function(i, el){
			$(el).css({ 'height': liHeight });
		});
		
		jTwiTopic.appendHeader();
		
		d.append( 
				$('<div>')
				.addClass('jtt-up')
				.text('Up')
				.css({ 'top': $('.jtt-header').offset().top+$('.jtt-header').outerHeight(), 'width':ul.width()-5 })
				.click(function(){
					jTwiTopic.showNext();
				})
		);
		d.append( 
				$('<div>')
				.addClass('jtt-up')
				.text('Down')
				.css({ 
					'top': $('.jtt-header').offset().top+$('#'+jTwiTopic.container).outerHeight()+17,
					'width':ul.width()-5
					//'left':($(document).width()/2)-(d.width()/2)
				}) 
				.click(function(){
					jTwiTopic.showPrev();
				})
		);
		
		//d.css({ 'margin-left': ($(document).width()/2)-(d.width()/2) });
		//$('.jtt-header').css({ 'margin-left': ($(document).width()/2)-(d.width()/2) });
		if(navigator.userAgent.indexOf('Opera') !== -1){
			$('.jtt-li').css('background-color','#EBF2F5');
			$('.jtt-header').css('background-color','#1F5F8F');
		}
		// slide show interval
		clearInterval( jTwiTopic.slideShowInterval );
		jTwiTopic.slideShowInterval = setInterval("jTwiTopic.showNext()",jTwiTopic.slideShowTime);
		clearInterval( jTwiTopic.refreshInterval );
		jTwiTopic.refreshInterval = setInterval("jTwiTopic.refresh()",jTwiTopic.refreshTime);
		
	}
	
};

jTwiTopic.appendHeader = function(){
	if($('.jtt-header').size() == 0){
		var d = $('#'+jTwiTopic.container)
			$('<div>')
			.addClass('jtt-header')
			.css({
				'margin-left': '0px',
				'padding': '10px',
				'position': 'relative'
			})
			.append( $('<span>').css('text-align','left').text('jTwiTopic: '+jTwiTopic.topic) )
			.css({ 'width' : $('.jtt-ul').outerWidth()-20, 'margin-top': $(d).css('margin-top') })
			.insertBefore( $(d) );
			$(d).css('margin-top','0px');
		}
}

jTwiTopic.showNext = function(){
	
	if(jTwiTopic.shownElement == (jTwiTopic.numElements-1) ){
		
		$('.jtt-li').animate({
			opacity: 0
		}, 500, function() {
							// Animation complete.
							$( $('.jtt-ul').get(0) ).animate({
								marginTop: '0'
							}, 0, function() {
								// Animation complete.
								$('.jtt-li').animate({
									opacity: 1
								}, 500, function(){});
							});
		});

		jTwiTopic.shownElement=0;
	}
	else{
		jTwiTopic.shownElement++;
		$( $('.jtt-ul').get(0) ).animate({
			marginTop: '-='+(jTwiTopic.getMaxLiHeight()+11)
		}, 500, function() {
			// Animation complete.
		});
	}
};

jTwiTopic.showPrev = function(){
	
	if(jTwiTopic.shownElement == 0 ){
		
		$('.jtt-li').animate({
			opacity: 0
		}, 500, function() {
							// Animation complete.
							$( $('.jtt-ul').get(0) ).animate({
								marginTop: "-"+((jTwiTopic.numElements-1)*(jTwiTopic.getMaxLiHeight()+10))+"px"
							}, 0, function() {
								// Animation complete.
								$('.jtt-li').animate({
									opacity: 1
								}, 500, function(){});
							});
		});

		jTwiTopic.shownElement=(jTwiTopic.numElements-1);
	}
	else{
		jTwiTopic.shownElement--;
		$( $('.jtt-ul').get(0) ).animate({
			marginTop: '+='+(jTwiTopic.getMaxLiHeight()+10)
		}, 500, function() {
			// Animation complete.
		});
	}
};


jTwiTopic.getMaxLiHeight = function(){
	var height = 0;
	$( ".jtt-li" ).each(function(i, el){
		if( $(el).height() > height){
			height = $(el).height();
		}
	});
	
	return height;
};


function replaceText(text) {
	/* puts a link for text: http://...  */
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  var txt = text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
  
  
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  var txt = text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
  
  /* puts a link for text: @username  */
  var matc = txt.match(/@\w*/ig);
  if(matc){
  	for(var i=0; i<matc.length; i++){
  		txt = txt.replace(matc[i] , "<a href='http://www.twitter.com/"+matc[i].toString().replace('@','')+"' target='_blank'>"+matc[i]+"</a>");
  	}
  }
  /* puts a link for text: #text  */
  var matc = txt.match(/#\w*/ig);
  if(matc){
  	for(var i=0; i<matc.length; i++){
  		txt = txt.replace(matc[i] , "<a href='http://twitter.com/search?q=%23"+matc[i].toString().replace('#','')+"' target='_blank'>"+matc[i]+"</a>");
  	}
  }
  
  return txt;
  
  /*var re = new RegExp(jTwiTopic.topic,"gi");
  var mat = txt.match(re);

  return txt.replace(re, "<span class='jtt-query'>"+mat+"</span>");*/
};

	
	
	
/*
 * JavaScript Pretty Date
 * Copyright (c) 2008 John Resig (jquery.com)
 * Licensed under the MIT license.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
	/*var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);*/
		
		var date = new Date((time || "")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 ){
		return '';
	}
			
	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}

// If jQuery is included in the page, adds a jQuery plugin to handle it as well
if ( typeof jQuery != "undefined" )
	jQuery.fn.prettyDate = function(){
		return this.each(function(){
			var date = prettyDate(this.title);
			if ( date )
				jQuery(this).text( date );
		});
	};