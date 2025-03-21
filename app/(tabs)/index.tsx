import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

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

export default function App() {
  const [temperature, setTemperature] = useState(56);
  const [setTemp, setSetTemp] = useState(37); // Nhiệt độ cài đặt
  const [isRunning, setIsRunning] = useState(false); // Trạng thái START/STOP
  const [time, setTime] = useState(0); // Thời gian đếm

  // Đồng hồ
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isRunning) {
      setTime(0);
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1); // Tăng thời gian mỗi giây
      }, 1000);
    } else {
      clearInterval(timer); // Dừng đồng hồ khi dừng máy
    }
    return () => clearInterval(timer);
  }, [isRunning]);

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
      }
    });

    // Dọn dẹp khi component unmount
    return () => unsubscribe(); // Dừng lắng nghe khi component unmount
  }, []);

  // Xử lý sự kiện START/STOP
  const handleStartStop = () => {
    const newRunningState = !isRunning;
    setIsRunning(newRunningState);
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
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Trường ĐH Sư phạm Kỹ Thuật TP.HCM</Text>
      </View>
      <Text style={styles.title}>MÁY LÀM ẤM DUNG DỊCH NƯỚC MUỐI</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nhiệt độ máy</Text>
        <Text style={styles.value}>{temperature}</Text>
        <Text style={styles.label}>Nhiệt độ cài đặt</Text>
        <Text style={styles.value}>{setTemp}</Text>
        <Text style={styles.label}>Thời gian</Text>
        <Text style={styles.value}>{formatTime(time)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.startStopButton, { backgroundColor: isRunning ? 'red' : 'green' }]}
          onPress={handleStartStop}
        >
           <Text style={styles.buttonText}>{isRunning ? 'STOP' : 'START'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={increaseTemp}>
          <Text style={styles.buttonText}>UP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={decreaseTemp}>
          <Text style={styles.buttonText}>DOWN</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Bệnh viện Nhân Dân 115</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#78c4d4',
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  infoContainer: {
    backgroundColor: '#cdeeff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  startStopButton: {
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  controlButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#78c4d4',
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});