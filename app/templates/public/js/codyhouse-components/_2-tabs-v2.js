// File#: _2_tabs-v2
// Usage: codyhouse.co/license
(function() {
	var TabV2 = function(element) {
		this.element = element;
		this.tabList = this.element.getElementsByClassName('js-tabs-v2__controls')[0];
		this.listItems = this.tabList.getElementsByTagName('li');
		this.triggers = this.tabList.getElementsByTagName('a');
		this.panelsList = this.element.getElementsByClassName('js-tabs-v2__panels')[0];
		this.panels = Util.getChildrenByClassName(this.panelsList, 'js-tabs-v2__panel');
		this.showClass = 'tabs-v2__panel--selected';
		this.activeClass = 'tabs-nav-v2__item--selected';
		initTab(this);
	};

	function initTab(tab) {
		//set initial aria attributes
    tab.tabList.setAttribute('role', 'tablist');
    
		for( var i = 0; i < tab.triggers.length; i++) {
			var bool = (i == 0),
				panelId = tab.panels[i].getAttribute('id');
			tab.listItems[i].setAttribute('role', 'presentation');
			Util.setAttributes(tab.triggers[i], {'role': 'tab', 'aria-selected': bool, 'aria-controls': panelId, 'id': 'tab-'+panelId});
			Util.addClass(tab.triggers[i], 'js-tabs-v2__trigger'); 
			Util.setAttributes(tab.panels[i], {'role': 'tabpanel', 'aria-labelledby': 'tab-'+panelId});
      Util.toggleClass(tab.panels[i], tab.showClass, bool);

			if(!bool) tab.triggers[i].setAttribute('tabindex', '-1'); 
		}

		//listen for Tab events
		initTabEvents(tab);
	};

	function initTabEvents(tab) {
		var tab = tab;
		//click on a new tab -> select content
		tab.tabList.addEventListener('click', function(event) {
			if( event.target.closest('.js-tabs-v2__trigger') ) triggerTab(tab, event.target.closest('.js-tabs-v2__trigger'), event);
		});
		//arrow keys to navigate through tabs 
		tab.tabList.addEventListener('keydown', function(event) {
			if( !event.target.closest('.js-tabs-v2__trigger') ) return;
			if( event.keyCode && event.keyCode == 39 || event.key && event.key == 'ArrowRight' ) {
				selectNewTab(tab, 'next');
			} else if( event.keyCode && event.keyCode == 37 || event.key && event.key == 'ArrowLeft' ) {
				selectNewTab(tab, 'prev');
			}
		});
	};

	function selectNewTab(tab, direction) {
		var selectedTab = tab.tabList.getElementsByClassName(tab.activeClass)[0],
			index = Util.getIndexInArray(tab.triggers, selectedTab);
		index = (direction == 'next') ? index + 1 : index - 1;
		//make sure index is in the correct interval 
		//-> from last element go to first using the right arrow, from first element go to last using the left arrow
		if(index < 0) index = tab.listItems.length - 1;
		if(index >= tab.listItems.length) index = 0;	
		triggerTab(tab, tab.triggers[index]);
		tab.triggers[index].focus();
	};

	function triggerTab(tab, tabTrigger, event) {
		var self = tab;
		event && event.preventDefault();	
		var index = Util.getIndexInArray(tab.triggers, tabTrigger);
		//no need to do anything if tab was already selected
		if(Util.hasClass(tab.triggers[index], tab.activeClass)) return;
		
		for( var i = 0; i < tab.triggers.length; i++) {
			var bool = (i == index);
			Util.toggleClass(tab.triggers[i], tab.activeClass, bool);
			Util.toggleClass(tab.panels[i], tab.showClass, bool);
			tab.triggers[i].setAttribute('aria-selected', bool);
			bool ? tab.triggers[i].setAttribute('tabindex', '0') : tab.triggers[i].setAttribute('tabindex', '-1');
		}
	};
	
	//initialize the Tab objects
	var tabs = document.getElementsByClassName('js-tabs-v2');
	if( tabs.length > 0 ) {
		for( var i = 0; i < tabs.length; i++) {
			(function(i){new TabV2(tabs[i]);})(i);
		}
	}
}());