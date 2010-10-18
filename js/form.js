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
	});
})(window.jQuery);
