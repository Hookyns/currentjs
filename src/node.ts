module currentjs.node
{
	// Empty NodeList; returned instead of null
	const _emptyNodeList = document.createDocumentFragment().childNodes;

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
	Node.prototype.find = function (selector: string | Node | NodeList): NodeList {
		if (selector)
		{
			if (selector.constructor === NodeList)
			{
				return selector as NodeList;
			}

			if (selector.constructor === Node)
			{
				return (selector as Node).asNodeList();
			}

			return this.querySelectorAll(selector as string);
		}

		return _emptyNodeList;
	};
}