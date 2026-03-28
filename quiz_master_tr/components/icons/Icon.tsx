import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { TextProps, Text } from 'react-native';

interface IconProps extends Omit<TextProps, 'style'> {
  name: React.ComponentProps<typeof MaterialIcons>['name'] | string;
  size?: number;
  color?: string;
  className?: string;
  style?: any;
}

export default function Icon({ name, size = 24, color, className, style, ...rest }: IconProps) {
  // @ts-ignore
  return <MaterialIcons name={name as any} size={size} color={color} className={className} style={style} {...rest} />;
}
