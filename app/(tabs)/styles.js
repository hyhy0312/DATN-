import { StyleSheet, Dimensions } from 'react-native';

// Lấy chiều rộng và chiều cao màn hình
const { width, height } = Dimensions.get('window');
const paddingValue = width * 0.05; // 5% của chiều rộng
const fontSizeBase = width * 0.05; // Kích thước font có thể thay đổi theo chiều rộng màn hình

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

export default styles;
