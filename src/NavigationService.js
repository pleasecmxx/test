import * as React from 'react';
import { StackActions, CommonActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
    let navigation = navigationRef.current
    navigation?.navigate(name, params);
};

export function back() { 
    let navigation = navigationRef.current
    navigation?.goBack();
};

export function reset(name, params) {
    let navigation = navigationRef.current;
    navigation.dispatch(
        CommonActions.reset({
            index: 1,
            routes: [
                { name: name, params: params },
            ],
        })
    );
};


export function backUtils(backStackSize, handel) {
    const popAction = StackActions.pop(backStackSize);
    let navigation = navigationRef.current;
    navigation.dispatch(popAction);
} 


export function replace(name, params) {
    const popAction = StackActions.replace(name, params);
    let navigation = navigationRef.current;
    navigation.dispatch(popAction);
}