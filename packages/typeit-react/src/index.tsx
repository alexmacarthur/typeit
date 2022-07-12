import * as React from "react";
import { default as TypeItCore, TypeItOptions } from "typeit";
const { useRef, useEffect, useState } = React;

export interface TypeItProps {
  as?: keyof JSX.IntrinsicElements;
  options?: TypeItOptions;
  children?: React.ReactNode;
  getBeforeInit?: (instance: any) => Function;
  getAfterInit?: (instance: any) => Function;
  [key: string]: any;
}

const defaultProps: TypeItProps = {
  as: "span",
  options: {},
  getBeforeInit: (instance) => instance,
  getAfterInit: (instance) => instance,
};

const TypeIt: React.FunctionComponent<TypeItProps> = (props: TypeItProps) => {
  const elementRef = useRef(null);
  const instanceRef = useRef(null);
  const {
    options,
    as,
    children,
    getBeforeInit,
    getAfterInit,
    ...remainingProps
  } = props;
  const [shouldShowChildren, setShouldShowChildren] = useState<boolean>(true);
  const [instanceOptions, setInstanceOptions] = useState(null);
  const DynamicElement = as;

  function calculateOptions() {
    const optionsClone = Object.assign({}, options);

    if (children && elementRef.current) {
      optionsClone.strings = elementRef.current.innerHTML;
    }

    setInstanceOptions(optionsClone);
  }

  function generateNewInstance() {
    instanceRef.current = new TypeItCore(elementRef.current, instanceOptions);
    instanceRef.current = getBeforeInit(instanceRef.current);
    instanceRef.current.go();
    instanceRef.current = getAfterInit(instanceRef.current);
  }

  /**
   * After the component mounts (and any children are rendered),
   * we can safely set the strings of the instance using the rendered HTML
   * from those optionally-defined children. Otherwise, we'll just use the strings
   * defined via the options prop.
   */
  useEffect(() => {
    calculateOptions();

    setShouldShowChildren(false);
  }, [options]);

  /**
   * Once options (and strings) have been defined, we can hide any
   * children we might have rendered to make room for the TypeIt
   * animation. On cleanup, destroy that instance.
   */
  useEffect(() => {
    if (!instanceOptions) return;

    instanceRef.current?.updateOptions(instanceOptions) ||
      generateNewInstance();
  }, [instanceOptions]);

  /**
   * Destroy the instace whenever the component unmounts.
   */
  useEffect(() => {
    return () => instanceRef.current?.destroy();
  }, []);

  return (
    <DynamicElement
      ref={elementRef}
      children={shouldShowChildren ? children : null}
      style={{ opacity: shouldShowChildren ? 0 : 1 }}
      {...remainingProps}
    />
  );
};

TypeIt.defaultProps = defaultProps;

export default TypeIt;
