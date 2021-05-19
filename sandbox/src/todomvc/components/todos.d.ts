export declare const todos: {
    url: string;
    what: import("@skintest/sdk").Query<HTMLInputElement>;
    clear_completed: import("@skintest/sdk").Query<HTMLButtonElement>;
    list: import("@skintest/sdk").QueryList<HTMLElement>;
    item: (text: string) => import("@skintest/sdk").Query<import("@skintest/sdk").DOMElement>;
    item_at: (index: number) => import("@skintest/sdk").Query<import("@skintest/sdk").DOMElement>;
    remove: (text: string) => import("@skintest/sdk").Query<import("@skintest/sdk").DOMElement>;
    remove_at: (index: number) => import("@skintest/sdk").Query<import("@skintest/sdk").DOMElement>;
};
