(function ($) {

  var lastId = 1;

	var instances = {};

	var privateMethods = {
		create:function (instance) {
			selector = "touchKeyboard" + lastId;
			instance.addClass(selector);
			instance.attr("data-touch-keyboard-id", lastId);
			this.getDimensions(selector);
			this.createContainer(selector);
			this.createButtons(selector);
			this.createFunctionButtons(selector);
			lastId = lastId + 1;
			return selector;
		},
		getDimensions: function(selector) {
			obj = $("." + selector);
			offset = obj.offset();
			settings = $.fn.touchKeyboard.defaults;
			instances[selector] = {
				offset: obj.offset(),
				dimensions: {
					width: obj.width(),
					height: obj.height()
				},
				padding: {
					top: obj.css("padding-top"),
					right: obj.css("padding-right"),
					bottom: obj.css("padding-bottom"),
					left: obj.css("padding-left")
				},
				keyboard: {
					width: settings.width,
					height: settings.height,
					left: (obj.offset().left + (obj.width() / 2) - (settings.width / 2)),
					top: (obj.offset().top + obj.height() + parseInt(obj.css("padding-top")) + parseInt(obj.css("padding-bottom")) + 5)
				},
				status: {
					capslock: false,
					shift: false
				}
			};
		},
		createContainer: function(selector) {
			item = instances[selector];
			$($.fn.touchKeyboard.defaults.appendTo).append("<div class='touchKeyboards' id='touchKeyboard" + lastId + "' style='position: absolute; border: 1px solid black; background-color: white;'></div>");
			container = $(".touchKeyboards");
			obj = $("#" + selector);

			obj.css("width", item.keyboard.width);
			obj.css("height", item.keyboard.height);
			obj.css("left", item.offset.left - (item.dimensions.width / 2));
			obj.css("top", item.offset.top + item.dimensions.height + parseInt(item.padding.top) + parseInt(item.padding.bottom) + 5);
			obj.hide();
		},
		createButtons: function(selector) {
			obj = $("#" + selector);
			buttons = $.fn.touchKeyboard.buttons;

			for (var i = 0; i < buttons.length; i++) {
				item = buttons[i];
				buttonId = selector + '_' + item.left + '_' + item.top + '_' + item.width + '_' + item.height;
				obj.append('<a class="touchKeyboardButton btn" href="' + item.text + '" id="'+ buttonId + '">' + item.text + '</div></a>');
				obj.append('<a class="touchKeyboardButtonShifted btn" href="' + item.shift + '" id="shift_'+ buttonId + '">' + item.shift + '</div></a>');
				this.addButton(item, buttonId, selector, false);
				this.addButton(item, buttonId, selector, true);
			}
		},
		addButton: function(item, buttonId, selector, shift) {
			that = this;
			if(shift == true) {
				buttonId = "shift_" + buttonId;
				console.log(buttonId);
			}
			button = $('#'+ buttonId);
			button.css("position", "absolute");
			button.css("top", item.top+"px");
			button.css("left", item.left+"px");
			button.css("width", item.width+"px");
			button.css("height", item.height+"px");
			button.css("padding", 0);
			button.css("line-height", item.height+"px");
			if(shift == true) {
				button.hide();
			}
			button.click(function(e) {
				$(this).addClass("btn-success");
				setTimeout(function() {
					$('.touchKeyboardButton').removeClass("btn-success");
					$('.touchKeyboardButtonShifted').removeClass("btn-success");
				}, 100);
				that.writeCharacter(selector, $(this).attr("href"));
				e.preventDefault();
			});
		},
		createFunctionButtons: function(selector) {
			obj = $("#" + selector);
			buttons = $.fn.touchKeyboard.functionButtons;
			that = this;

			for (var i = 0; i < buttons.length; i++) {
				item = buttons[i];
				buttonId = selector+'_' + item.left + '_' + item.top + '_' + item.width + '_' + item.height;
				obj.append('<a class="touchKeyboardFunctionButton btn" href="' + item.text + '" id="'+ buttonId + '">' + item.text + '</div></a>');
				button = $('#'+ buttonId);
				button.css("position", "absolute");
				button.css("top", item.top+"px");
				button.css("left", item.left+"px");
				button.css("width", item.width+"px");
				button.css("height", item.height+"px");
				button.css("padding", 0);
				button.css("line-height", item.height+"px");
				button.addClass("touchKeyboard" + item.type);

				(function(item, button) {
					button.click(function(e){
						e.preventDefault();
						if(item.type == "shift") {
							privateMethods.functionButtons.shift(selector);
						} else if (item.type == "caps") {
							privateMethods.functionButtons.caps(selector);
						} else if (item.type == "backspace") {
							privateMethods.functionButtons.backspace(selector);
						}
					});
				}(item, button));

			}

		},
		writeCharacter: function(selector, character) {
			object = $("."+selector);
			object.val( object.val() + character );
			if(instances[selector].status.shift == true) {
				privateMethods.functionButtons.shiftButton.turnOff(selector)
			}
		},
		removeCharacter: function(selector) {
			object = $("."+selector);
			object.val( object.val().substr(0, object.val().length-1) );
		},
		functionButtons: {
			shiftButton: {
				toggle: function(selector) {
					if(instances[selector].status.shift == false) {
						this.turnOn(selector);
					} else {
						this.turnOff(selector);
					}
				},
				turnOn: function(selector) {
					instances[selector].status.shift = true;
					$("#" + selector + " .touchKeyboardshift").addClass("btn-primary");
					$("#" + selector + " .touchKeyboardButton").hide();
					$("#" + selector + " .touchKeyboardButtonShifted").show();
				},
				turnOff: function(selector) {
					instances[selector].status.shift = false;
					$("#" + selector + " .touchKeyboardshift").removeClass("btn-primary");
					$("#" + selector + " .touchKeyboardButtonShifted").hide();
					$("#" + selector + " .touchKeyboardButton").show();
				}
			},
			capslockButton: {
				toggle: function(selector) {
					if(instances[selector].status.capslock == false) {
						this.turnOn(selector);
					} else {
						this.turnOff(selector);
					}
				},
				turnOn: function(selector) {
					instances[selector].status.capslock = true;
					$("#" + selector + " .touchKeyboardcaps").addClass("btn-primary");
					$("#" + selector + " .touchKeyboardButton").hide();
					$("#" + selector + " .touchKeyboardButtonShifted").show();
				},
				turnOff: function(selector) {
					instances[selector].status.capslock = false;
					$("#" + selector + " .touchKeyboardcaps").removeClass("btn-primary");
					$("#" + selector + " .touchKeyboardButtonShifted").hide();
					$("#" + selector + " .touchKeyboardButton").show();
				}
			},
			shift: function(selector) {
				this.shiftButton.toggle(selector);
			},
			caps: function(selector) {
				this.capslockButton.toggle(selector);
			},
			backspace: function(selector) {
				privateMethods.removeCharacter(selector);
			}
		}
	};

	var methods = {

		init:function (o) {
			o = $.extend({}, $.fn.touchKeyboard.defaults, o);
			that = $(this);

			$(this).each(function () {
				selector = privateMethods.create($(this));
				methods.show(selector);
				methods.hide(selector);
			});
		},

		show:function (selector) {
			$("."+selector).click(function(e) {
				e.stopPropagation();
			});
			$("."+selector).focusin(function(e) {
				$(".touchKeyboards").hide();
				obj = $("#touchKeyboard" + $(this).attr("data-touch-keyboard-id"));
				obj.show();
			});
		},

		hide:function (selector) {
			var input = $("." + selector);
			$("body").click(function(e) {
				visibleId = $(".touchKeyboards:visible").attr("id");
				$("#"+visibleId).hide();
			});
			$("#"+selector).click(function(e) {
				input.focus();
				e.stopPropagation();
			});
		}

	};
	$.fn.touchKeyboard = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method == 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist in touchKeyboard');
		}
	}
	$.fn.touchKeyboard.defaults = {
		appendTo: 'body',
		width: 570,
		height: 220
	};
	$.fn.touchKeyboard.buttons = [
		{ width: 30,	height: 30,		top: 10,		left: 50,		text: '+',		shift: '1' },
		{ width: 30,	height: 30,		top: 10,		left: 90,		text: 'ě',		shift: '2' },
		{ width: 30,	height: 30,		top: 10,		left: 130,		text: 'š',		shift: '3' },
		{ width: 30,	height: 30,		top: 10,		left: 170,		text: 'č',		shift: '4' },
		{ width: 30,	height: 30,		top: 10,		left: 210,		text: 'ř',		shift: '5' },
		{ width: 30,	height: 30,		top: 10,		left: 250,		text: 'ž',		shift: '6' },
		{ width: 30,	height: 30,		top: 10,		left: 290,		text: 'ý',		shift: '7' },
		{ width: 30,	height: 30,		top: 10,		left: 330,		text: 'á',		shift: '8' },
		{ width: 30,	height: 30,		top: 10,		left: 370,		text: 'í',		shift: '9' },
		{ width: 30,	height: 30,		top: 10,		left: 410,		text: 'é',		shift: '0' },


		{ width: 30,	height: 30,		top: 50,		left: 65,		text: 'q',		shift: 'Q' },
		{ width: 30,	height: 30,		top: 50,		left: 105,		text: 'w',		shift: 'W' },
		{ width: 30,	height: 30,		top: 50,		left: 145,		text: 'e',		shift: 'E' },
		{ width: 30,	height: 30,		top: 50,		left: 185,		text: 'r',		shift: 'R' },
		{ width: 30,	height: 30,		top: 50,		left: 225,		text: 't',		shift: 'T' },
		{ width: 30,	height: 30,		top: 50,		left: 265,		text: 'z',		shift: 'Z' },
		{ width: 30,	height: 30,		top: 50,		left: 305,		text: 'u',		shift: 'U' },
		{ width: 30,	height: 30,		top: 50,		left: 345,		text: 'i',		shift: 'I' },
		{ width: 30,	height: 30,		top: 50,		left: 385,		text: 'o',		shift: 'O' },
		{ width: 30,	height: 30,		top: 50,		left: 425,		text: 'p',		shift: 'P' },
		{ width: 30,	height: 30,		top: 50,		left: 465,		text: 'ú',		shift: '/' },
		{ width: 30,	height: 30,		top: 50,		left: 505,		text: ')',		shift: '(' },


		{ width: 30,	height: 30,		top: 90,		left: 80,		text: 'a',		shift: 'A' },
		{ width: 30,	height: 30,		top: 90,		left: 120,		text: 's',		shift: 'S' },
		{ width: 30,	height: 30,		top: 90,		left: 160,		text: 'd',		shift: 'D' },
		{ width: 30,	height: 30,		top: 90,		left: 200,		text: 'f',		shift: 'F' },
		{ width: 30,	height: 30,		top: 90,		left: 240,		text: 'g',		shift: 'G' },
		{ width: 30,	height: 30,		top: 90,		left: 280,		text: 'h',		shift: 'H' },
		{ width: 30,	height: 30,		top: 90,		left: 320,		text: 'j',		shift: 'J' },
		{ width: 30,	height: 30,		top: 90,		left: 360,		text: 'k',		shift: 'K' },
		{ width: 30,	height: 30,		top: 90,		left: 400,		text: 'l',		shift: 'L' },
		{ width: 30,	height: 30,		top: 90,		left: 440,		text: 'ů',		shift: 'Ů' },
		{ width: 30,	height: 30,		top: 90,		left: 480,		text: '§',		shift: '!' },

		{ width: 30,	height: 30,		top: 130,		left: 55,		text: '\\',		shift: '|' },
		{ width: 30,	height: 30,		top: 130,		left: 95,		text: 'y',		shift: 'Y' },
		{ width: 30,	height: 30,		top: 130,		left: 135,		text: 'x',		shift: 'X' },
		{ width: 30,	height: 30,		top: 130,		left: 175,		text: 'c',		shift: 'C' },
		{ width: 30,	height: 30,		top: 130,		left: 215,		text: 'v',		shift: 'V' },
		{ width: 30,	height: 30,		top: 130,		left: 255,		text: 'b',		shift: 'B' },
		{ width: 30,	height: 30,		top: 130,		left: 295,		text: 'n',		shift: 'N' },
		{ width: 30,	height: 30,		top: 130,		left: 335,		text: 'm',		shift: 'M' },
		{ width: 30,	height: 30,		top: 130,		left: 375,		text: ',',		shift: '?' },
		{ width: 30,	height: 30,		top: 130,		left: 415,		text: '.',		shift: ':' },
		{ width: 30,	height: 30,		top: 130,		left: 455,		text: '-',		shift: '_' },

		{ width: 190,	height: 30,		top: 170,		left: 175,		text: ' ',		shift: ' ' }
	];
	$.fn.touchKeyboard.functionButtons = [
		{ width: 35,	height: 30,		top: 130,		left: 10,		type: 'shift',		text: 'Shift' },
		{ width: 65,	height: 30,		top: 130,		left: 495,		type: 'shift',		text: 'Shift' },
		{ width: 70,	height: 30,		top: 10,		left: 450,		type: 'backspace',	text: 'Backspace' },
		{ width: 60,	height: 30,		top: 90,		left: 10,		type: 'caps',		text: 'Caps' }
	];

})(jQuery);
