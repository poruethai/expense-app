# Welcome to your Expo app 👋

## สิ่งที่พัฒนาเพิ่มเติม

แอปนี้มีชั้นฐานข้อมูล (SQLite) ครบอยู่แล้ว แต่ UI ยังใช้งานไม่ได้จริง งานที่เพิ่มเข้ามาในรอบนี้:

- **รายการ (Home)** — กรองรายการ/ยอดสรุปตามเดือนที่เลือกได้จริง, ปุ่ม + เพิ่มรายการ, กดรายการเพื่อแก้ไข, กดค้างเพื่อลบ
- **เพิ่ม/แก้ไขรายการ** — เลือกประเภทรายรับ/รายจ่าย, Wallet, หมวดหมู่ (พร้อมไอคอน/สี), วันที่ (ปฏิทิน), รายละเอียด
- **Wallet** — แสดงยอดคงเหลือจริงของแต่ละ Wallet, เพิ่ม/แก้ไข/ลบ Wallet, โอนเงินระหว่าง Wallet (รองรับต่างสกุลเงิน)
- **รายงาน** — สรุปรายรับ/รายจ่าย/คงเหลือรายเดือน พร้อมกราฟแท่งแยกตามหมวดหมู่ (สลับดูรายรับ/รายจ่ายได้)
- **เพิ่มเติม** — จัดการหมวดหมู่ (เพิ่ม/แก้ไข/ลบ/เปิดปิดใช้งาน), ตั้งค่าภาษา (ไทย/อังกฤษ ที่ใช้ได้จริงทั้งแอป), ล้างข้อมูลทั้งหมด, หน้าข้อมูลแอป
- แก้ปัญหาที่ Month/Year picker ไม่ได้กรองข้อมูลจริง และเพิ่มหมวดหมู่ตัวอย่างเพิ่มเติมในข้อมูลตั้งต้น

ทดสอบผ่าน `npx tsc --noEmit` และ `npx expo lint` แล้วไม่มี error (มี warning เดียวที่ไม่กระทบการทำงาน)


This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
