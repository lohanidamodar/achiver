import React, { Component, PropTypes } from 'react';
import { AsyncStorage } from 'react-native';
import { persistStore } from 'redux-persist';
import { Provider } from 'react-redux';
import { TabNavigator } from 'react-navigation';

import {StyleProvider} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';

import HomeScreen from './containers/HomeScreen';
import ProjectsScreen from './containers/ProjectsScreen';
import store from './store';
import StatsScreen from './containers/StatsScreen';
import SettingsScreen from './containers/SettingsScreen';
import SoundManger from './native/SoundManager';

const App = TabNavigator({
  Home: {screen: HomeScreen},
  Projects: {screen: ProjectsScreen},
  Stats: {screen: StatsScreen},
  Settings: { screen: SettingsScreen }
},{
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    activeTintColor: material.inverseTextColor,
    style:{
      backgroundColor: "#f8f8f8"},
    indicatorStyle: {
      backgroundColor: material.brandPrimary
    }
  }
})

class Achiver extends Component{
  static propTypes = {
    // if app is launched from an AlarmManager through react-native-app-launcher, the id of the alarm responsible
    // for the launch is injected as a prop
    alarmID: PropTypes.string,
  }

  state = {
    rehydrated: false
  }

  constructor(props) {
    super(props)
  }

  componentWillMount(){
    if(this.props.alarmID =='my-alarm'){
      SoundManger.timerComplete();
    }
    persistStore(store,{storage: AsyncStorage},()=>{
      this.setState({rehydrated: true, loading: false})
    })
  }
  render(){
    return (
      <StyleProvider style={getTheme(material)}>
        <Provider store={store}>
          <App screenProps={{rehydrated: this.state.rehydrated}} />
        </Provider>
      </StyleProvider>
    )
  }
}

export default Achiver;