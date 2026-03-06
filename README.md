# risca-tap-nfc-app 📱

Mobile application for configuring and managing NFC cards for advertising purposes. Built with React Native + Expo for iOS and Android.

---

## 🗂 Project Overview

This app is part of the **Risca Tap** ecosystem, a suite of 4 repositories:

| Repository | Stack | Description |
|------------|-------|-------------|
| `risca-tap-nfc-app` | React Native + Expo | Mobile app (this repo) |
| `risca-tap-panel` | React + Vite | Admin dashboard |
| `risca-tap-server` | TBD | Backend + API |
| `risca-tap-web` | TBD | Landing page |

---

## ⚙️ Tech Stack

- **React Native** + **Expo SDK 54**
- **Expo Router** — file-based navigation
- **Redux Toolkit** + **React Redux** — global state management
- **i18next** + **react-i18next** — internationalization (EN / ES)
- **expo-localization** — auto-detects device language
- **react-native-toast-message** — toast notifications
- **@expo/vector-icons** (Ionicons) — icon library

---

## 📁 Project Structure

```
risca-tap-nfc-app/
│
├── app/                        # Expo Router — file-based routes
│   ├── _layout.jsx             # Root layout + Redux Provider
│   ├── index.jsx               # Auth redirect
│   ├── (auth)/
│   │   └── login.jsx           # Login screen
│   └── (app)/
│       ├── _layout.jsx         # Tab navigator
│       ├── home.jsx            # NFC cards list
│       ├── config.jsx          # Configure NFC card
│       ├── profile.jsx         # User profile
│       └── settings.jsx        # Theme & language settings
│
├── store/                      # Redux Toolkit
│   ├── index.js                # Store configuration
│   └── slices/
│       ├── authSlice.js        # Authentication state
│       └── settingsSlice.js    # Theme & language state
│
├── hooks/
│   └── useTheme.js             # Dynamic theme hook
│
├── constants/
│   └── theme.js                # Light & dark theme palettes
│
├── config/
│   └── i18n.js                 # i18next configuration
│
├── locales/
│   ├── en.json                 # English translations
│   └── es.json                 # Spanish translations
│
└── .npmrc                      # legacy-peer-deps=true
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your device ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/risca-tap-nfc-app.git
cd risca-tap-nfc-app

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npx expo start
```

Scan the QR code with Expo Go to open the app on your device.

---

## 🌍 Internationalization

The app auto-detects the device language on startup. Supported languages:

| Language | Code | Default |
|----------|------|---------|
| English | `en` | ✅ Fallback |
| Spanish | `es` | — |

Language can be changed manually from **Profile → Settings**.

---

## 🎨 Theming

The app supports 3 theme modes, configurable from **Profile → Settings**:

| Mode | Description |
|------|-------------|
| `dark` | Dark background, optimized for low-light |
| `light` | Light background, classic look |
| `system` | Follows the device system setting |

### Color Palette (60-30-10 rule)

| % | Role | Dark | Light |
|---|------|------|-------|
| 60% | Background | `#0d0d0d` | `#ffffff` |
| 30% | Surfaces / Cards | `#1a1a1a` | `#f5f5f5` |
| 10% | Accent (primary) | `#8333ec` | `#8333ec` |

---

## 🔐 Authentication

Currently uses **mock authentication** (no backend required for demo).

```js
// Mock user injected on login
{
  id: '1',
  name: 'Juan Pérez',
  email: 'juan@risca.mx',
  role: 'client'
}
```

Real authentication will be connected once `risca-tap-server` is ready.

---

## 📡 NFC

NFC read/write functionality requires a **native build** (not available in Expo Go).

Planned implementation:
- Library: `react-native-nfc-manager`
- Supported chip: **NXP NTAG215** (504 bytes, ISO 14443A, 13.56 MHz)
- Operations: Read UID, Write URL, Check compatibility

---

## 👥 User Roles

| Role | Access |
|------|--------|
| `client` | Mobile app — manage their own NFC cards |
| `admin` | Web dashboard (`risca-tap-panel`) — manage all cards and clients |

---

## 📦 Dependencies

```json
{
  "expo": "~54.0.0",
  "expo-router": "~6.0.0",
  "expo-localization": "~18.0.0",
  "expo-linking": "~8.0.0",
  "expo-constants": "~18.0.0",
  "@reduxjs/toolkit": "^2.x",
  "react-redux": "^9.x",
  "i18next": "^23.x",
  "react-i18next": "^14.x",
  "react-native-toast-message": "^2.x"
}
```

---

## 📋 Roadmap

- [x] Project structure & navigation
- [x] Redux Toolkit setup
- [x] i18n (EN / ES)
- [x] Light / Dark / System theme
- [x] Toast notifications
- [x] Mock authentication flow
- [x] Home, Config, Profile, Settings screens
- [ ] Backend integration (`risca-tap-server`)
- [ ] Real authentication (JWT)
- [ ] NFC read/write (native build)
- [ ] Push notifications
- [ ] Admin panel (`risca-tap-panel`)

---

## 🏢 About

Developed by **[Homidev](https://github.com/homidev)** for **Risca Studio**.

> risca**tap** — Connect your business with a single tap.