# Hướng dẫn cài đặt Image Management System

## Bước 1: Cài đặt dependencies cơ bản

\`\`\`bash
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-checkbox
npm install @radix-ui/react-collapsible @radix-ui/react-separator
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install tailwindcss-animate
\`\`\`

## Bước 2: Setup shadcn/ui (nếu chưa có)

\`\`\`bash
npx shadcn@latest init
npx shadcn@latest add button card dialog select badge input
npx shadcn@latest add checkbox collapsible separator
\`\`\`

## Bước 3: Copy files vào project

1. Copy `app/images/page.jsx` vào thư mục `app/images/` của bạn
2. Copy `app/globals.css` (hoặc merge với file CSS hiện tại)
3. Copy `tailwind.config.js` (hoặc merge với config hiện tại)

## Bước 4: Đảm bảo shadcn/ui components tồn tại

Kiểm tra các file sau có tồn tại trong `components/ui/`:
- button.jsx
- card.jsx  
- dialog.jsx
- select.jsx
- badge.jsx
- input.jsx
- checkbox.jsx
- collapsible.jsx
- separator.jsx

## Bước 5: Test

\`\`\`bash
npm run dev
\`\`\`

Truy cập: http://localhost:3000/images

## Lưu ý quan trọng:

✅ **Đã convert hoàn toàn sang JavaScript**
✅ **Không phá vỡ giao diện hiện tại**  
✅ **Giữ nguyên tất cả chức năng**
✅ **Tương thích với Next.js JavaScript**
✅ **Bao gồm tất cả dependencies cần thiết**
