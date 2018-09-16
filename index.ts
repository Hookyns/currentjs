module currentjs
{
	/**
	 * Create Nodes from given HTML. Given attributes will be added to all top-level Elements.
	 * @param {string} html
	 * @param {{}} [attrs]
	 * @returns {NodeList}
	 */
	export function create(html: string, attrs?: { [attributeName: string]: any }): NodeList
	{
		let elements = document.createElement("div");
		elements.innerHTML = html;

		elements.childNodes.forEach((node => {
			if (node.nodeType === Node.ELEMENT_NODE)
			{
				for (let attr in attrs)
				{
					if (attrs.hasOwnProperty(attr))
					{
						(node as Element).setAttribute(attr, attrs[attr]);
					}
				}
			}
		}));

		return elements.childNodes;
	}
}