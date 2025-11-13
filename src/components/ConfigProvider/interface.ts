export interface ConfigProviderProps {
  prefixCls?: string;
  getPrefixCls?: (componentName: string, customPrefix?: string) => string;
}
