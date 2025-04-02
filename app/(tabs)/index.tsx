import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions  } from 'react-native';
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

// Lấy chiều rộng và chiều cao màn hình
const { width, height } = Dimensions.get('window');
const paddingValue = width * 0.05; // 5% của chiều rộng
const fontSizeBase = width * 0.05; // Kích thước font có thể thay đổi theo chiều rộng màn hình

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
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
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
        <Text style={styles.value}>{formatTime(time)}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(224, 237, 238, 0.6)', // Đảm bảo lớp phủ mờ
    zIndex: 0, // Đảm bảo lớp phủ không che phủ các thành phần con
  },

  header: {
    backgroundColor: '#78c4d4',
    width: '100%',
    padding: width * 0.05, // Padding linh hoạt
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute', // Giữ tiêu đề ở trên cùng
    top: 0,
    zIndex: 2, // Đảm bảo tiêu đề không bị che khuất
  },
  headerText: {
    color: 'white',
    fontSize: width * 0.05, // Điều chỉnh kích thước font theo chiều rộng màn hình
    fontWeight: 'bold',
    
  },

  titleContainer: {
    backgroundColor: 'rgba(184, 206, 235, 0.6)', // Độ mờ của khung
    padding: width * 0.03, // Padding linh hoạt
    
    borderRadius: 10,  // Bo góc khung
    borderColor: 'black', // Màu viền của khung
    //width: '90%', // Điều chỉnh chiều rộng của khung
    alignItems: 'center', // Căn giữa chữ
    marginBottom: height * 0.03, // Khoảng cách dưới khung
    position: 'relative', // Sử dụng position relative để kiểm soát vị trí
    marginTop: -height * 0.1, // Đẩy lên gần header hơn
    zIndex: 10, // Đảm bảo khung không bị che khuất
    height: height * 0.13, // Điều chỉnh chiều cao theo màn hình
  },

  title: {
    fontSize: width * 0.07, // Cỡ chữ cho title
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black', // Màu chữ đen để nổi bật trên nền tối
  },

  infoContainer: {
    backgroundColor: 'rgba(184, 206, 235, 0.9)',
    padding: width * 0.06, // Padding linh hoạt
    borderRadius: 20,
    alignItems: 'center',
    width: '50%', // Điều chỉnh chiều rộng của thông tin
  },
  label: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  value: {
    fontSize: width * 0.09,
    fontWeight: 'bold',
    marginVertical: 7,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: height * 0.03,
    justifyContent: 'space-between', // Đảm bảo các nút có khoảng cách đều nhau
    width: '80%', // Thêm chiều rộng để các nút có khoảng cách đều
    
  },
  startStopButton: {
    padding: width * 0.05, // Padding linh hoạt
    borderRadius: 50,
    marginHorizontal: width * 0.02, // Margin linh hoạt
    shadowColor: '#000', // Màu bóng
    shadowOffset: { width: 0, height: 4 }, // Độ nghiêng của bóng
    shadowOpacity: 0.3, // Độ mờ của bóng
    shadowRadius: 5, // Kích thước bóng
    elevation: 5, // Đổ bóng cho Android
    
  },
  controlButtonUP: {
    backgroundColor: '#4A90E2',
    padding: width * 0.05, // Padding linh hoạt
    borderRadius: 50,
    marginHorizontal: width * 0.02, // Margin linh hoạt
    width: width * 0.2, // Điều chỉnh chiều rộng theo màn hình
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  controlButtonDOWN: {
    backgroundColor: '#4A90E2',
    padding: width * 0.05, // Padding linh hoạt
    borderRadius: 50,
    marginHorizontal: width * 0.02, // Margin linh hoạt
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    
  },
  buttonText: {
    color: 'BLACK',
    fontSize: width * 0.04, // Điều chỉnh kích thước font linh hoạt
    fontWeight: 'bold',
    //alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#78c4d4',
    width: '100%',
    padding: width * 0.05, // Padding linh hoạt
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: width * 0.04, // Điều chỉnh kích thước font linh hoạt
    fontWeight: 'bold',
  },
});