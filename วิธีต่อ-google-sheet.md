# วิธีต่อแบบทดสอบเข้ากับ Google Sheet (ทำครั้งเดียว ~5 นาที)

ควิซในเว็บทำงานได้เลยทันที (ตรวจคะแนนอัตโนมัติ) — ขั้นตอนนี้คือการทำให้คะแนน
"ถูกบันทึกลง Google Sheet อัตโนมัติ" ทุกครั้งที่พนักงานส่งคำตอบ

---

## ขั้นที่ 1 — สร้าง Google Sheet
1. ไปที่ [sheets.new](https://sheets.new) (สร้างชีตใหม่)
2. ตั้งชื่อไฟล์ เช่น **"คะแนนแบบทดสอบพนักงาน PPH"**
   *(ไม่ต้องสร้างหัวตารางเอง ระบบจะสร้างให้อัตโนมัติ)*

## ขั้นที่ 2 — ติดตั้งสคริปต์
1. ในหน้า Google Sheet → เมนู **Extensions** → **Apps Script**
2. ลบโค้ดเดิมที่มีทั้งหมดออก
3. เปิดไฟล์ **google-apps-script.gs** (อยู่ในโฟลเดอร์เดียวกันนี้) → คัดลอกทั้งหมด → วางลงไป
4. กดไอคอน 💾 (Save)

## ขั้นที่ 3 — Deploy เป็น Web app
1. มุมขวาบน กด **Deploy** → **New deployment**
2. กดไอคอนเฟือง ⚙️ ข้างคำว่า "Select type" → เลือก **Web app**
3. ตั้งค่า:
   - **Description:** quiz (อะไรก็ได้)
   - **Execute as:** `Me` (อีเมลของคุณ)
   - **Who has access:** `Anyone` ⬅️ **สำคัญมาก ต้องเลือกอันนี้**
4. กด **Deploy**
5. ครั้งแรกจะให้ Authorize → กด **Authorize access** → เลือกบัญชี →
   ถ้าขึ้น "Google hasn't verified" ให้กด **Advanced** → **Go to (ชื่อโปรเจกต์) (unsafe)** → **Allow**
6. คัดลอก **Web app URL** ที่ได้ (ลงท้ายด้วย `/exec`)

## ขั้นที่ 4 — นำ URL มาใส่ในเว็บ
1. เปิดไฟล์ **index.html**
2. กด Ctrl+F (หรือ Cmd+F) ค้นหาคำว่า `SHEET_WEBHOOK`
3. จะเจอบรรทัด:
   ```js
   const SHEET_WEBHOOK = ""; // ⬅️ วางลิงก์ Apps Script Web app ที่นี่
   ```
4. วาง URL ที่คัดลอกมาไว้ในเครื่องหมายคำพูด เช่น:
   ```js
   const SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycb...../exec";
   ```
5. บันทึกไฟล์ แล้ว push ขึ้น GitHub (ดูคำสั่งด้านล่าง)

## ขั้นที่ 5 — push ขึ้น GitHub
```bash
cd "/Users/perfectpethouse_bkk/Desktop/เอกสารร้าน PPH/Education PPH/สร้าง wep สำหรับให้พนักงานศึกษา"
git add index.html
git commit -m "Connect quiz to Google Sheet"
git push
```

---

## ทดสอบว่าใช้ได้
1. เปิดเว็บ → ไปหน้าแบบทดสอบ → ใส่ชื่อ → ทำให้ครบ → กดส่ง
2. ถ้าสำเร็จ จะขึ้นข้อความ **"✅ บันทึกคะแนน...ลง Google Sheet เรียบร้อยแล้ว"**
3. กลับไปดูที่ Google Sheet → จะมีแถวคะแนนใหม่เพิ่มในแท็บ **"คะแนน"**

ตารางจะเก็บ: เวลาที่ทำ · ชื่อ · คะแนน · เต็ม · เปอร์เซ็นต์ · ผ่าน/ไม่ผ่าน · คำตอบข้อเขียน

---

## หมายเหตุ
- **ข้อเขียน (ข้อ 15)** ระบบเก็บคำตอบให้ แต่ไม่ตรวจอัตโนมัติ — หัวหน้าเปิด Google Sheet อ่านและให้คะแนนเอง
- ถ้าแก้โค้ดใน Apps Script ภายหลัง ต้อง **Deploy → Manage deployments → แก้ไข (ดินสอ) → Version: New version → Deploy** เพื่อให้ URL เดิมอัปเดต
- เกณฑ์ผ่านปัจจุบัน = ตอบถูก 11/14 ข้อ (แก้ได้ที่ตัวแปร `PASS_SCORE` ใน index.html)
