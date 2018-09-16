# CurrentJS (Minimalist DOM Utility)
CurrentJS is very small library (3.6 kb minified) which extends prototypes of Document, Node, NodeList and Element 
to give you some comfort and basic back compatibility (> IE11). This allows you to use
current today's poweful plain JavaScript without jQuery or other libraries.

## Added methods

### `module` currentjs
#### currentjs.create(html: string, attrs?: { \[attributeName: string]: any }): NodeList
> Create Nodes from given HTML. Given attributes will be added to all top-level Elements.
* @param {string} html
* @param {{}} \[attrs]
* @returns {NodeList}

### `:` Node

#### find(selector: string | Node | NodeList): NodeList
> Find Nodes by query selector
* @param {string | Node | NodeList} selector

```typescript
let exampleDivs: NodeList = document.find("div.example");
let exampleDiv = exampleDivs.item(0);

let link = exampleDiv.find("ul.main > li > a").item(0);
```

#### on(eventName: string, listenerOrFilterSelector, listener?: (event: Event) => void): Node
> Register event listener
* @param {string} eventName
* @param listenerOrFilterSelector Event listener or filtering selector
* @param {(event: Event) => void} \[listener]

```typescript
// Delegated
document.find(".menu").on("click", "li > a", event => {
	console.log("Menu link clicked, through delegate");
});

let menuItems: NodeList = document.find(".menu li > a");

// Over NodeList
menuItems.on("click", event => {
	console.log("Menu link clicked");
});

// Manually
menuItems.forEach(node => node.on("click", event => {
	console.log("Menu link clicked")
}));

```

#### off(eventName: string, listener?: (event: Event) => void): Node
> Unregister event listener
* @param {string} eventName
* @param {(event: Event) => void} listener

#### dispatch(eventName: string, bubbles?: boolean, cancelale?: boolean): Node
> Trigger event manually
* @param {string} eventName
* @param {boolean} bubbles
* @param {boolean} cancelale

```typescript
// Simulate menu item click
document.find(".menu li > a").item(0).dispatch("click");
```

#### asNodeList(): NodeList
> Convert Node to NodeList


### `:` Document (extends Node)
#### ready(listener: (event: Event) => void): Document
> On document ready event
* @param {(event: Event) => void} listener

```typescript
document.ready((event) => {
	console.log("Document is ready!");
});
```

## Integrated polyfills
- Element.closest()
- NodeList.forEach()
- ParentNode.prepend()
- ChildNode.before()
- ChildNode.after()
- ChildNode.remove()
- ChildNode.replaceWith()

For more polyfills you can use [dom4](https://github.com/WebReflection/dom4) library.

## DEV submodules
Some namespaces have .dev submodule which contains useful methods for developers.

### `module` currentjs.event.dev
#### getAll(): IterableIterator<[Node, { [eventName: string]: Array<CurrentJSEventData> }]>
> Get full list of all registered events

#### getAllFrom(node: Node): { \[eventName: string]: Array<CurrentJSEventData> }
> Get list of all registered events from given Node
* @param {Node} node
