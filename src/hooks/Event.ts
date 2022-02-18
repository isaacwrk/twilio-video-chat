type Callback<T = any> = (data?: T) => void;
interface Oberservers {
    [key: string]: ((data?: any) => any | void)[];
}

export class Observer {
    private static subscribers: Oberservers = {};

    static subscribe(eventName: string, fn: Callback ) {
        Observer.subscribers[eventName] = Observer.subscribers[eventName] || [];
        Observer.subscribers[eventName].push(fn);
    }
    static notify(eventName: string, data: any) {
        if (Observer.subscribers[eventName] ){
            Observer.subscribers[eventName].forEach((fn: Callback) => {
                fn(fn);
            });
        }
    }

    static unsubscribe(eventName: string, fn: Callback) {
        if (Observer.subscribers[eventName] ){
            const index = Observer.subscribers[eventName].findIndex((el) => el === fn);
            if (index > -1) {
                Observer.subscribers[eventName].splice(index, 1);
                if (Observer.subscribers[eventName].length == 0) {
                    delete Observer.subscribers[eventName];
                }
            }

        }
    }
}