if (!Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		var matches = (this.document || this.ownerDocument).querySelectorAll(s), i, el = this;
		do {
			i = matches.length;
			while (--i >= 0 && matches.item(i) !== el) ;
		} while ((i < 0) && (el = el.parentElement));

		return el;
	};
}

if (!NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}

// from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode
(function (arr) {
	arr.forEach(function (item: any) {
		if (!item.before) {
			Object.defineProperty(item, "before", {
				configurable: true,
				enumerable: true,
				writable: true,
				value: function before() {
					var argArr = Array.prototype.slice.call(arguments),
						docFrag = document.createDocumentFragment();

					argArr.forEach(function (argItem) {
						var isNode = argItem instanceof Node;
						docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
					});

					this.parentNode.insertBefore(docFrag, this);
				}
			});
		}

		if (!item.after) {
			Object.defineProperty(item, "after", {
				configurable: true,
				enumerable: true,
				writable: true,
				value: function after() {
					var argArr = Array.prototype.slice.call(arguments),
						docFrag = document.createDocumentFragment();

					argArr.forEach(function (argItem) {
						var isNode = argItem instanceof Node;
						docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
					});

					this.parentNode.insertBefore(docFrag, this.nextSibling);
				}
			});
		}

		if (!item.remove) {
			Object.defineProperty(item, "remove", {
				configurable: true,
				enumerable: true,
				writable: true,
				value: function remove() {
					if (this.parentNode !== null)
						this.parentNode.removeChild(this);
				}
			});
		}

		if (!item.relaceWith) {
			Object.defineProperty(item, "replaceWith", {
				configurable: true,
				enumerable: true,
				writable: true,
				value: function remove() {
					"use-strict"; // For safari, and IE > 10
					var parent = this.parentNode, i = arguments.length, currentNode;
					if (!parent) return;
					if (!i) // if there are no arguments
						parent.removeChild(this);
					while (i--) { // i-- decrements i and returns the value of i before the decrement
						currentNode = arguments[i];
						if (typeof currentNode !== "object") {
							currentNode = this.ownerDocument.createTextNode(currentNode);
						} else if (currentNode.parentNode) {
							currentNode.parentNode.removeChild(currentNode);
						}
						// the value of "i" below is after the decrement
						if (!i) // if currentNode is the first argument (currentNode === arguments[0])
							parent.replaceChild(currentNode, this);
						else // if currentNode isn't the first
							parent.insertBefore(this.previousSibling, currentNode);
					}
				}
			});
		}

		if (!item.prepend) {
			Object.defineProperty(item, "prepend", {
				configurable: true,
				enumerable: true,
				writable: true,
				value: function prepend() {
					var argArr = Array.prototype.slice.call(arguments),
						docFrag = document.createDocumentFragment();

					argArr.forEach(function (argItem) {
						var isNode = argItem instanceof Node;
						docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
					});

					this.insertBefore(docFrag, this.firstChild);
				}
			});
		}
	});
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);