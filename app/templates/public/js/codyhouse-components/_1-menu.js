// File#: _1_menu
// Usage: codyhouse.co/license
(function() {
	var Menu = function(element) {
		this.element = element;
		this.menu = this.element.getElementsByClassName('js-menu')[0];
		this.menuItems = this.menu.getElementsByClassName('js-menu__item');
		this.trigger = this.element.getElementsByClassName('js-menu-trigger')[0]; 
		this.initMenu();
		this.initMenuEvents();
	};	

	Menu.prototype.initMenu = function() {
		// init aria-labels
		Util.setAttributes(this.trigger, {'aria-expanded': 'false', 'aria-haspopup': 'true', 'aria-controls': this.menu.getAttribute('id')});
	};

	Menu.prototype.initMenuEvents = function() {
		var self = this;
		this.trigger.addEventListener('click', function(event){
			event.preventDefault();
			self.toggleMenu(!Util.hasClass(self.menu, 'menu--is-visible'), true);
		});
		// keyboard events
		this.element.addEventListener('keydown', function(event) {
			// use up/down arrow to navigate list of menu items
			if( !Util.hasClass(event.target, 'js-menu__item') ) return;
			if( (event.keyCode && event.keyCode == 40) || (event.key && event.key.toLowerCase() == 'arrowdown') ) {
				self.navigateItems(event, 'next');
			} else if( (event.keyCode && event.keyCode == 38) || (event.key && event.key.toLowerCase() == 'arrowup') ) {
				self.navigateItems(event, 'prev');
			}
		});
	};

	Menu.prototype.toggleMenu = function(bool, moveFocus) {
		var self = this;
		// toggle menu visibility
		Util.toggleClass(this.menu, 'menu--is-visible', bool);
		if(bool) {
			this.trigger.setAttribute('aria-expanded', 'true');
			Util.moveFocus(this.menuItems[0]);
			this.menu.addEventListener("transitionend", function(event) {Util.moveFocus(self.menuItems[0]);}, {once: true});
		} else {
			this.trigger.setAttribute('aria-expanded', 'false');
			if(moveFocus) Util.moveFocus(this.trigger);
		}
	};

	Menu.prototype.navigateItems = function(event, direction) {
		event.preventDefault();
		var index = Util.getIndexInArray(this.menuItems, event.target),
			nextIndex = direction == 'next' ? index + 1 : index - 1;
		if(nextIndex < 0) nextIndex = this.menuItems.length - 1;
		if(nextIndex > this.menuItems.length - 1) nextIndex = 0;
		Util.moveFocus(this.menuItems[nextIndex]);
	};

	Menu.prototype.checkMenuFocus = function() {
		var menuParent = document.activeElement.closest('.js-menu');
		if (!menuParent || !this.element.contains(menuParent)) this.toggleMenu(false, false);
	};

	Menu.prototype.checkMenuClick = function(target) {
		if( !this.element.contains(target) ) this.toggleMenu(false);
	};

	//initialize the Menu objects
	var menus = document.getElementsByClassName('js-menu-wrapper');
	if( menus.length > 0 ) {
		var menusArray = [];
		for( var i = 0; i < menus.length; i++) {
			(function(i){menusArray.push(new Menu(menus[i]));})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 9 || event.key && event.key.toLowerCase() == 'tab' ) {
				//close menu if focus is outside menu element
				menusArray.forEach(function(element){
					element.checkMenuFocus();
				});
			} else if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
				// close menu on 'Esc'
				menusArray.forEach(function(element){
					element.toggleMenu(false, false);
				});
			} 
		});
		// close menu when clicking outside it
		window.addEventListener('click', function(event){
			menusArray.forEach(function(element){
				element.checkMenuClick(event.target);
			});
		});
	}
}());