interface GTMEvent {
    event: string;
    [key: string]: any;
}
export declare const sendGTMEvent: (eventData: GTMEvent) => void;
export {};
