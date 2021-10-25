import * as React from 'react';
import { default as TypeItCore } from 'typeit';
const { useRef, useEffect, useState, useMemo } = React;
import isVoidElement from "./helpers/isVoidElement";

export interface TypeItOptions {
  strings?: Array<string> | string
}

export interface TypeItProps {
  as?: keyof JSX.IntrinsicElements,
  options?: TypeItOptions,
  children?: React.ReactNode,
  getBeforeInit?: (instance: any) => Function,
  getAfterInit?: (instance: any) => Function
}

const defaultProps: TypeItProps = {
  as: 'span',
  options: {},
  getBeforeInit: (instance) => instance,
  getAfterInit: (instance) => instance
}

const TypeIt: React.FunctionComponent<TypeItProps> = (props: TypeItProps) => {
  const [shouldRenderChildren, setShouldRenderChildren] = useState<boolean>(true);
  const ref = useRef(null);
  const { options, as, children, getBeforeInit, getAfterInit, ...remainingProps } = props;
  const DynamicElement = as;
  const elementIsVoid = useMemo(() => {
    return isVoidElement(DynamicElement);
  }, [DynamicElement]);

  /**
   * After the component mounts (and any children are rendered),
   * we can safely set the strings of the instance using the rendered HTML
   * from those optionally-defined children. Otherwise, we'll just use the strings
   * defined via the options prop.
   */
  useEffect(() => {
    if (children) {
      options.strings = ref.current.innerHTML;
    }

    setShouldRenderChildren(false);
  }, []);

  /**
   * Once options (and strings) have been defined, we can hide any children we might
   * have rendered to make room for the TypeIt animation. On cleanup, destroy
   * that instance.
   */
  useEffect(() => {
    if (shouldRenderChildren) {
      return;
    }

    let i = (new TypeItCore(ref.current, {
      ...options
    }));

    i = getBeforeInit(i);
    i.go();
    i = getAfterInit(i);

    return () => {
      // @ts-ignore
      i.destroy();
    }
  }, [shouldRenderChildren]);

  return (
    <div style={{ opacity: shouldRenderChildren ? 0 : 1 }}>
      {elementIsVoid
        // @ts-ignore
        ? <DynamicElement ref={ref} {...remainingProps} />
        :
        (
          // @ts-ignore
          <DynamicElement ref={ref} {...remainingProps}>
            {shouldRenderChildren && children}
          </DynamicElement>
        )
      }
    </div>
  )
}

TypeIt.defaultProps = defaultProps;

export default TypeIt;
