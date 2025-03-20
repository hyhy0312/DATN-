// app/tabs/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      {/* Chỉ giữ màn hình index là màn hình chính */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home', // Đặt tên màn hình nếu cần
        }}
      />
    </Tabs>
  );
}
