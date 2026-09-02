// https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite ใช้ WebAssembly (wa-sqlite) เวลารันบนเว็บ ต้องบอก Metro ให้รู้จัก
// นามสกุลไฟล์ .wasm เป็น asset ก่อน ไม่งั้น bundle ตอน build เว็บจะพังทันที
config.resolver.assetExts.push('wasm');

// wa-sqlite ใช้ SharedArrayBuffer ซึ่งเบราว์เซอร์จะอนุญาตก็ต่อเมื่อหน้าเว็บถูกเสิร์ฟแบบ
// "cross-origin isolated" เท่านั้น (ต้องมี header ทั้งคู่นี้พร้อมกัน) — ตั้งไว้สำหรับตอน
// รัน dev server ในเครื่อง ส่วนตอน deploy ขึ้นโฮสติ้งจริงต้องตั้ง header เดียวกันนี้ที่ฝั่ง
// เว็บเซิร์ฟเวอร์/โฮสติ้งเองด้วย (ดูรายละเอียดท้ายไฟล์นี้)
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      return middleware(req, res, next);
    };
  },
};

module.exports = config;

// หมายเหตุสำหรับตอน deploy จริง (เช่น Netlify, Vercel, GitHub Pages):
// ให้ตั้ง response header ต่อไปนี้ที่ฝั่งโฮสติ้งสำหรับทุกไฟล์ที่เสิร์ฟด้วย:
//   Cross-Origin-Embedder-Policy: credentialless
//   Cross-Origin-Opener-Policy: same-origin
// ถ้าไม่ตั้ง ฐานข้อมูล SQLite จะเปิดไม่ได้เลยตอนใช้งานจริงบนเว็บ (จะเจอ error
// เดียวกับตอน build ไม่ผ่านที่เจอระหว่างพัฒนา)
