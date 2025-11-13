import { createContext } from 'react';
import { ConfigProviderProps } from './interface';

const defaultProps: ConfigProviderProps = {
  prefixCls: 'arco-material',
};

export function getPrefixCls(componentName: string, customPrefix?: string): string {
  return `${customPrefix || 'arco-material'}-${componentName}`;
}

export const ConfigContext = createContext<ConfigProviderProps>({
  getPrefixCls,
  ...defaultProps,
});
