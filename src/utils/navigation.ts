import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { IUsuario } from '../ts/IUsuario';

export type RootStackParamList = {
  Home: undefined;
  Detail: { user: IUsuario };
};

export type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type DetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Detail'>;
export type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;
