// File#: _1_table
// Usage: codyhouse.co/license
(function() {
	var Table = function(element) {
		this.element = element;
		this.innerTable = this.element.getElementsByClassName('js-table__inner')[0];
		this.tableHasStickyHeader = Util.hasClass(this.element, 'table--sticky-header');
		this.header = this.element.getElementsByClassName('js-table__header')[0];
		this.body = this.element.getElementsByClassName('js-table__body')[0];
		this.bodyShadow = this.element.getElementsByClassName('js-table__body-shadow')[0];
		this.scrollingIndicator = this.element.getElementsByClassName('js-table__scrolling-indicator')[0];
		this.scrolling = false;
		this.initTable();
	};

	Table.prototype.initTable = function() {
		var self = this;
		this.resetXScroll(true);
		this.tableHasStickyHeader && this.initStickyHeader();
		Util.removeClass(this.element, 'table--js-is-loading');
		this.initEvents();
	};

	Table.prototype.initEvents = function() {
		var self = this;
		//listen to the scroll of body table -> toggle table right gradient visibility
		this.innerTable.addEventListener('scroll', function(event){
			if(!self.scrolling) {
				self.scrolling = true;
				window.requestAnimationFrame(self.resetXScroll.bind(self, false));
			}
		});
		
		//listen to the click on the scrolling indicator icon
		this.scrollingIndicator.addEventListener('click', function(event){
			self.innerTable.scrollLeft = self.innerTable.scrollLeft + 250;
		});
	};

	Table.prototype.resetTable = function() {
		this.resetXScroll(true);
		this.tableHasStickyHeader && this.resetStickyHeader();
	};

	Table.prototype.resetXScroll = function(bool) {
		//check if you can scroll horizontally -> toggle table right gradient visibility
		(this.innerTable.offsetWidth < this.body.offsetWidth) ? Util.addClass(this.element, 'table--scrolling-x') : Util.removeClass(this.element, 'table--scrolling-x');
		(this.innerTable.offsetWidth + this.innerTable.scrollLeft < this.body.offsetWidth) ? Util.addClass(this.element, 'table--show-scrolling-indicator') : Util.removeClass(this.element, 'table--show-scrolling-indicator');
		(bool && Util.hasClass(this.element, 'table--show-scrolling-indicator') && this.innerTable.scrollLeft == 0 ) ? Util.removeClass(this.element, 'table--scrolling-x-started') : Util.addClass(this.element, 'table--scrolling-x-started');
		this.scrolling = false;
	};

	Table.prototype.initStickyHeader = function() {
		//if the table has a sticky header -> create header clone and insert it inside the table body
		this.headerClone = this.header.getElementsByTagName('tr')[0].cloneNode(true);
		Util.addClass(this.headerClone, 'table__row--is-hidden');
		this.headerClone.setAttribute('aria-hidden', true); //hide clone from assistive technology
		this.body.insertBefore(this.headerClone, this.body.firstChild);
		this.resetStickyHeader(); //reset table header width
	};

	Table.prototype.resetStickyHeader = function() {
		//reset width of elements in the table header
		var headerCloneChildren = this.headerClone.children,
			headerChildren = this.header.getElementsByTagName('tr')[0].children;
		for(var i = 0; i < headerCloneChildren.length; i++) {
			headerChildren[i].setAttribute('style', 'width:'+headerCloneChildren[i].offsetWidth+'px;');
		}
		//reset position of shadow element
		this.bodyShadow.setAttribute('style', 'height: '+ this.body.offsetHeight +'px; top: '+this.header.offsetHeight+'px;');
	};
	
	//initialize the Table objects
	var tables = document.getElementsByClassName('js-table');
	if( tables.length > 0 ) {
		var tablesArray = [];
		for( var i = 0; i < tables.length; i++) {
			(function(i){tablesArray.push(new Table(tables[i]));})(i);
		}
		
		var resizing = false;
		if(window.requestAnimationFrame) {
			//listen for the resize of the window -> toggle table right gradient visibility
			window.addEventListener('resize', function(event){
				if(!resizing) {
					resizing = true;
					window.requestAnimationFrame(resetTables);
				}
			});
		}

		function resetTables(){
			tablesArray.forEach(function(element){
				element.resetTable();
			});
			resizing = false;
		};
	};
}());