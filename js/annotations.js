"use strict";

var pop;

Popcorn(function() {

	$("#annotations").find("a")
		.attr("target","_blank")
		.attr("onclick","linkClick(event);");

	pop = Popcorn.vimeo(
		'#video',
		page.vimeoURL
	);

	parseAnnotations();

	$("#showAnnotations").click( function() {

		$("#annotationsbox").slideToggle('slow', function() {
			if ($(this).is(":visible")) {
				 $("#showAnnotations").text('Hide Annotations');                
			} else {
				 $("#showAnnotations").text('View All Annotations');              
			} 				
		});
	})

	//pop.play();

});

function parseAnnotations() {

	$('#annotations').children().each(function(index,value) {

		// Parse start and end times

		var startTime, endTime;

		if ($(this).is("[data-start]"))
				startTime = Popcorn.util.toSeconds( $(this).attr('data-start'));
			else
				return -1;

		if ($(this).is("[data-end]"))
				endTime = Popcorn.util.toSeconds( $(this).attr('data-end'));
			else
				endTime = null;

		if ( !$.isNumeric(startTime)) return -1;

		if  ( !$.isNumeric(endTime)) endTime = startTime + 10;

		// Cue the footnote in Popcorn

		pop.footnote({
			start: startTime,
			end: endTime,
			text: $(this).html(),
			target: "footnotes",
			//effect: 'applyclass',
			//applyclass: 'show'				
		});

		// Add a direct link to the spot in the video

		var videoLink = $("<div>")
			.html($(this).attr('data-start'))
			.attr('href','#')
			.attr('data-start', startTime)
			.addClass('videoLink')
			.click( function() {

				var cueTime = $(this).attr('data-start');
				pop.currentTime(cueTime);

			});

		$(this).before(videoLink);

	});

}

function linkClick(e) {

	var anchor = $(e.target);

	if (anchor.attr('data-displaycode') == "true") {

		e.preventDefault();
		displayCode(anchor.attr('href'));
	}

	pop.pause();

}

function displayCode(url) {
	
	$.ajax({
		url:url, 
		accepts: {
			json: "application/vnd.github.VERSION.raw"
		},
		success:function (data) {
			var decodedContents = (atob(data.content.replace(/\n/g, "")));
			$("#code").text(decodedContents);

			$("#code").html( prettyPrintOne( $("#code").html() ) );
			$("#codebox").slideToggle();
			
		}
	});

}