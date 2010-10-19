(function($){
	$(document).ready(function () {
		$('.fileInput').each(function (){
			var el = $('<div class="pillBox"><input type="text" name="fake" /><span class="button">Bla gjennom</span></div>')
				.css({position:'absolute',zIndex:1,top:0,left:0});
			
			var $this = $(this);
			
			$this.find('input[type=file]')
				.css({opacity:0,position:'relative',zIndex:2})
				.data('fake', el)
				.bind('change mouseout', function () {
					$(this).data('fake').find('input').val($(this).val());
				});
			
			$this.append(el);
			
		});
		$('.rightAlignedLabels input').each(function () {
			var input = $(this);
			var label = $('label[for='+input.attr('id')+']');
			
			if (input.val() == "" && !input.attr('placeholder')) {
				label.css({
					opacity:.5,
					left:(input.position().left + 6) + 'px',
					textAlign:'left',
					width:'auto'
				})
				.data('active',false);
			} else {
				label.data('active',true);
			}
			
			//label.bind('click', activeLabel);
			input.bind('focus', labelSlideOut);
			label.bind('click', function (e) {
				labelSlideOut();
				return false;
			});
						
			function labelSlideOut() {
				if (!label.data('active')) { 
					input.unbind('focus')
						.bind('blur', labelSlideBack)
						.focus();

					label.animate({
						left:(label.position().left - label.width() - 11 )+'px',
						opacity:1,
						},250, function () {
							label.data('active',true);
						});
				}
			}

			function labelSlideBack() {
				if ((label.data('active')) && (input.val() == "")) { 
					input.bind('focus', labelSlideOut)
						.unbind('blur')
						.blur();
					label.animate({
						left:(input.position().left + 6)+'px',
						opacity:.5
						},250, function () {
							label.data('active',false);
						});
				}
			}

		});
	});
})(window.jQuery);
