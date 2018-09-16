module currentjs.event
{
	declare interface CurrentJSEventData
	{
		name: string;
		listener: (event: Event) => void;
		filterSelector: string;
	}

	/**
	 * Store flag, was document already loaded?
	 * @type {boolean}
	 */
	let domReady = false;

	/**
	 * List of dom ready lsteners
	 * @type {Array<Function>}
	 */
	let domReadyListeners = [];

	// Main internal DOM ready event listener
	document.addEventListener("DOMContentLoaded", function(event) {
		domReady = true;
		for (let listener of domReadyListeners) {
			listener.call(this, event);
		}
	});

	/**
	 * Storing registered events
	 * @type {Map}
	 */
	const eventListeners: Map<Node, { [eventName: string]: Array<CurrentJSEventData> }> = new Map();

	/**
	 * Get listeners array from local event map
	 * @param {Node} node
	 * @param {string} eventName
	 * @returns {Array<CurrentJSEventData>}
	 */
	function getListeners(node: Node, eventName: string): Array<CurrentJSEventData>
	{
		let nodeEvents = eventListeners.get(node);

		if (nodeEvents === undefined)
		{
			nodeEvents = {};
			eventListeners.set(node, nodeEvents);
		}

		let listeners = nodeEvents[eventName];

		if (listeners === undefined)
		{
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
	function registerEvent(node: Node, eventName: string, data: CurrentJSEventData)
	{
		getListeners(node, eventName).push(data);
	}

	/**
	 * Remove event from local info Map
	 * @param {Node} node
	 * @param {string} eventName
	 * @param {(event: Event) => void} listener
	 */
	function unregisterEvent(node: Node, eventName: string, listener: (event: Event) => void)
	{
		let listeners = getListeners(node, eventName);
		let item: CurrentJSEventData;
		let itemIndex = listeners.length;

		for (; itemIndex >= 0; itemIndex--)
		{
			item = listeners[itemIndex];
			if (item.listener === listener) break;
		}

		if (item)
		{
			listeners.splice(itemIndex, 1);
		}
	}

	/**
	 * DEV submodule
	 */
	export module dev
	{
		/**
		 * Get all registered events via .on()
		 * @description Returned iterator is not clone so you can manipulate it but it is not recommended.
		 * @returns {IterableIterator}
		 */
		export function getAll(): IterableIterator<[Node, { [eventName: string]: Array<CurrentJSEventData> }]>
		{
			if (eventListeners.entries)
			{
				return eventListeners.entries();
			}

			// IE 11 does not support .entries
			return [] as any;
		}

		/**
		 *
		 * @description Returned object is not clone so you can manipulate it but it is not recommended.
		 * @param {Node} node
		 * @returns {{}}
		 */
		export function getAllFrom(node: Node): { [eventName: string]: Array<CurrentJSEventData> }
		{
			return eventListeners.get(node);
		}
	}

	/**
	 * Register event listener
	 * @param {string} eventName
	 * @param handlerOrFilter
	 * @param {(event: Event) => void} listener
	 * @returns {Node}
	 */
	Node.prototype.on = function (eventName: string, handlerOrFilter, listener?: (event: Event) => void): Node {
		let callback, filter = undefined;

		if (typeof(listener) === "function")
		{ // so filter was specified
			filter = handlerOrFilter;

			callback = function (event: Event) {
				if ((event.target as Element).matches(filter))
				{
					listener.call(this, event);
				}
			}
		}
		else
		{
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
	NodeList.prototype.on = function (eventName: string, handlerOrFilter, listener?: (event: Event) => void): NodeList {
		this.forEach(node => node.on(eventName, handlerOrFilter, listener));
		return this;
	};

	/**
	 *
	 * @param {string} eventName
	 * @param {(event: Event) => void} listener
	 * @returns {Node}
	 */
	Node.prototype.off = function (eventName: string, listener: (event: Event) => void): Node {
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
	NodeList.prototype.off = function (eventName: string, listener: (event: Event) => void): NodeList {
		this.forEach(node => node.off(eventName, listener));
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
	Node.prototype.dispatch = function (eventName: string, bubbles: boolean = true, cancelale: boolean = true): Node {
		let event: Event = document.createEvent("Event");

		if (event.initEvent) // If init event still supported; cuz of IE Event constructor cannot be used
		{
			event.initEvent(eventName, bubbles, cancelale);
		} else {
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
	Document.prototype.ready = function(listener: (event: Event) => void): Document {
		if (domReady) listener(null);
		return this;
	}
}