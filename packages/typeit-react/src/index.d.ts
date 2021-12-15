import * as React from 'react';
export interface TypeItOptions {
    strings?: Array<string> | string;
    speed?: number;
    deleteSpeed?: number | null;
    lifeLike?: boolean;
    cursor?: boolean;
    cursorSpeed?: number;
    cursorChar?: string;
    breakLines?: boolean;
    nextStringDelay?: Array<number> | number;
    waitUntilVisible?: boolean;
    startDelete?: boolean;
    startDelay?: boolean;
    loop?: boolean;
    loopDelay?: Array<number> | number;
    html?: boolean;
}
export interface TypeItProps {
    as?: keyof JSX.IntrinsicElements;
    options?: TypeItOptions;
    children?: React.ReactNode;
    getBeforeInit?: (instance: any) => Function;
    getAfterInit?: (instance: any) => Function;
}
declare const TypeIt: React.FunctionComponent<TypeItProps>;
export default TypeIt;
