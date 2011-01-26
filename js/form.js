/****************************************************************/
/* Form.js                                                      */
/* Author: Tor Brekke Skj�tskift                                */
/*                                                              */
/* Styles OS elements not directly available to CSS             */
/* Emulates basic html5 capabilities for non-compliant browsers */
/****************************************************************/

(function($) {
    $(document).ready(function () {

        /*******************************/
        /*  HTML5 Placeholder support  */
        /*******************************/

        var inputTest = document.createElement('input');
        if (!('placeholder' in inputTest)) {
            $('input[placeholder]').each(function () {
                var $this = $(this);
                var placeholder = $this.attr('placeholder');

                if ($this.val() == "") {
                    $this.val(placeholder).css('color', '#999');
                }

                $this.bind('focus', function () {
                    if ($this.val() == placeholder) {
                        $this.val("").css('color', '#000');
                    }
                })
                        .bind('change blur', function () {
                    var value = $this.val();
                    if ((value == "") || (value == placeholder)) {
                        $this.val(placeholder).css('color', '#999');
                    }
                });

            });
            /* end each */
        }
        /* end if */

        $('input[type="date"]').datepicker({
            showOn: 'button',
            buttonImage: SITEURL + 'skins/global/gfx/icons/calendar.png',
            buttonImageOnly: true
        });


        /**************************/
        /* HTML5 required support */
        /**************************/

        if (!('required' in inputTest)) {
            $('input[required], textarea[required]').each(function () {
                var $this = $(this);

                $this.parents('form:first').bind('submit', function (e) {
                    if ($this.val() === "") {
                        markError($this);
                        $('<p style="color#900;font-size:10px">Feltet kan ikke v&aelig;re tomt</p>').insertAfter($this);
                        e.preventDefault();
                    }
                });
            });
        }

        /***********************/
        /* HTML5 Email support */
        /***********************/
        inputTest.setAttribute('type', 'email');
        if (inputTest.type !== 'email') {
            $('input[type="email"]').each(function () {
                var $this = $(this);
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                $this.parents('form:first').bind('submit', function (e) {
                    if (!reg.test($this.val())) {
                        markError($this);
                        $('<p style="color#900;font-size:10px">Ugyldig epostadresse</p>').insertAfter($this);
                        e.preventDefault();
                    }
                });
            });
        }

        function markError(el) {
            el.parents('form:first').addClass('error');
            el.css({
                backgroundColor:'#Fcc'
            });
        }

        /****************************/
        /* HTML5 maxlength support  */
        /****************************/
        if (!('maxlength' in inputTest)) {
            $('input[maxlength], textarea[maxlength]').each(function () {
                var $this = $(this),
                        el = $('<p class="formCharCounter"></p>').insertAfter($this);
                $this.keyup(function() {
                    var max = $this.attr('maxlength'),
                            text = $this.val(),
                            len = text.length;

                    if (len > max) {
                        $this.val(text.substr(0, max));
                        el.html('Du har <strong>0</strong> tegn igjen');
                        return false;
                    } else {
                        el.html('Du har <strong>' + (max - len) + '</strong> tegn igjen');
                        return true;
                    }
                });
            })
        }

        /********************/
        /*  Select styling  */
        /********************/
        $('select').each(function (i) {
            var $this = $(this);
            var dropDown = $('<div class="pillBox selectDropDown"></div>');
            var input = $('<input type="text" value="' + $this.val() + '" style="width:100%" />').appendTo(dropDown);
            var btn = $('<span class="button"><span class="selectIcon"></span></span>');

            dropDown.css({
                top:$this.position().top + 'px',
                left:$this.position().left + 'px',
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
                input.val($this.find('option[value=' + $this.val() + ']').html());
            })
        });

        /*****************************/
        /*  Input type=file styling  */
        /*****************************/

        $('.fileInput').each(function () {
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

        $('.rightAlignedLabels input, .rightAlignedLabels textarea').each(function () {
            var input = $(this);
            var label = $('label[for=' + input.attr('id') + ']');


            if (input.val() == "" && !input.attr('placeholder')) {
                label.css({
                    opacity:.5,
                    left:(input.position().left + 6) + 'px',
                    textAlign:'left',
                    width:'auto'
                })
                        .data('active', false);
            } else {
                label.data('active', true);
            }

            //label.bind('click', activeLabel);
            if (label.length !== 0) {
                input.bind('focus', labelSlideOut);
                label.bind('click', function (e) {
                    labelSlideOut();
                    return false;
                });
            }
            function labelSlideOut() {
                if (!label.data('active')) {
                    input.unbind('focus')
                            .bind('blur', labelSlideBack)
                            .focus();

                    label.animate({
                        left:(label.position().left - label.width() - 11 ) + 'px',
                        opacity:1
                    }, 250, function () {
                        label.data('active', true);
                    });
                }
            }

            function labelSlideBack() {
                if ((label.data('active')) && (input.val() == "")) {
                    input.bind('focus', labelSlideOut)
                            .unbind('blur')
                            .blur();
                    label.animate({
                        left:(input.position().left + 6) + 'px',
                        opacity:.5
                    }, 250, function () {
                        label.data('active', false);
                    });
                }
            }

        });
    });
})(window.jQuery);
