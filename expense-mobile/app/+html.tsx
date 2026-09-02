import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// ไฟล์นี้รันเฉพาะบนเว็บเท่านั้น และรันแค่ตอน build (Node.js) เท่านั้น
// ไม่มีสิทธิ์เข้าถึง DOM/browser API ตรงนี้ — ห้ามใส่ context provider หรือ logic ของแอปที่นี่
// (ของพวกนั้นอยู่ที่ app/_layout.tsx ตามปกติ)
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />

        <title>Expense App</title>

        {/* ทำให้ scroll ของ React Native Web ดูเป็นธรรมชาติเหมือนแอปจริง */}
        <ScrollViewStyleReset />

        {/* PWA manifest — ทำให้ "เพิ่มไปยังหน้าจอโฮม" ได้ไอคอน/ชื่อแอปที่ถูกต้อง */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />

        {/* เฉพาะ iOS Safari: ทำให้เปิดแบบเต็มจอ standalone จริงๆ ไม่ใช่แค่ shortcut เปิด Safari */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Expense" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/*
          ปิดเส้น/ไฮไลต์ที่เบราว์เซอร์ใส่ให้อัตโนมัติเวลาแตะ/โฟกัสช่อง input:
          - outline คือเส้น focus ของเบราว์เซอร์ทั่วไป (Chrome/Android เป็นหลัก)
          - -webkit-tap-highlight-color คือเอฟเฟกต์ไฮไลต์สีฟ้าจางๆ ของ WebKit/Safari บน iOS
          ต้องปิดทั้งคู่เพราะเป็นคนละ property กัน ใส่เป็น global CSS ตรงนี้แทน style prop
          ของ React Native Web เพื่อให้ชัวร์ว่าครอบคลุมทุกกรณี
        */}
        <style>{`
          input, textarea, select, button, a, [role="button"] {
            outline: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
        `}</style>
      </head>

      <body>{children}</body>
    </html>
  );
}