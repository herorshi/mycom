import { r as registerInstance, d as getContext, h, c as getElement } from './chunk-33df9e5b.js';
import { m as matchPath } from './chunk-7ae10276.js';
import './chunk-992c6a9e.js';
import { A as ActiveRouter } from './chunk-57ed1807.js';

const getUniqueId = () => {
    return ((Math.random() * 10e16).toString().match(/.{4}/g) || []).join('-');
};
const getMatch = (pathname, url, exact) => {
    return matchPath(pathname, {
        path: url,
        exact: exact,
        strict: true
    });
};
const isHTMLStencilRouteElement = (elm) => {
    return elm.tagName === 'STENCIL-ROUTE';
};
class RouteSwitch {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.group = getUniqueId();
        this.subscribers = [];
        this.queue = getContext(this, "queue");
    }
    componentWillLoad() {
        if (this.location != null) {
            this.regenerateSubscribers(this.location);
        }
    }
    async regenerateSubscribers(newLocation) {
        if (newLocation == null) {
            return;
        }
        let newActiveIndex = -1;
        this.subscribers = Array.prototype.slice.call(this.el.children)
            .filter(isHTMLStencilRouteElement)
            .map((childElement, index) => {
            const match = getMatch(newLocation.pathname, childElement.url, childElement.exact);
            if (match && newActiveIndex === -1) {
                newActiveIndex = index;
            }
            return {
                el: childElement,
                match: match
            };
        });
        if (newActiveIndex === -1) {
            return;
        }
        // Check if this actually changes which child is active
        // then just pass the new match down if the active route isn't changing.
        if (this.activeIndex === newActiveIndex) {
            this.subscribers[newActiveIndex].el.match = this.subscribers[newActiveIndex].match;
            return;
        }
        this.activeIndex = newActiveIndex;
        // Set all props on the new active route then wait until it says that it
        // is completed
        const activeChild = this.subscribers[this.activeIndex];
        if (this.scrollTopOffset) {
            activeChild.el.scrollTopOffset = this.scrollTopOffset;
        }
        activeChild.el.group = this.group;
        activeChild.el.match = activeChild.match;
        activeChild.el.componentUpdated = (routeViewUpdatedOptions) => {
            // After the new active route has completed then update visibility of routes
            this.queue.write(() => {
                this.subscribers.forEach((child, index) => {
                    child.el.componentUpdated = undefined;
                    if (index === this.activeIndex) {
                        return child.el.style.display = '';
                    }
                    if (this.scrollTopOffset) {
                        child.el.scrollTopOffset = this.scrollTopOffset;
                    }
                    child.el.group = this.group;
                    child.el.match = null;
                    child.el.style.display = 'none';
                });
            });
            if (this.routeViewsUpdated) {
                this.routeViewsUpdated(Object.assign({ scrollTopOffset: this.scrollTopOffset }, routeViewUpdatedOptions));
            }
        };
    }
    render() {
        return (h("slot", null));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "location": ["regenerateSubscribers"]
    }; }
}
ActiveRouter.injectProps(RouteSwitch, [
    'location',
    'routeViewsUpdated'
]);

export { RouteSwitch as stencil_route_switch };
