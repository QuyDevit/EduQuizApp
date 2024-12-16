import {View} from 'react-native';
import React from 'react';
import {TText} from '../themed/themeComponents';
import useAppColor from '../themed/useAppColor';

const SettingScreen = React.memo((props: any) => {
  const colorMode = useAppColor();
  return (
    <View style={{flex: 1, backgroundColor: colorMode.inverseWhiteGray}}>
      {/* <TText>SettingScreen</TText> */}
    </View>
  );
});

export default SettingScreen;
