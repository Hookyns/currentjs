declare module currentjs {
    /**
     * Create Nodes from given HTML. Given attributes will be added to all top-level Elements.
     * @param {string} html
     * @param {{}} [attrs]
     * @returns {NodeList}
     */
    function create(html: string, attrs?: {
        [attributeName: string]: any;
    }): NodeList;
}
declare module currentjs.event {
    interface CurrentJSEventData {
        name: string;
        listener: (event: Event) => void;
        filterSelector: string;
    }
    /**
     * DEV submodule
     */
    module dev {
        /**
         * Get all registered events via .on()
         * @description Returned iterator is not clone so you can manipulate it but it is not recommended.
         * @returns {IterableIterator}
         */
        function getAll(): IterableIterator<[Node, {
            [eventName: string]: Array<CurrentJSEventData>;
        }]>;
        /**
         *
         * @description Returned object is not clone so you can manipulate it but it is not recommended.
         * @param {Node} node
         * @returns {{}}
         */
        function getAllFrom(node: Node): {
            [eventName: string]: Array<CurrentJSEventData>;
        };
    }
}
declare module currentjs.node {
}
declare module currentjs.nodelist {
}
