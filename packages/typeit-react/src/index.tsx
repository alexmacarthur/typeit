import React, { forwardRef, useRef, useEffect, useState } from "react";
import { default as TypeItCore, TypeItOptions } from "typeit";
import type { TypeIt as ITypeIt } from "typeit";

export interface TypeItProps {
  as?: keyof JSX.IntrinsicElements;
  options?: TypeItOptions;
  children?: React.ReactNode;
  getBeforeInit?: (instance: ITypeIt) => Function;
  getAfterInit?: (instance: ITypeIt) => Function;
  [key: string]: any;
}

const DynamicElementComponent = forwardRef((props: any, ref) => {
  const { as: As } = props;

  return <As ref={ref} {...props} />;
});

// Must pull this into a separate variable to avoid React
// thinking it's a different object on every render.
const defaultPropOptions = {};

const TypeIt: React.FunctionComponent<TypeItProps> = ({
  as = "span",
  options = defaultPropOptions,
  children = null,
  getBeforeInit = (instance: ITypeIt) => instance,
  getAfterInit = (instance: ITypeIt) => instance,
  ...remainingProps
}: TypeItProps) => {
  const elementRef = useRef<HTMLElement>(null);
  const instanceRef = useRef<ITypeIt>(null);
  const [shouldShowChildren, setShouldShowChildren] = useState<boolean>(true);
  const [instanceOptions, setInstanceOptions] = useState(null);

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
   * Destroy the instance whenever the component unmounts.
   */
  useEffect(() => {
    return () => instanceRef.current?.destroy();
  }, []);

  return (
    <DynamicElementComponent
      ref={elementRef}
      as={as}
      children={shouldShowChildren ? children : null}
      style={{ opacity: shouldShowChildren ? 0 : 1 }}
      {...remainingProps}
    />
  );
};

export default TypeIt;
