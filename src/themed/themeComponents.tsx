import {Text } from 'react-native';
import React from 'react';
import useAppColor from './useAppColor';
import { IText } from '../shared/types';

export const TText = React.memo((props: IText) => {
    const colorMode = useAppColor();
  return (
    <Text {...props} style={[{ color: colorMode.textGray }, props.style]}>
        {props.children}
    </Text>
  );
});
