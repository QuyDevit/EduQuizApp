import React from "react";
import useAppColor from "../themed/useAppColor";
import BottomSheet from "@devvie/bottom-sheet";
import {View } from "react-native";
import FastImage from "react-native-fast-image";


export const CustomBottomSheet = React.memo(React.forwardRef((props:any, ref:any) =>{
    return(
        <BottomSheet 
            {...props}
            style={{backgroundColor:'#1d43a5'}}
            dragHandleStyle={{backgroundColor:'white',opacity:.9,width:50,top:10}}
            ref={ref}
            onClose={() =>{
                if(props.onClose){
                    props.onClose();
                }
            }}
            >
            <View style={{width:'100%',height:'100%',backgroundColor:"#1d43a5",borderTopLeftRadius:10,borderTopRightRadius:10}}>
                {props.children}            
            </View>
      </BottomSheet>
    );
}));
export const FastImageRes = React.memo(({uri}:{uri:string}) =>{
    return(
        <FastImage
        style={{width:'100%',height:'100%'}}
        source={{
        uri: uri,
        priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
    />
    );
});
