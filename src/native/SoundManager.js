'use strict'

import { NativeModules } from 'react-native'

export default class SoundManager {
    static isPlaying = false;
    static playAlarmSound(){
        this.isPlaying = true;
        NativeModules.SoundManager.playAlarmSound();
    }
    
    static stopAlarmSound(){
        this.isPlaying = false;
        NativeModules.SoundManager.stopAlarmSound();
    }

    static setMusicVolume(volumePercent){
        NativeModules.SoundManager.setMusicVolume(volumePercent);
    }
    
    static setControlStreamMusic() {
        NativeModules.SoundManager.setControlStreamMusic();
    }

    static timerComplete(){
        this.playAlarmSound();
        setTimeout(() => {
          this.stopAlarmSound();
        }, 6000);
    }
}