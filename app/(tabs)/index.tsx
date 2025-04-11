import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions  } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import styles from './styles'
// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC8l9CKSOA0iNYF2l8q_rApYCa2wj_6Wuw",
  authDomain: "may-lam-am-dung-dich-muoi.firebaseapp.com",
  databaseURL: "https://may-lam-am-dung-dich-muoi-default-rtdb.firebaseio.com",
  projectId: "may-lam-am-dung-dich-muoi",
  storageBucket: "may-lam-am-dung-dich-muoi.firebasestorage.app",
  messagingSenderId: "866755714890",
  appId: "1:866755714890:web:28f189332d08d948a36bb3",
  measurementId: "G-2YBJZMC21W"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Lấy chiều rộng và chiều cao màn hình
const { width, height } = Dimensions.get('window');
const paddingValue = width * 0.05; // 5% của chiều rộng
const fontSizeBase = width * 0.05; // Kích thước font có thể thay đổi theo chiều rộng màn hình

export default function App() {
  const [temperature, setTemperature] = useState(56);
  const [setTemp, setSetTemp] = useState(37); // Nhiệt độ cài đặt
  const [isRunning, setIsRunning] = useState(false); // Trạng thái START/STOP
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);


  // Lắng nghe sự thay đổi từ Firebase
  useEffect(() => {
    const statusRef = ref(database, 'machineStatus');
    
    // Lắng nghe sự thay đổi từ Firebase
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTemperature(data.temperature || 56); // Cập nhật nhiệt độ máy
        setSetTemp(data.setTemp || 37); // Cập nhật nhiệt độ cài đặt
        setIsRunning(data.startStop === 'START'); // Cập nhật trạng thái START/STOP
        setHour(data.hour || 0);
        setMinute(data.minute || 0);
        setSecond(data.second || 0);
      }
    });

    // Dọn dẹp khi component unmount
    return () => unsubscribe(); // Dừng lắng nghe khi component unmount
  }, []);

  // Xử lý sự kiện START/STOP
  const handleStartStop = () => {
    const newRunningState = !isRunning; // Lấy trạng thái mới
    setIsRunning(newRunningState); // Cập nhật trạng thái trong ứng dụng
    set(ref(database, 'machineStatus/startStop'), newRunningState ? 'START' : 'STOP');
  };

  // Tăng nhiệt độ cài đặt
  const increaseTemp = () => {
    const newTemp = setTemp < 40 ? setTemp + 1 : setTemp;
    setSetTemp(newTemp);
    set(ref(database, 'machineStatus/setTemp'), newTemp); // Cập nhật lên Firebase
  };

  // Giảm nhiệt độ cài đặt
  const decreaseTemp = () => {
    const newTemp = setTemp > 35 ? setTemp - 1 : setTemp;
    setSetTemp(newTemp);
    set(ref(database, 'machineStatus/setTemp'), newTemp); // Cập nhật lên Firebase
  };

  // Cập nhật nhiệt độ máy vào Firebase
  useEffect(() => {
    set(ref(database, 'machineStatus/temperature'), temperature); // Cập nhật giá trị máy lên Firebase
  }, [temperature]);

  // Chuyển thời gian từ giây sang phút và giây
  const formatTime = (minute: number, second: number, hour: number) => {
    return `${hour}h ${minute}m ${second}s`;
  };
  

  return (
    <ImageBackground
      source={require('../../assets/images/maxresdefault.jpg')}
      style={styles.container}
    >
      <View style={styles.overlay} /> 
      <View style={styles.header}>
        <Text style={styles.headerText}>Trường ĐH Sư phạm Kỹ Thuật TP.HCM</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MÁY LÀM ẤM {'\n'} DUNG DỊCH NƯỚC MUỐI</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nhiệt độ máy</Text>
        <Text style={styles.value}>{temperature}</Text>
        <Text style={styles.label}>Nhiệt độ cài đặt</Text>
        <Text style={styles.value}>{setTemp}</Text>
        <Text style={styles.label}>Thời gian</Text>
        <Text style={styles.value}>{formatTime(hour,minute, second)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.startStopButton, { backgroundColor: isRunning ? 'rgba(241, 38, 31, 1)' : 'rgb(92, 187, 37)' }]}
          onPress={handleStartStop}
        >
           <Text style={styles.buttonText}>{isRunning ? 'STOP' : 'START'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButtonUP} onPress={increaseTemp}>
          <Text style={styles.buttonText}>UP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButtonDOWN} onPress={decreaseTemp}>
          <Text style={styles.buttonText}>DOWN</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Bệnh viện Nhân Dân 115</Text>
      </View>
    </ImageBackground>
  );
}
