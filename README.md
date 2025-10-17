# SME 會計總帳 + 進銷存系統

> 一個為中小企業設計的現代化會計與庫存管理系統  
> 基於 React + TypeScript + Vite 構建，採用複式記帳原則與平均成本法

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)

---

## 📋 目錄

- [項目概述](#-項目概述)
- [文件結構](#-文件結構)
- [核心功能](#-核心功能)
- [技術棧](#-技術棧)
- [快速開始](#-快速開始)
- [系統架構](#-系統架構)
- [數據模型](#-數據模型)
- [開發歷程](#-開發歷程)
- [使用說明](#-使用說明)

---

## 🎯 項目概述

這是一個專為中小企業 (SME) 設計的**會計總帳與進銷存整合系統**，提供完整的業務管理功能：

- ✅ **進銷存管理**：商品管理、庫存追蹤、平均成本計算
- ✅ **複式記帳**：自動生成會計傳票、科目餘額管理
- ✅ **財務報表**：試算表、損益表、資產負債表、庫存估價表
- ✅ **數據持久化**：LocalStorage 存儲（計劃遷移至 Verico 雲端數據庫）
- ✅ **響應式設計**：支持桌面和移動設備

### 🌟 特色亮點

| 特色 | 說明 |
|------|------|
| **零後端啟動** | 純前端應用，無需配置數據庫即可使用 |
| **自動化會計** | 交易自動生成平衡的會計分錄 |
| **實時報表** | 數據變動立即反映在所有報表中 |
| **數據可攜** | 一鍵匯出/匯入 JSON 備份 |
| **中文優化** | 完整繁體中文界面，符合台灣會計慣例 |

---

## 📂 文件結構

```
10-16 sme_會計總帳_進銷存/
│
├── 📄 配置文件
│   ├── package.json                    # 項目依賴配置
│   ├── tsconfig.json                   # TypeScript 配置
│   ├── vite.config.ts                  # Vite 構建配置
│   ├── tailwind.config.ts              # Tailwind CSS 配置
│   ├── eslint.config.js                # ESLint 規則
│   ├── postcss.config.js               # PostCSS 配置
│   ├── components.json                 # shadcn/ui 組件配置
│   └── index.html                      # HTML 入口
│
├── 📂 public/                          # 靜態資源
│   ├── placeholder.svg
│   └── robots.txt
│
├── 📂 src/                             # 源代碼目錄
│   ├── main.tsx                        # 應用入口
│   ├── App.tsx                         # 根組件（路由配置）
│   ├── App.css                         # 應用樣式
│   ├── index.css                       # 全局樣式
│   │
│   ├── 📂 pages/                       # 頁面組件
│   │   ├── Dashboard.tsx               # ✅ 儀表板總覽
│   │   ├── Items.tsx                   # 📦 商品/存貨管理
│   │   ├── Sales.tsx                   # 🛒 銷售開票
│   │   ├── Purchases.tsx               # 🛍️ 採購入庫
│   │   ├── Partners.tsx                # 👥 客戶/供應商管理
│   │   ├── Accounting.tsx              # 📋 傳票與科目
│   │   ├── Reports.tsx                 # 📊 財務報表
│   │   ├── SettingsPage.tsx            # ⚙️ 系統設定
│   │   ├── Index.tsx                   # (未使用)
│   │   └── NotFound.tsx                # 404 頁面
│   │
│   ├── 📂 components/
│   │   ├── Layout.tsx                  # 主佈局組件
│   │   │                               #   - Header + Sidebar + Content
│   │   │                               #   - 數據匯出/匯入/重設功能
│   │   │
│   │   └── 📂 ui/                      # shadcn/ui 組件庫 (40+)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       └── ... (其他 33 個組件)
│   │
│   ├── 📂 contexts/
│   │   ├── DataContext.tsx             # ⭐ 核心數據管理 (389 行)
│   │   │                               #   - 全局狀態管理
│   │   │                               #   - LocalStorage 持久化
│   │   │                               #   - 商品/交易/會計邏輯
│   │   │                               #   - 自動傳票生成
│   │   │                               #   - 平均成本計算
│   │   └── ThemeContext.tsx            # 主題管理
│   │
│   ├── 📂 hooks/
│   │   ├── use-mobile.tsx              # 響應式檢測
│   │   └── use-toast.ts                # Toast 通知
│   │
│   └── 📂 lib/
│       └── utils.ts                    # 工具函數
│
├── 📂 node_modules/                    # 依賴包目錄
│
├── 📂 lovable-project-955bb224/        # 在 "lovable.dev" 重建的初版檔案
│   └── (完整的 Lovable 初版項目)
│
├── 📄 sme_會計總帳_進銷存（初始版本）.html
│   # 你提供的最原始代碼內容
│   # - 單一 HTML 文件實現
│   # - 純 JavaScript（無框架）
│   # - 完整會計邏輯原型
│
└── 📄 sme_會計總帳_進銷存_系統解析文檔.md
    # 解析你所提供的原始代碼內容，所生成的完整深度分析文檔
    # - 550 行詳細技術文檔
    # - 業務邏輯完整解析
    # - 會計原理說明
```

---

## 🚀 核心功能

### 1. 商品與庫存管理
- **商品 CRUD**：料號、名稱、類別、數量、平均成本
- **庫存追蹤**：即時庫存數量與價值統計
- **搜尋功能**：支持料號、名稱快速搜尋
- **平均成本法**：採購時自動更新加權平均成本

### 2. 進銷存交易
- **銷售開票**：
  - 選擇客戶、輸入商品明細
  - 自動檢查庫存數量
  - 支持現金/賒帳付款方式
  - 自動生成銷售傳票與結轉成本
  
- **採購入庫**：
  - 選擇供應商、輸入採購明細
  - 自動更新商品平均成本
  - 支持現金/賒帳付款方式
  - 自動生成採購傳票

### 3. 會計系統
- **自動傳票生成**：每筆交易自動產生複式記帳分錄
- **科目餘額管理**：8 個預設會計科目，自動計算餘額
- **借貸平衡**：系統保證借方總額 = 貸方總額

#### 預設會計科目表 (COA)
```
資產類：1001 現金/銀行、1100 應收帳款、1400 存貨
負債類：2100 應付帳款、2300 營業稅應付
權益類：3000 業主權益
收入類：4000 銷貨收入
費用類：5000 銷貨成本
```

### 4. 財務報表
- **試算表 (Trial Balance)**：驗證借貸平衡
- **損益表 (P&L)**：營業收入 - 銷貨成本 = 本期損益
- **資產負債表 (Balance Sheet)**：資產 = 負債 + 權益
- **庫存估價表**：各商品庫存金額明細

### 5. 數據管理
- **匯出備份**：JSON 格式完整數據匯出
- **匯入還原**：從備份檔案還原數據
- **重設功能**：一鍵清空數據，恢復預設狀態
- **LocalStorage**：瀏覽器本地持久化存儲

---

## 🛠️ 技術棧

### 核心框架
- **React 18.3** - UI 框架
- **TypeScript 5.8** - 類型安全
- **Vite 5.4** - 構建工具
- **React Router 6.30** - 路由管理

### UI 組件
- **shadcn/ui** - 基於 Radix UI 的組件庫
- **Tailwind CSS 3.4** - 原子化 CSS
- **Lucide React** - 圖標庫
- **Recharts 2.15** - 圖表庫

### 狀態管理
- **Context API** - 全局狀態
- **React Query 5.83** - 服務器狀態（預留）

### 表單處理
- **React Hook Form 7.61** - 表單管理
- **Zod 3.25** - 數據驗證

### 工具庫
- **date-fns 3.6** - 日期處理
- **sonner 1.7** - Toast 通知

---

## ⚡ 快速開始

### 環境要求
- Node.js 18.x 或更高版本
- npm 或 pnpm

### 安裝步驟

```bash
# 1. 克隆項目
git clone <your-repo-url>
cd 10-16\ sme_會計總帳_進銷存

# 2. 安裝依賴
npm install

# 3. 啟動開發服務器
npm run dev

# 4. 瀏覽器訪問
# http://localhost:8080
```

### 可用腳本

```bash
npm run dev          # 開發服務器 (localhost:8080)
npm run build        # 生產構建
npm run build:dev    # 開發模式構建
npm run lint         # 代碼檢查
npm run preview      # 預覽構建結果
```

---

## 🏗️ 系統架構

### 數據流架構

```
用戶操作 → 頁面組件 → DataContext → LocalStorage
                         ↓
                  自動生成會計傳票
                         ↓
                  更新庫存/科目餘額
```

### 核心邏輯：DataContext

`DataContext.tsx` 是整個系統的核心，負責：

1. **狀態管理**
   - Settings（公司設定）
   - Items（商品庫存）
   - Partners（客戶/供應商）
   - Transactions（交易記錄）
   - JournalEntries（會計傳票）
   - Accounts（會計科目）

2. **業務邏輯**
   - `processSalesTransaction()` - 處理銷售交易
   - `processPurchaseTransaction()` - 處理採購交易
   - `updateAccountBalances()` - 更新科目餘額
   - `adjustAvgCost()` - 平均成本計算

3. **數據持久化**
   - `localStorage.setItem()` - 自動保存
   - `localStorage.getItem()` - 自動載入
   - `exportData()` / `importData()` - 匯出/匯入

---

## 📊 數據模型

### Settings（系統設定）
```typescript
{
  companyName: string    // 公司名稱
  currency: string       // 幣別符號 (預設 NT$)
  taxRate: number        // 營業稅率 (預設 5%)
}
```

### Item（商品）
```typescript
{
  id: string
  code: string           // 料號
  name: string           // 品名
  category: string       // 類別
  quantity: number       // 庫存數量
  averageCost: number    // 平均成本（採購時自動計算）
}
```

### Transaction（交易）
```typescript
{
  id: string
  date: string
  number: string         // 單號 (S/P + 民國年月日 + 序號)
  type: 'sales' | 'purchase'
  partnerId: string
  partnerName: string
  paymentMethod: 'cash' | 'credit'
  lines: TransactionLine[]
  subtotal: number       // 未稅小計
  tax: number           // 營業稅
  total: number         // 含稅總額
}
```

### JournalEntry（會計傳票）
```typescript
{
  id: string
  date: string
  reference: string      // 單據編號
  lines: [{
    accountCode: string  // 科目代碼
    accountName: string  // 科目名稱
    debit: number       // 借方
    credit: number      // 貸方
  }]
}
```

---

## 📈 開發歷程

### Version 1.0 - 原型階段
- **檔案**：`sme_會計總帳_進銷存（初始版本）.html`
- **技術**：純 HTML + CSS + JavaScript
- **特點**：單一檔案、零依賴、完整業務邏輯

### Version 2.0 - Lovable 遷移
- **目錄**：`lovable-project-955bb224/`
- **平台**：使用 Lovable.dev 快速生成
- **技術**：React + TypeScript 重構

### Version 3.0 - 當前版本
- **優化**：完整的 TypeScript 類型定義
- **增強**：shadcn/ui 組件庫、響應式設計
- **計劃**：遷移至 Verico 雲端數據庫

---

## 📖 使用說明

### 1. 初始設定
1. 進入「設定」頁面
2. 設置公司名稱、幣別、稅率
3. 系統自動保存設定

### 2. 建立基礎資料
1. **新增客戶/供應商**：在「客戶/供應商」頁面添加
2. **新增商品**：在「商品/存貨」頁面設定料號、名稱、初始庫存

### 3. 日常作業流程

#### 採購流程
```
採購入庫 → 選擇供應商 → 輸入商品明細 → 登錄
→ 自動更新平均成本 → 增加庫存 → 生成傳票
```

#### 銷售流程
```
開立發票 → 選擇客戶 → 輸入商品明細 → 檢查庫存
→ 登錄 → 減少庫存 → 結轉成本 → 生成傳票
```

### 4. 查看報表
- **總覽**：查看本月銷售、庫存價值、毛利率
- **傳票 & 科目**：檢視所有會計分錄與科目餘額
- **報表**：試算表、損益表、資產負債表、庫存估價

### 5. 數據管理
- **定期備份**：建議每週點擊「匯出」備份數據
- **換設備**：匯出 JSON → 新設備匯入
- **重設系統**：點擊「重設」清空所有數據

---

## ⚠️ 注意事項

### 數據安全
- ✅ 定期匯出 JSON 備份檔案
- ✅ 備份檔案存放於雲端硬碟
- ⚠️ LocalStorage 資料綁定特定瀏覽器
- ⚠️ 清除瀏覽器資料會遺失所有記錄

### 系統限制
- **單機使用**：無多人協作功能
- **無編輯功能**：已登錄交易無法修改（需手動編輯 JSON）
- **數據規模**：建議商品 < 1000、交易 < 5000 筆

### 適用場景
✅ 個人工作室、小型商店、會計教學、原型驗證  
❌ 大型企業、多人協作、複雜會計需求

---

## 🔮 未來規劃(AI生成 無審稿喔)

- [ ] 遷移至 **Verico 雲端數據庫**
- [ ] 多用戶權限管理
- [ ] 應收應付帳款管理
- [ ] 退貨與調整功能
- [ ] PDF 報表匯出
- [ ] 多倉庫支持
- [ ] 批次號追蹤

