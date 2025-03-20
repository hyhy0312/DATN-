// app/tabs/index.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  const [machineTemp, setMachineTemp] = useState(56);
  const [setTemp, setSetTemp] = useState(37);
  const [time, setTime] = useState(41 * 60 + 56); // 41m 56s in seconds
  const [running, setRunning] = useState(false);

  const toggleStartStop = () => {
    setRunning(!running);
  };

  const increaseTemp = () => {
    setSetTemp(prevTemp => (prevTemp < 40 ? prevTemp + 1 : prevTemp)); // Maximum 40
  };

  const decreaseTemp = () => {
    setSetTemp(prevTemp => (prevTemp > 35 ? prevTemp - 1 : prevTemp)); // Minimum 35
  };

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
        <Text style={styles.value}>{machineTemp}</Text>
        <Text style={styles.label}>Nhiệt độ cài đặt</Text>
        <Text style={styles.value}>{setTemp}</Text>
        <Text style={styles.label}>Thời gian</Text>
        <Text style={styles.value}>{formatTime(time)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.startStopButton, { backgroundColor: running ? 'green' : 'red' }]}
          onPress={toggleStartStop}
        >
          <Text style={styles.buttonText}>START/STOP</Text>
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
