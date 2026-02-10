import { Input as AntInput, InputProps as AntInputProps } from 'antd';

import { cn } from '@root/utils/cn';

interface InputProps extends AntInputProps {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return <AntInput className={cn(className)} {...props} />;
}
