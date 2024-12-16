import {View} from 'react-native';
import React from 'react';
import {TText} from '../themed/themeComponents';
import useAppColor from '../themed/useAppColor';

const DiscoverScreen = React.memo((props: any) => {
  const colorMode = useAppColor();
  return (
    <View style={{flex: 1, backgroundColor: colorMode.inverseWhiteGray}}>
      {/* <TText>DiscoverScreen</TText> */}
    </View>
  );
});

export default DiscoverScreen;
