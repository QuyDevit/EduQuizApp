import {StyleSheet, View} from 'react-native';
import React from 'react';
import {TText} from '../themed/themeComponents';
import useAppColor from '../themed/useAppColor';

const LibraryScreen = React.memo((props: any) => {
  const colorMode = useAppColor();
  return (
    <View style={{flex: 1, backgroundColor: colorMode.inverseWhiteGray}}>
      {/* <TText>LibraryScreen</TText> */}
    </View>
  );
});

export default LibraryScreen;
