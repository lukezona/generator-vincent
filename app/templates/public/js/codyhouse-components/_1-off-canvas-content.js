// File#: _1_off-canvas-content
// Usage: codyhouse.co/license
(function() {
	var OffCanvas = function(element) {
		this.element = element;
		this.wrapper = document.getElementsByClassName('js-off-canvas')[0];
		this.main = document.getElementsByClassName('off-canvas__main')[0];
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.closeBtn = this.element.getElementsByClassName('js-off-canvas__close-btn')[0];
		this.selectedTrigger = false;
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.animating = false;
		initOffCanvas(this);
	};	

	function initOffCanvas(panel) {
		panel.element.setAttribute('aria-hidden', 'true');
		for(var i = 0 ; i < panel.triggers.length; i++) { // lister to the click on off-canvas content triggers
			panel.triggers[i].addEventListener('click', function(event){
				panel.selectedTrigger = event.currentTarget;
				event.preventDefault();
				togglePanel(panel);
			});
		}
	};

	function togglePanel(panel) {
		var status = (panel.element.getAttribute('aria-hidden') == 'true') ? 'close' : 'open';
		if(status == 'close') openPanel(panel);
		else closePanel(panel);
	};

	function openPanel(panel) {
		if(panel.animating) return; // already animating
		panel.animating = true;
		panel.element.setAttribute('aria-hidden', 'false');
		Util.addClass(panel.wrapper, 'off-canvas--visible');
		getFocusableElements(panel);
		panel.closeBtn.addEventListener('transitionend', function cb(){
			panel.animating = false;
			Util.moveFocus(panel.element);
			panel.closeBtn.removeEventListener('transitionend', cb);
		});
		if(!transitionSupported) panel.animating = false;
		initPanelEvents(panel);
	};

	function closePanel(panel) {
		if(panel.animating) return;
		panel.animating = true;
		panel.element.setAttribute('aria-hidden', 'true');
		Util.removeClass(panel.wrapper, 'off-canvas--visible');
		panel.main.addEventListener('transitionend', function cb(){
			panel.animating = false;
			if(panel.selectedTrigger) panel.selectedTrigger.focus();
			setTimeout(function(){panel.selectedTrigger = false;}, 10);
			panel.main.removeEventListener('transitionend', cb);
		});
		if(!transitionSupported) panel.animating = false;
		cancelPanelEvents(panel);
	};

	function initPanelEvents(panel) { //add event listeners
		panel.element.addEventListener('keydown', handleEvent.bind(panel));
		panel.element.addEventListener('click', handleEvent.bind(panel));
	};

	function cancelPanelEvents(panel) { //remove event listeners
		panel.element.removeEventListener('keydown', handleEvent.bind(panel));
		panel.element.removeEventListener('click', handleEvent.bind(panel));
	};

	function handleEvent(event) {
		switch(event.type) {
			case 'keydown':
				initKeyDown(this, event);
				break;
			case 'click':
				initClick(this, event);
				break;
		}
	};

	function initClick(panel, event) { // close panel when clicking on close button
		if( !event.target.closest('.js-off-canvas__close-btn')) return;
		event.preventDefault();
		closePanel(panel);
	};

	function initKeyDown(panel, event) {
		if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
			//close off-canvas panel on esc
			closePanel(panel);
		} else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
			//trap focus inside panel
			trapFocus(panel, event);
		}
	};

	function trapFocus(panel, event) {
		if( panel.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of panel
			event.preventDefault();
			panel.lastFocusable.focus();
		}
		if( panel.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of panel
			event.preventDefault();
			panel.firstFocusable.focus();
		}
	};

	function getFocusableElements(panel) { //get all focusable elements inside the off-canvas content
		var allFocusable = panel.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
		getFirstVisible(panel, allFocusable);
		getLastVisible(panel, allFocusable);
	};

	function getFirstVisible(panel, elements) { //get first visible focusable element inside the off-canvas content
		for(var i = 0; i < elements.length; i++) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				panel.firstFocusable = elements[i];
				return true;
			}
		}
	};

	function getLastVisible(panel, elements) { //get last visible focusable element inside the off-canvas content
		for(var i = elements.length - 1; i >= 0; i--) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				panel.lastFocusable = elements[i];
				return true;
			}
		}
	};

	//initialize the OffCanvas objects
	var offCanvas = document.getElementsByClassName('js-off-canvas__panel'),
		transitionSupported = Util.cssSupports('transition');
	if( offCanvas.length > 0 ) {
		for( var i = 0; i < offCanvas.length; i++) {
			(function(i){new OffCanvas(offCanvas[i]);})(i);
		}
	}
}());