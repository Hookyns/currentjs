var currentjs;
(function (currentjs) {
    /**
     * Create Nodes from given HTML. Given attributes will be added to all top-level Elements.
     * @param {string} html
     * @param {{}} [attrs]
     * @returns {NodeList}
     */
    function create(html, attrs) {
        var elements = document.createElement("div");
        elements.innerHTML = html;
        elements.childNodes.forEach((function (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                for (var attr in attrs) {
                    if (attrs.hasOwnProperty(attr)) {
                        node.setAttribute(attr, attrs[attr]);
                    }
                }
            }
        }));
        return elements.childNodes;
    }
    currentjs.create = create;
})(currentjs || (currentjs = {}));
var currentjs;
(function (currentjs) {
    var event;
    (function (event_1) {
        /**
         * Store flag, was document already loaded?
         * @type {boolean}
         */
        var domReady = false;
        /**
         * List of dom ready lsteners
         * @type {Array<Function>}
         */
        var domReadyListeners = [];
        // Main internal DOM ready event listener
        document.addEventListener("DOMContentLoaded", function (event) {
            domReady = true;
            for (var _i = 0, domReadyListeners_1 = domReadyListeners; _i < domReadyListeners_1.length; _i++) {
                var listener = domReadyListeners_1[_i];
                listener.call(this, event);
            }
        });
        /**
         * Storing registered events
         * @type {Map}
         */
        var eventListeners = new Map();
        /**
         * Get listeners array from local event map
         * @param {Node} node
         * @param {string} eventName
         * @returns {Array<CurrentJSEventData>}
         */
        function getListeners(node, eventName) {
            var nodeEvents = eventListeners.get(node);
            if (nodeEvents === undefined) {
                nodeEvents = {};
                eventListeners.set(node, nodeEvents);
            }
            var listeners = nodeEvents[eventName];
            if (listeners === undefined) {
                listeners = [];
                nodeEvents[eventName] = listeners;
            }
            return listeners;
        }
        /**
         * Add event into local info Map
         * @param {Node} node
         * @param {string} eventName
         * @param {CurrentJSEventData} data
         */
        function registerEvent(node, eventName, data) {
            getListeners(node, eventName).push(data);
        }
        /**
         * Remove event from local info Map
         * @param {Node} node
         * @param {string} eventName
         * @param {(event: Event) => void} listener
         */
        function unregisterEvent(node, eventName, listener) {
            var listeners = getListeners(node, eventName);
            var item;
            var itemIndex = listeners.length;
            for (; itemIndex >= 0; itemIndex--) {
                item = listeners[itemIndex];
                if (item.listener === listener)
                    break;
            }
            if (item) {
                listeners.splice(itemIndex, 1);
            }
        }
        /**
         * DEV submodule
         */
        var dev;
        (function (dev) {
            /**
             * Get all registered events via .on()
             * @description Returned iterator is not clone so you can manipulate it but it is not recommended.
             * @returns {IterableIterator}
             */
            function getAll() {
                if (eventListeners.entries) {
                    return eventListeners.entries();
                }
                // IE 11 does not support .entries
                return [];
            }
            dev.getAll = getAll;
            /**
             *
             * @description Returned object is not clone so you can manipulate it but it is not recommended.
             * @param {Node} node
             * @returns {{}}
             */
            function getAllFrom(node) {
                return eventListeners.get(node);
            }
            dev.getAllFrom = getAllFrom;
        })(dev = event_1.dev || (event_1.dev = {}));
        /**
         * Register event listener
         * @param {string} eventName
         * @param handlerOrFilter
         * @param {(event: Event) => void} listener
         * @returns {Node}
         */
        Node.prototype.on = function (eventName, handlerOrFilter, listener) {
            var callback, filter = undefined;
            if (typeof (listener) === "function") { // so filter was specified
                filter = handlerOrFilter;
                callback = function (event) {
                    if (event.target.matches(filter)) {
                        listener.call(this, event);
                    }
                };
            }
            else {
                callback = handlerOrFilter;
                listener = callback;
            }
            // Store in Map
            registerEvent(this, eventName, {
                name: listener.name,
                listener: listener,
                filterSelector: filter
            });
            // Register event
            this.addEventListener(eventName, callback);
            return this;
        };
        /**
         * Register event listener on all nodes from NodeList
         * @param {string} eventName
         * @param handlerOrFilter
         * @param {(event: Event) => void} listener
         * @returns {Node}
         */
        NodeList.prototype.on = function (eventName, handlerOrFilter, listener) {
            this.forEach(function (node) { return node.on(eventName, handlerOrFilter, listener); });
            return this;
        };
        /**
         *
         * @param {string} eventName
         * @param {(event: Event) => void} listener
         * @returns {Node}
         */
        Node.prototype.off = function (eventName, listener) {
            this.removeEventListener(this, listener);
            unregisterEvent(this, eventName, listener);
            return this;
        };
        /**
         * Unregister event listener from all nodes from NodeList
         * @param {string} eventName
         * @param {(event: Event) => void} listener
         * @returns {Node}
         */
        NodeList.prototype.off = function (eventName, listener) {
            this.forEach(function (node) { return node.off(eventName, listener); });
            return this;
        };
        /**
         * Trigger event manually
         * @desc Note: dispatch has no NodeList version, because dispatch run synchronously so if you invoke click event over big
         * list of items which have a lot of events, you can block page for a while in extreme case. No NodeList version exists
         * just to highlight this behavior.
         * @param {string} eventName
         * @param {boolean} bubbles
         * @param {boolean} cancelale
         * @returns {Node}
         */
        Node.prototype.dispatch = function (eventName, bubbles, cancelale) {
            if (bubbles === void 0) { bubbles = true; }
            if (cancelale === void 0) { cancelale = true; }
            var event = document.createEvent("Event");
            if (event.initEvent) // If init event still supported; cuz of IE Event constructor cannot be used
             {
                event.initEvent(eventName, bubbles, cancelale);
            }
            else {
                event = new Event(eventName, {
                    bubbles: bubbles,
                    cancelable: cancelale
                });
            }
            this.dispatchEvent(event);
            return this;
        };
        /**
         * On document ready event
         * @param {(event: Event) => void} listener
         * @returns {Document}
         */
        Document.prototype.ready = function (listener) {
            if (domReady)
                listener(null);
            return this;
        };
    })(event = currentjs.event || (currentjs.event = {}));
})(currentjs || (currentjs = {}));
var currentjs;
(function (currentjs) {
    var node;
    (function (node) {
        // Empty NodeList; returned instead of null
        var _emptyNodeList = document.createDocumentFragment().childNodes;
        /**
         * Convert Node to NodeList
         * @returns {NodeList}
         */
        Node.prototype.asNodeList = function () {
            return document.createDocumentFragment().appendChild(this).childNodes;
        };
        /**
         * Find Nodes by query selector
         * @param {string | Node | NodeList} selector
         * @returns {NodeList}
         */
        Node.prototype.find = function (selector) {
            if (selector) {
                if (selector.constructor === NodeList) {
                    return selector;
                }
                if (selector.constructor === Node) {
                    return selector.asNodeList();
                }
                return this.querySelectorAll(selector);
            }
            return _emptyNodeList;
        };
    })(node = currentjs.node || (currentjs.node = {}));
})(currentjs || (currentjs = {}));
if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s), i, el = this;
        do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el)
                ;
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
    arr.forEach(function (item) {
        if (!item.before) {
            Object.defineProperty(item, "before", {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function before() {
                    var argArr = Array.prototype.slice.call(arguments), docFrag = document.createDocumentFragment();
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
                    var argArr = Array.prototype.slice.call(arguments), docFrag = document.createDocumentFragment();
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
                    if (!parent)
                        return;
                    if (!i) // if there are no arguments
                        parent.removeChild(this);
                    while (i--) { // i-- decrements i and returns the value of i before the decrement
                        currentNode = arguments[i];
                        if (typeof currentNode !== "object") {
                            currentNode = this.ownerDocument.createTextNode(currentNode);
                        }
                        else if (currentNode.parentNode) {
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
                    var argArr = Array.prototype.slice.call(arguments), docFrag = document.createDocumentFragment();
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
//# sourceMappingURL=currentjs.js.map