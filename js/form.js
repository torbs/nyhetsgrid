(function($){
	$(document).ready(function () {

		/*******************************/
		/*  HTML5 Placeholder support  */
		/*******************************/

		var placeholderTest = document.createElement('input');
		if  (!('placeholder' in placeholderTest)) {
			$('input[placeholder]').each(function () {
				var $this = $(this);	
				var placeholder = $this.attr('placeholder');
				
				if ($this.val() == "") {
					$this.val(placeholder).css('color','#999');
				}
				
				$this.bind('focus', function () {
						if ($this.val() == placeholder) {
							$this.val("").css('color','#000');
						}
					})
					.bind('change', function () {
						var value = $this.val();
						if ((value == "") || (value == placeholder)) {
							$this.val(placeholder).css('color','#999');
						}
					});
					
			}); /* end each */
		} /* end if */

		/********************/
		/*  Select styling  */
		/********************/
		
		$('select').each(function (i) {
			var $this = $(this);
			var dropDown = $('<div class="pillBox selectDropDown"></div>');
			var input = $('<input type="text" value="'+$this.val()+'"/>').appendTo(dropDown);
			var btn  = $('<span class="button"><span class="selectIcon"></span></span>');
			
			dropDown.css({
					top:$this.position().top +'px',
					left:$this.position().left+'px',
					zIndex:1,
					width:$this.outerWidth() + 'px'
				})
				.append(btn)
				.insertBefore($this);
			$this.css({
					position:'relative',
					zIndex:2,
					opacity:0
				})
				.bind('change', function () {
					input.val($this.val());	
				})
		});

		/*****************************/
		/*  Input type=file styling  */
		/*****************************/

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
		
		/*******************/
		/* Sliding labels  */
		/*******************/
		
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
