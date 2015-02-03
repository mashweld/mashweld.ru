!function ($) {

	"use strict";

	var customSelect = $('.form select');

	if (!window.atob) {
		window.atob = function(str) {
			return Base64.decode(str);
		}
	}

	if (customSelect.length > 0) {
		customSelect.select2({
			width: 'resolve'
		});
	}

	/*$.ajax({
		dataType: "json",
		url: 'https://api.github.com/repos/GManzato/jsdebutant/contents/jquery/exemple.json',
		success: function(data) {
			var obj = jQuery.parseJSON( atob(data.content) );
			for(var key in obj) {
				$('#holder').append(obj[key]['first_name'] + ' ' + obj[key]['last_name']+'<br/>')
			}
		}
	});*/


}(window.jQuery);
