import { r as registerInstance, h } from './chunk-33df9e5b.js';

class AsyncContent {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.content = '';
    }
    componentWillLoad() {
        if (this.documentLocation != null) {
            return this.fetchNewContent(this.documentLocation);
        }
    }
    fetchNewContent(newDocumentLocation) {
        return fetch(newDocumentLocation)
            .then(response => response.text())
            .then(data => {
            this.content = data;
        });
    }
    render() {
        return (h("div", { innerHTML: this.content }));
    }
    static get watchers() { return {
        "documentLocation": ["fetchNewContent"]
    }; }
}

export { AsyncContent as stencil_async_content };
