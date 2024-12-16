import { useColorScheme } from 'react-native';
import colors from './colors';

const useAppColor = () => {
    const mode = useColorScheme() || 'light';
    return colors[mode];
};

export default useAppColor;