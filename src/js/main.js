!function ($) {

	"use strict";

	var customSelect = $('.form select');

	if (customSelect.length > 0) {
		customSelect.select2({
			width: 'resolve'
		});
	}


}(window.jQuery);
