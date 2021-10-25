import * as React from 'react';
export interface TypeItOptions {
    strings?: Array<string> | string;
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
