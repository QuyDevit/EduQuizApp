import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {FastImageRes} from '../shared/Reusables';
import {ADS_DATA} from '../shared/constants';
import {FlashList} from '@shopify/flash-list';
import apiCall, {API_ENDPOINTS, BASE_URL} from '../api/config';
import LoadingOverlay from '../components/LoadingOverlay';
import IconItem from '../assets/images/iconitem.svg';

const {width: screenWidth} = Dimensions.get('window');
const colors = [
  '#273152',
  '#551018',
  '#24433c',
  '#440e6f',
  '#1f1e81',
  '#2a4d69',
];

const HomeScreen = React.memo(() => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (loading) {
      const animation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      );
      animation.start();
      return () => {
        animation.stop();
        rotation.setValue(0);
      };
    } else {
      rotation.setValue(0);
    }
  }, [loading]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataResponse = await apiCall(
          'GET',
          API_ENDPOINTS.HOMEDATA_ENDPOINT,
        );
        setData(dataResponse);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (!data) {
    return <LoadingOverlay rotation={rotation} />;
  }

  const renderAdItem = ({item}) => (
    <View style={styles.adContainer}>
      <Image source={{uri: item.image}} style={styles.adImage} />
    </View>
  );

  const renderTopicItem = ({item}) => (
    <View style={styles.topicContainer}>
      <View style={styles.topicImage}>
        <FastImageRes uri={`${BASE_URL}${item.image}`} />
      </View>

      <Text style={styles.topicTitle}>{item.name}</Text>
    </View>
  );
  const renderEduQuizItem = ({item, index}) => (
    <View
      style={[
        styles.eduquizContainer,
        {backgroundColor: colors[index % colors.length]},
      ]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 4,
          paddingHorizontal: 8,
        }}>
        <IconItem width={20} height={20} />
        <Text style={{color: '#fff', fontWeight: 'bold'}}>Eduquiz</Text>
      </View>
      <View style={styles.eduquizImage}>
        <FastImageRes uri={`${BASE_URL}${item.image}`} />
        <Text style={styles.textCount}>{item.sumQuestion} câu hỏi</Text>
      </View>
      <Text style={styles.textQuizTitle} numberOfLines={2} ellipsizeMode="tail">
        {item.title}
      </Text>
      <Text style={styles.textName}>{item.userName}</Text>
    </View>
  );
  const renderUserItem = ({item, index}) => (
    <View
      style={[
        styles.channelContainer,
        {backgroundColor: colors[index + (1 % colors.length)]},
      ]}>
      <View style={styles.channelImage}>
        <FastImageRes uri={`${BASE_URL}${item.imgCover}`} />
        <View style={styles.overlay} />
        <View style={styles.cardBody}>
          <View style={styles.viewAvatar}>
            <FastImageRes uri={`${BASE_URL}${item.avatar}`} />
          </View>
          <View style={styles.wrapperChannel}>
            <View style={styles.iconChannel}>
              <FastImageRes uri={`${BASE_URL}/src/img/favicon.ico`} />
            </View>
            <Text
              style={{
                fontSize: 13,
                color: '#000',
                fontWeight: 'bold',
                marginLeft: 8,
              }}>
              Channels
            </Text>
          </View>
          <Text style={styles.textNameChannel}>{item.userName}</Text>
          <View style={{flexDirection: 'row',alignItems:'center',marginTop:16}}>
            <Text style={[styles.textName,{fontWeight:'bold'}]}>{item.sumEduQuiz}</Text>
            <Text style={styles.textName}>EduQuizs</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.adSection}>
        <Carousel
          data={ADS_DATA}
          renderItem={renderAdItem}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          loop={true}
          autoplay={true}
          autoplayInterval={3000}
        />
      </View>

      <View style={styles.topicSection}>
        <Text style={styles.textTitle}>Chủ đề</Text>
        <FlashList
          style={{paddingVertical: 6}}
          data={data.getlistTopic}
          renderItem={renderTopicItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{gap: 10, paddingHorizontal: 12}}
        />
      </View>
      <View style={styles.eduquizSection}>
        <Text style={styles.textTitle}>EduQuiz hot</Text>
        <FlashList
          style={{paddingVertical: 6}}
          data={data.listEduQuizHot}
          renderItem={renderEduQuizItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{gap: 10, paddingHorizontal: 12}}
        />
      </View>
      <View style={styles.channelSection}>
        <Text style={styles.textTitle}>Kênh người dùng</Text>
        <FlashList
          style={{paddingVertical: 6}}
          data={data.listProfileUser}
          renderItem={renderUserItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{gap: 10, paddingHorizontal: 12}}
        />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  adSection: {
    marginBottom: 10,
  },
  adContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  adImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  topicSection: {
    marginTop: 20,
    marginHorizontal: 10,
    width: '100%',
  },
  topicContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: 160,
    height: 90,
    marginRight: 12,
  },
  topicImage: {
    width: '100%',
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  topicTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  textTitle: {
    marginStart: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  eduquizSection: {
    marginTop: 20,
    marginHorizontal: 10,
    width: '100%',
  },
  eduquizContainer: {
    display: 'flex',
    borderRadius: 6,
    width: 180,
    height: 220,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  eduquizImage: {
    position: 'relative',
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  textCount: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 2,
    paddingHorizontal: 12,
    color: '#fff',
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  textQuizTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
  },
  textName: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 8,
    marginBottom: 8,
  },
  channelSection: {
    marginTop: 20,
    marginHorizontal: 10,
    width: '100%',
    marginBottom: 60,
  },
  channelContainer: {
    display: 'flex',
    borderRadius: 6,
    width: 170,
    height: 200,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  channelImage: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardBody: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconChannel: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperChannel: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  textNameChannel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
});

export default HomeScreen;
