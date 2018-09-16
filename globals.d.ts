interface Node
{
	/**
	 * Register event listener
	 * @param {string} eventName
	 * @param listenerOrFilterSelector Event listener or filtering selector
	 * @param {(event: Event) => void} [listener]
	 * @returns {Node}
	 */
	on(eventName: string, listenerOrFilterSelector, listener?: (event: Event) => void): Node;

	/**
	 * Unregister event listener
	 * @param {string} eventName
	 * @param {(event: Event) => void} listener
	 * @returns {Node}
	 */
	off(eventName: string, listener?: (event: Event) => void): Node;

	/**
	 * Trigger event manually
	 * @param {string} eventName
	 * @param {boolean} bubbles
	 * @param {boolean} cancelale
	 * @returns {Node}
	 */
	dispatch(eventName: string, bubbles?: boolean, cancelale?: boolean): Node;

	/**
	 * Convert Node to NodeList
	 * @returns {NodeList}
	 */
	asNodeList(): NodeList;

	/**
	 * Find Nodes by query selector
	 * @param {string | Node | NodeList} selector
	 * @returns {NodeList}
	 */
	find(selector: string | Node | NodeList): NodeList;
}

interface NodeList {
	/**
	 * Register event listener on all nodes from NodeList
	 * @param {string} eventName
	 * @param handlerOrFilter
	 * @param {(event: Event) => void} listener
	 * @returns {NodeList}
	 */
	on(eventName: string, handlerOrFilter, listener?: (event: Event) => void): NodeList;

	/**
	 * Unregister event listener from all nodes from NodeList
	 * @param {string} eventName
	 * @param {(event: Event) => void} listener
	 * @returns {Node}
	 */
	off(eventName: string, listener: (event: Event) => void): NodeList;
}

interface Document extends Node
{
	/**
	 * On document ready event
	 * @param {(event: Event) => void} listener
	 * @returns {Document}
	 */
	ready(listener: (event: Event) => void): Document;
}