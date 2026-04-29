import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, useTexture } from '@react-three/drei'
import { motion, useAnimation } from 'framer-motion'
import mapboxgl from 'mapbox-gl'
import * as THREE from 'three'
import countries from 'world-countries'
import { feature as topojsonFeature } from 'topojson-client'
import { geoArea, geoCentroid, geoContains } from 'd3-geo'
import worldAtlas from 'world-atlas/countries-10m.json'
import AIChat from './ai/AI-Chat'
import 'mapbox-gl/dist/mapbox-gl.css'

const INTRO_MS = 2000
const EARTH_RADIUS = 1.12
const EARTH_AXIAL_TILT_DEG = 23.4
const EARTH_MAX_PITCH_DEG = 52
const PRELUDE_GLITCH_MS = 3000
const PRELUDE_SLOGAN_HOLD_MS = 2000
const PRELUDE_FADE_MS = 800
const GLOBE_TO_MAP_TRANSITION_MS = 1200
const SLOGAN_TEXT = 'Travel Smarter, Experience Richer.'
const DEFAULT_MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v11'
const DEFAULT_GUIDE_AUDIO_URL = '/assets/audio/global-guide-welcome.mp3'
const CINEMATIC_3D_BUILDINGS_LAYER_ID = 'cinematic-3d-buildings'
const DEFAULT_CINEMATIC_TUNING = {
  roadBaseOpacity: 0.22,
  roadBoostOpacity: 0.7,
  poiStartZoom: 9.5,
  poiZoomRange: 4.5,
  buildingStartZoom: 11.8,
  buildingZoomRange: 2.8,
  buildingMaxOpacity: 0.48,
  smallCountryAreaThreshold: 0.0014,
}
const PRODUCTION_PRESETS = {
  immersive: {
    label: '沉浸版',
    transitionDurationMs: 1700,
    controlFeel: 'cinema',
    tuning: {
      roadBaseOpacity: 0.24,
      roadBoostOpacity: 0.9,
      poiStartZoom: 8.8,
      poiZoomRange: 4.8,
      buildingStartZoom: 11.3,
      buildingZoomRange: 2.6,
      buildingMaxOpacity: 0.62,
      smallCountryAreaThreshold: 0.0018,
    },
  },
  performance: {
    label: '性能版',
    transitionDurationMs: 1000,
    controlFeel: 'globe',
    tuning: {
      roadBaseOpacity: 0.2,
      roadBoostOpacity: 0.55,
      poiStartZoom: 10.4,
      poiZoomRange: 3.9,
      buildingStartZoom: 12.4,
      buildingZoomRange: 2.3,
      buildingMaxOpacity: 0.28,
      smallCountryAreaThreshold: 0.0012,
    },
  },
  minimal: {
    label: '极简版',
    transitionDurationMs: 900,
    controlFeel: 'soft',
    tuning: {
      roadBaseOpacity: 0.16,
      roadBoostOpacity: 0.38,
      poiStartZoom: 11.4,
      poiZoomRange: 3.2,
      buildingStartZoom: 13.4,
      buildingZoomRange: 1.8,
      buildingMaxOpacity: 0.16,
      smallCountryAreaThreshold: 0.0009,
    },
  },
}
const DEV_STORAGE_KEYS = {
  morphDuration: 'roamwise-dev-morph-duration-ms-v1',
  morphTheme: 'roamwise-dev-morph-theme-v1',
  cinematicTuning: 'roamwise-dev-cinematic-tuning-v1',
}

function normalizePresetKey(value) {
  const k = String(value || '').trim().toLowerCase()
  return Object.prototype.hasOwnProperty.call(PRODUCTION_PRESETS, k) ? k : ''
}

function syncPresetToUrl(presetKey) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (!presetKey || presetKey === 'custom') url.searchParams.delete('preset')
  else url.searchParams.set('preset', presetKey)
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
}
const COUNTRY_CULTURE_OVERRIDES = {
  JPN: { localGreeting: 'ようこそ', localGreetingZh: '欢迎来到日本', icon: '🌸', motif: '樱花夜景' },
  FRA: { localGreeting: 'Bienvenue', localGreetingZh: '欢迎来到法国', icon: '🗼', motif: '铁塔街景' },
  ITA: { localGreeting: 'Benvenuto', localGreetingZh: '欢迎来到意大利', icon: '🍝', motif: '广场慢生活' },
  ESP: { localGreeting: 'Bienvenido', localGreetingZh: '欢迎来到西班牙', icon: '💃', motif: '热情街区' },
  DEU: { localGreeting: 'Willkommen', localGreetingZh: '欢迎来到德国', icon: '🏰', motif: '古堡铁路' },
  GBR: { localGreeting: 'Welcome', localGreetingZh: '欢迎来到英国', icon: '🎡', motif: '城市博物馆线' },
  USA: { localGreeting: 'Welcome', localGreetingZh: '欢迎来到美国', icon: '🛣️', motif: '城市公路线' },
  CAN: { localGreeting: 'Welcome', localGreetingZh: '欢迎来到加拿大', icon: '🍁', motif: '湖区风景' },
  BRA: { localGreeting: 'Bem-vindo', localGreetingZh: '欢迎来到巴西', icon: '🎉', motif: '海岸节奏' },
  MEX: { localGreeting: 'Bienvenido', localGreetingZh: '欢迎来到墨西哥', icon: '🌮', motif: '老城市集' },
  EGY: { localGreeting: 'أهلا وسهلا', localGreetingZh: '欢迎来到埃及', icon: '🕌', motif: '尼罗河文明' },
  MAR: { localGreeting: 'أهلا وسهلا', localGreetingZh: '欢迎来到摩洛哥', icon: '🧿', motif: '蓝城巷道' },
  ZAF: { localGreeting: 'Welcome', localGreetingZh: '欢迎来到南非', icon: '🦁', motif: '自然观景' },
  AUS: { localGreeting: 'Welcome', localGreetingZh: '欢迎来到澳大利亚', icon: '🪃', motif: '海岸步道' },
  NZL: { localGreeting: 'Welcome', localGreetingZh: '欢迎来到新西兰', icon: '🗻', motif: '山湖步道' },
  THA: { localGreeting: 'ยินดีต้อนรับ', localGreetingZh: '欢迎来到泰国', icon: '🛕', motif: '夜市寺庙' },
  VNM: { localGreeting: 'Chào mừng', localGreetingZh: '欢迎来到越南', icon: '🏮', motif: '古镇河灯' },
  KOR: { localGreeting: '환영합니다', localGreetingZh: '欢迎来到韩国', icon: '🌙', motif: '韩屋夜色' },
  TUR: { localGreeting: 'Hoş geldiniz', localGreetingZh: '欢迎来到土耳其', icon: '🧿', motif: '海峡晨昏' },
  GRC: { localGreeting: 'Καλώς ήρθατε', localGreetingZh: '欢迎来到希腊', icon: '⛵', motif: '爱琴海风' },
}
const MORPH_THEME = {
  sky: { stroke: 'rgba(56,189,248,0.95)', fill: 'rgba(14,165,233,0.28)', glow: 'rgba(56,189,248,0.55)', chip: 'border-sky-300/70 bg-sky-500/25 text-sky-100' },
  violet: { stroke: 'rgba(192,132,252,0.95)', fill: 'rgba(147,51,234,0.26)', glow: 'rgba(196,181,253,0.6)', chip: 'border-violet-300/70 bg-violet-500/25 text-violet-100' },
  mint: { stroke: 'rgba(45,212,191,0.95)', fill: 'rgba(16,185,129,0.24)', glow: 'rgba(45,212,191,0.55)', chip: 'border-emerald-300/70 bg-emerald-500/25 text-emerald-100' },
}
const EARTH_TEXTURES = {
  day: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
  normal: 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
  specular: 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
}
const DRAG_SENSITIVITY = {
  slow: 0.0055,
  normal: 0.008,
  fast: 0.0115,
}
const INERTIA_DAMPING = {
  light: 0.86,
  medium: 0.93,
  heavy: 0.965,
}
const NEAREST_COUNTRY_SNAP_KM = 900
const CLICK_SELECT_MAX_MOVE_PX = 22
const DRAG_INERTIA_ENABLE_MOVE_PX = 18
const DRAG_INERTIA_MIN_VELOCITY_PX = 2.2
const MAX_ROTATION_STEP_RAD = 0.06
const MAX_PITCH_STEP_RAD = 0.03
const DRAG_START_THRESHOLD_PX = 7
const CLICK_ROTATION_LOCK_MS = 500
const INTERACTION_PROFILES = {
  click: { inertiaMovePx: 28, inertiaMinVelocityPx: 3.4, idleResumeMs: 1700 },
  balanced: { inertiaMovePx: DRAG_INERTIA_ENABLE_MOVE_PX, inertiaMinVelocityPx: DRAG_INERTIA_MIN_VELOCITY_PX, idleResumeMs: 1200 },
  drag: { inertiaMovePx: 10, inertiaMinVelocityPx: 1.2, idleResumeMs: 800 },
}
const DISABLE_DRAG_INERTIA = true
/** 空闲时是否让地球纹理缓慢自转；关闭可避免“没碰也在动”的观感 */
const EARTH_IDLE_AUTO_ROTATE = 0
/** 选中国家后延迟再启动相机对焦，避免松手瞬间镜头漂移被误认为地球在滑 */
const CAMERA_FOCUS_SETTLE_MS = 750
const EAST_ASIA_SAFE_CCA3 = ['CHN', 'JPN', 'KOR', 'PRK', 'TWN', 'MNG']
const EAST_ASIA_FALLBACK_MAX_KM = 1400
const SMALL_ISLAND_FALLBACK_CCA3 = new Set([
  'BHS',
  'COM',
  'CPV',
  'CUB',
  'FJI',
  'KIR',
  'MHL',
  'MLT',
  'PHL',
  'PLW',
  'SLB',
  'STP',
  'SYC',
  'TON',
  'TTO',
  'VCT',
  'VUT',
  'WSM',
])
const SMALL_ISLAND_FALLBACK_MAX_KM = 1700
const MICROSTATE_HINTS = [
  { cca3: 'ISR', lat: 31.5, lng: 34.9, maxKm: 65, box: { latMin: 29.4, latMax: 33.6, lngMin: 34.1, lngMax: 35.9 } },
  { cca3: 'KWT', lat: 29.3, lng: 47.6, maxKm: 220, box: { latMin: 28.2, latMax: 31.8, lngMin: 46.2, lngMax: 49.2 } },
  { cca3: 'LIE', lat: 47.14, lng: 9.55, maxKm: 45, box: { latMin: 46.9, latMax: 47.3, lngMin: 9.45, lngMax: 9.7 } },
  { cca3: 'SMR', lat: 43.94, lng: 12.45, maxKm: 28, box: { latMin: 43.85, latMax: 44.05, lngMin: 12.38, lngMax: 12.55 } },
  { cca3: 'VAT', lat: 41.902, lng: 12.453, maxKm: 6, box: { latMin: 41.88, latMax: 41.92, lngMin: 12.43, lngMax: 12.47 } },
]
const MICRO_CLICK_ASSIST = [
  { cca3: 'KWT', box: { latMin: 28.4, latMax: 31.2, lngMin: 46.3, lngMax: 49.0 } },
  { cca3: 'SMR', box: { latMin: 43.84, latMax: 44.08, lngMin: 12.34, lngMax: 12.58 } },
  { cca3: 'VAT', box: { latMin: 41.87, latMax: 41.93, lngMin: 12.42, lngMax: 12.48 } },
]
const MAX_REASONABLE_COUNTRY_AREA = 1.2

function easeOutBack(t) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function cartesianToLatLng(point, radius = EARTH_RADIUS) {
  const p = point.clone().normalize().multiplyScalar(radius)
  const lat = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(p.y / radius, -1, 1)))
  // Keep inverse mapping consistent with lonLatToVector3 (z axis is flipped).
  const lng = THREE.MathUtils.radToDeg(Math.atan2(-p.z, p.x))
  return { lat, lng }
}

function cartesianToLatLngAlt(point, radius = EARTH_RADIUS) {
  const p = point.clone().normalize().multiplyScalar(radius)
  const lat = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(p.y / radius, -1, 1)))
  const lng = THREE.MathUtils.radToDeg(Math.atan2(p.z, -p.x))
  return { lat, lng }
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function findNearestCountry(lat, lng, countryCentroids) {
  if (!countryCentroids.length) return null
  let best = null
  let minDist = Infinity
  for (const c of countryCentroids) {
    const dist = haversineKm(lat, lng, c.lat, c.lng)
    if (dist < minDist) {
      minDist = dist
      best = c
    }
  }
  return best ? { ...best, distanceKm: minDist } : null
}

function normalizeNumericCode(value) {
  if (value == null) return null
  const s = String(value).trim()
  if (!s) return null
  return s.padStart(3, '0')
}

function hashString(input) {
  const s = String(input || '')
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h >>> 0)
}

function pickFrom(arr, seed) {
  if (!Array.isArray(arr) || !arr.length) return ''
  return arr[seed % arr.length]
}

function greetingByLanguageCode(code) {
  const map = {
    eng: 'Welcome',
    zho: '欢迎',
    jpn: 'ようこそ',
    kor: '환영합니다',
    fra: 'Bienvenue',
    spa: 'Bienvenido',
    deu: 'Willkommen',
    ita: 'Benvenuto',
    por: 'Bem-vindo',
    rus: 'Добро пожаловать',
    ara: 'أهلا وسهلا',
    hin: 'स्वागत है',
    tha: 'ยินดีต้อนรับ',
    vie: 'Chào mừng',
    tur: 'Hoş geldiniz',
    nld: 'Welkom',
    swe: 'Välkommen',
    pol: 'Witamy',
    ces: 'Vítejte',
    ukr: 'Ласкаво просимо',
    ron: 'Bun venit',
    ell: 'Καλώς ήρθατε',
    hun: 'Üdvözöljük',
    heb: 'ברוכים הבאים',
    ind: 'Selamat datang',
  }
  return map[String(code || '').toLowerCase()] || 'Welcome'
}

function buildCountryGuideProfile(country) {
  const seed = hashString(`${country?.nameEn || ''}-${country?.cca3 || ''}`)
  const override = COUNTRY_CULTURE_OVERRIDES[country?.cca3 || ''] || null
  const roleByRegion = {
    Asia: ['和风旅拍向导', '夜市美食策划', '古城漫游讲解员'],
    Europe: ['古典街区策展人', '火车慢旅行顾问', '艺术博物馆陪游官'],
    Africa: ['市集文化体验官', '自然地貌观察员', '部落手工艺向导'],
    Americas: ['城市节奏策划师', '公路旅行领航员', '街头文化探索者'],
    Oceania: ['海岸风景向导', '自由潜体验顾问', '自然步道伙伴'],
    Antarctic: ['极地科研体验官', '冰原安全讲解员'],
  }
  const costumeByRegion = {
    Asia: ['和风振袖', '现代国潮', '传统刺绣披风'],
    Europe: ['复古旅装', '学院风大衣', '节庆礼服'],
    Africa: ['图腾织纹长袍', '传统头饰旅装', '手作染布披肩'],
    Americas: ['街头机能风', '牛仔旅行装', '热带节庆装'],
    Oceania: ['海岛轻机能', '冲浪文化风', '自然探险装'],
    Antarctic: ['极地功能服', '科考站防寒服'],
  }
  const hairstylePool = ['高马尾', '双辫', '波浪短发', '盘发', '侧编发', '中长直发']
  const traitPool = ['热情', '细致', '机智', '幽默', '沉稳', '活力']
  const specialByRegion = {
    Asia: '擅长把寺社、夜市与交通卡折扣组合成省钱路线',
    Europe: '擅长将老城步行线与博物馆免费时段组合',
    Africa: '擅长规划高性价比市场路线与本地文化体验',
    Americas: '擅长把城市玩法和近郊自然线高效串联',
    Oceania: '擅长平衡海岸风景体验与交通预算',
    Antarctic: '擅长极地节奏管理与安全边界提示',
  }
  const region = country?.region || 'Asia'
  const role = pickFrom(roleByRegion[region] || roleByRegion.Asia, seed + 7)
  const costume = pickFrom(costumeByRegion[region] || costumeByRegion.Asia, seed + 13)
  const hairstyle = pickFrom(hairstylePool, seed + 23)
  const trait = pickFrom(traitPool, seed + 31)
  const greeting = override?.localGreeting || greetingByLanguageCode(country?.primaryLang)
  const profileName = `${country?.name || country?.nameEn || '目的地'}向导`
  const motif = override?.motif || pickFrom(['街区漫游', '本地市场', '日落观景', '文化地标'], seed + 41)
  const icon = override?.icon || pickFrom(['✦', '◆', '◈', '✿', '⬢'], seed + 51)
  const welcomeText = `${greeting} ${country?.nameEn || country?.name || 'this country'}! ${override?.localGreetingZh || ''}。我是${profileName}，今天带你围绕「${motif}」做一版省钱高体验路线。`
  const aiGreeting = `你好，请给我一份${country?.name || country?.nameEn || '该国'}的省钱旅行起步方案。重点想体验：${motif}。请先给我3天与7天两种预算框架，再推荐本地特色体验。`
  return {
    profileName,
    role,
    costume,
    hairstyle,
    trait,
    icon,
    motif,
    localGreeting: greeting,
    localGreetingZh: override?.localGreetingZh || '',
    special: specialByRegion[region] || specialByRegion.Asia,
    welcomeText,
    aiGreeting,
  }
}

function buildCharacterSvgDataUrl(country, profile) {
  const seed = hashString(`${country?.nameEn || ''}-${profile?.role || ''}`)
  const palettes = [
    { bg1: '#fdf2f8', bg2: '#ede9fe', kimono1: '#f472b6', kimono2: '#ec4899', accent: '#fbbf24' },
    { bg1: '#ecfeff', bg2: '#e0e7ff', kimono1: '#38bdf8', kimono2: '#6366f1', accent: '#22c55e' },
    { bg1: '#f0fdf4', bg2: '#ecfccb', kimono1: '#34d399', kimono2: '#10b981', accent: '#f59e0b' },
    { bg1: '#fff7ed', bg2: '#fee2e2', kimono1: '#fb7185', kimono2: '#ef4444', accent: '#0ea5e9' },
  ]
  const p = pickFrom(palettes, seed + 3)
  const symbol = profile?.icon || pickFrom(['✦', '✿', '◆', '⬢', '❖', '◈'], seed + 9)
  const short = (country?.nameEn || country?.name || 'Guide').slice(0, 12)
  const svg = `<svg width="512" height="768" viewBox="0 0 512 768" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${short} guide">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="${p.bg1}"/><stop offset="100%" stop-color="${p.bg2}"/></linearGradient>
      <linearGradient id="kimono" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${p.kimono1}"/><stop offset="100%" stop-color="${p.kimono2}"/></linearGradient>
    </defs>
    <rect width="512" height="768" fill="url(#bg)"/>
    <circle cx="256" cy="210" r="90" fill="#fde68a"/>
    <path d="M166 200c10-54 44-88 90-88s80 34 90 88c-11-8-23-13-36-14-12-1-23 3-31 10-8-7-19-11-31-10-13 1-25 6-36 14z" fill="#111827"/>
    <ellipse cx="224" cy="220" rx="10" ry="12" fill="#111827"/><ellipse cx="288" cy="220" rx="10" ry="12" fill="#111827"/>
    <path d="M218 258c12 10 23 14 38 14s26-4 38-14" stroke="#be123c" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M130 760l48-270 78-70 78 70 48 270z" fill="url(#kimono)"/>
    <path d="M256 422l-42 42 42 232 42-232z" fill="#fce7f3"/>
    <rect x="234" y="452" width="44" height="248" rx="12" fill="#1f2937"/>
    <circle cx="256" cy="534" r="16" fill="${p.accent}"/><circle cx="256" cy="610" r="16" fill="${p.accent}"/><circle cx="256" cy="686" r="16" fill="${p.accent}"/>
    <text x="256" y="96" text-anchor="middle" font-size="36" fill="#0f172a" font-family="Segoe UI, sans-serif">${symbol}</text>
    <text x="256" y="732" text-anchor="middle" font-size="22" fill="#0f172a" font-family="Segoe UI, sans-serif">${short}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function findCountryByPolygon(lat, lng, polygonFeatures) {
  if (!polygonFeatures.length) return null
  const point = [lng, lat]
  let best = null
  let bestArea = Infinity
  for (const entry of polygonFeatures) {
    // Smaller containing polygon tends to be a more specific match for overlaps.
    const area = Number(entry.area ?? geoArea(entry.geometry))
    // Some topo sources can contain inverted/invalid geometries (e.g. huge wrap-around area).
    if (!Number.isFinite(area) || area <= 0 || area > MAX_REASONABLE_COUNTRY_AREA) continue
    if (!geoContains(entry.geometry, point)) continue
    if (area < bestArea) {
      bestArea = area
      best = entry
    }
  }
  return best
}

function isEastAsiaFocus(lat, lng) {
  return lat >= 20 && lat <= 48 && lng >= 118 && lng <= 147
}

function pickMicrostateOverride(lat, lng, polygonByCca3) {
  for (const hint of MICROSTATE_HINTS) {
    if (hint.box) {
      if (lat < hint.box.latMin || lat > hint.box.latMax || lng < hint.box.lngMin || lng > hint.box.lngMax) continue
    }
    const d = haversineKm(lat, lng, hint.lat, hint.lng)
    if (d > hint.maxKm) continue
    const feature = polygonByCca3.get(hint.cca3)
    if (feature) return feature
  }
  return null
}

function pickMicroClickAssist(lat, lng, polygonByCca3) {
  for (const item of MICRO_CLICK_ASSIST) {
    const b = item.box
    if (lat < b.latMin || lat > b.latMax || lng < b.lngMin || lng > b.lngMax) continue
    const feature = polygonByCca3.get(item.cca3)
    if (feature) return feature
  }
  return null
}

function inCountryHintBox(code, lat, lng) {
  const box = {
    JPN: { latMin: 24, latMax: 46, lngMin: 129, lngMax: 146 },
    KOR: { latMin: 33, latMax: 40, lngMin: 124, lngMax: 132 },
    PRK: { latMin: 37, latMax: 44, lngMin: 124, lngMax: 131 },
    TWN: { latMin: 21, latMax: 26.8, lngMin: 119, lngMax: 123.5 },
    CHN: { latMin: 18, latMax: 54, lngMin: 73, lngMax: 135 },
    MNG: { latMin: 41, latMax: 53, lngMin: 87, lngMax: 120 },
  }[code]
  if (!box) return false
  return lat >= box.latMin && lat <= box.latMax && lng >= box.lngMin && lng <= box.lngMax
}

function lonLatToVector3(lng, lat, radius = EARTH_RADIUS, offset = 0.01) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lng + 180)
  const r = radius + offset
  const x = -(r * Math.sin(phi) * Math.cos(theta))
  const z = r * Math.sin(phi) * Math.sin(theta)
  const y = r * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

function geometryToRings(geometry) {
  if (!geometry) return []
  if (geometry.type === 'Polygon') return geometry.coordinates || []
  if (geometry.type === 'MultiPolygon') {
    return (geometry.coordinates || []).flatMap((poly) => poly || [])
  }
  return []
}

function geometryToBounds(geometry) {
  const rings = geometryToRings(geometry)
  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity
  for (const ring of rings) {
    for (const coord of ring || []) {
      const lng = Number(coord?.[0])
      const lat = Number(coord?.[1])
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue
      if (lng < minLng) minLng = lng
      if (lng > maxLng) maxLng = lng
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    }
  }
  if (!Number.isFinite(minLng)) return null
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ]
}

function estimateZoomFromBounds(bounds) {
  if (!Array.isArray(bounds) || bounds.length !== 2) return 3.2
  const [sw, ne] = bounds
  const lngSpan = Math.abs(Number(ne?.[0]) - Number(sw?.[0]))
  const latSpan = Math.abs(Number(ne?.[1]) - Number(sw?.[1]))
  const span = Math.max(0.0001, Math.max(lngSpan, latSpan))
  const zoom = Math.log2(360 / span) - 0.85
  return THREE.MathUtils.clamp(zoom, 2, 7.2)
}

function estimatePitchFromCameraSnapshot(snapshot) {
  if (!snapshot?.position || snapshot.position.length < 3) return 56
  const v = new THREE.Vector3(Number(snapshot.position[0]), Number(snapshot.position[1]), Number(snapshot.position[2]))
  const dist = Math.max(0.001, v.length())
  const elevation = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(Math.abs(v.y) / dist, 0, 1)))
  return THREE.MathUtils.clamp(68 - elevation * 0.9, 26, 68)
}

function safeSetPaintProperty(map, layerId, property, value) {
  try {
    if (!map?.getLayer(layerId)) return
    map.setPaintProperty(layerId, property, value)
  } catch {}
}

function parseCinematicTuning(raw) {
  try {
    const parsed = JSON.parse(String(raw || '{}'))
    return {
      roadBaseOpacity: THREE.MathUtils.clamp(Number(parsed.roadBaseOpacity), 0.05, 0.8) || DEFAULT_CINEMATIC_TUNING.roadBaseOpacity,
      roadBoostOpacity: THREE.MathUtils.clamp(Number(parsed.roadBoostOpacity), 0.1, 1.2) || DEFAULT_CINEMATIC_TUNING.roadBoostOpacity,
      poiStartZoom: THREE.MathUtils.clamp(Number(parsed.poiStartZoom), 6, 14) || DEFAULT_CINEMATIC_TUNING.poiStartZoom,
      poiZoomRange: THREE.MathUtils.clamp(Number(parsed.poiZoomRange), 1.5, 8) || DEFAULT_CINEMATIC_TUNING.poiZoomRange,
      buildingStartZoom: THREE.MathUtils.clamp(Number(parsed.buildingStartZoom), 10, 15) || DEFAULT_CINEMATIC_TUNING.buildingStartZoom,
      buildingZoomRange: THREE.MathUtils.clamp(Number(parsed.buildingZoomRange), 1, 5) || DEFAULT_CINEMATIC_TUNING.buildingZoomRange,
      buildingMaxOpacity:
        THREE.MathUtils.clamp(Number(parsed.buildingMaxOpacity), 0.1, 0.95) || DEFAULT_CINEMATIC_TUNING.buildingMaxOpacity,
      smallCountryAreaThreshold:
        THREE.MathUtils.clamp(Number(parsed.smallCountryAreaThreshold), 0.0002, 0.01) ||
        DEFAULT_CINEMATIC_TUNING.smallCountryAreaThreshold,
    }
  } catch {
    return { ...DEFAULT_CINEMATIC_TUNING }
  }
}

function CountryOutline({ feature, color = '#38bdf8', pulse = false }) {
  const lines = useMemo(() => {
    if (!feature?.geometry) return []
    const rings = geometryToRings(feature.geometry)
    return rings
      .filter((ring) => Array.isArray(ring) && ring.length > 2)
      .map((ring) => ring.map(([lng, lat]) => lonLatToVector3(Number(lng), Number(lat), EARTH_RADIUS, 0.015)))
  }, [feature])
  const matsRef = useRef([])
  useFrame((state) => {
    if (!matsRef.current.length) return
    const t = state.clock.elapsedTime
    const boost = pulse ? 0.24 * (0.5 + 0.5 * Math.sin(t * 8.2)) : 0
    const nextOpacity = 0.78 + boost
    matsRef.current.forEach((mat) => {
      if (!mat) return
      mat.opacity = nextOpacity
    })
  })

  if (!lines.length) return null

  return (
    <group>
      {lines.map((points, idx) => (
        <line key={`${feature.id}-outline-${idx}`}>
          <bufferGeometry attach="geometry" onUpdate={(geo) => geo.setFromPoints(points)} />
          <lineBasicMaterial
            ref={(el) => {
              matsRef.current[idx] = el
            }}
            attach="material"
            color={color}
            transparent
            opacity={0.84}
            toneMapped={false}
          />
        </line>
      ))}
    </group>
  )
}

function GlitchPrelude({ onDone, onSfxCue }) {
  const [typed, setTyped] = useState('')
  const overlayControls = useAnimation()
  const canvasRef = useRef(null)

  useEffect(() => {
    let raf = 0
    let running = true
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.floor(rect.width || window.innerWidth))
      const h = Math.max(1, Math.floor(rect.height || window.innerHeight))
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const render = (t) => {
      if (!running) return
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, w, h)

      const density = Math.floor((w * h) / 420)
      for (let i = 0; i < density; i += 1) {
        const x = Math.random() * w
        const y = Math.random() * h
        const a = 0.06 + Math.random() * 0.23
        const gray = Math.floor(170 + Math.random() * 85)
        ctx.fillStyle = `rgba(${gray},${gray},${gray},${a})`
        ctx.fillRect(x, y, 1, 1)
      }

      for (let y = 0; y < h; y += 3) {
        const alpha = 0.02 + Math.random() * 0.03
        ctx.fillStyle = `rgba(220,220,220,${alpha})`
        ctx.fillRect(0, y, w, 1)
      }

      const bars = 4
      for (let i = 0; i < bars; i += 1) {
        const yy = ((t * (0.07 + i * 0.03)) % (h + 120)) - 60
        ctx.fillStyle = 'rgba(255,255,255,0.06)'
        ctx.fillRect(0, yy, w, 22)
      }

      // RGB channel split jitter for a stronger analog glitch feel.
      const split = 1 + Math.sin(t * 0.004) * 1.2
      ctx.globalCompositeOperation = 'screen'
      ctx.fillStyle = `rgba(255,80,80,${0.025 + Math.random() * 0.02})`
      ctx.fillRect(split, 0, w, h)
      ctx.fillStyle = `rgba(80,140,255,${0.02 + Math.random() * 0.02})`
      ctx.fillRect(-split, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'

      raf = window.requestAnimationFrame(render)
    }
    raf = window.requestAnimationFrame(render)

    return () => {
      running = false
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const timers = []
    const run = async () => {
      await overlayControls.start({ opacity: 1, transition: { duration: 0.01 } })
      onSfxCue?.('prelude:start')

      const typingStart = 450
      timers.push(
        window.setTimeout(() => {
          let idx = 0
          const typing = window.setInterval(() => {
            idx += 1
            setTyped(SLOGAN_TEXT.slice(0, idx))
            if (idx >= SLOGAN_TEXT.length) window.clearInterval(typing)
          }, 60)
          timers.push(typing)
        }, typingStart),
      )

      await new Promise((resolve) => timers.push(window.setTimeout(resolve, PRELUDE_GLITCH_MS)))
      setTyped(SLOGAN_TEXT)
      onSfxCue?.('prelude:slogan-complete')
      await new Promise((resolve) => timers.push(window.setTimeout(resolve, PRELUDE_SLOGAN_HOLD_MS)))
      if (cancelled) return
      onSfxCue?.('prelude:fade')
      await overlayControls.start({
        opacity: 0,
        filter: 'blur(8px)',
        transition: { duration: PRELUDE_FADE_MS / 1000, ease: 'easeInOut' },
      })
      if (!cancelled) onDone?.()
    }
    run()
    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [onDone, onSfxCue, overlayControls])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={overlayControls}
      className="fixed inset-0 z-[120] overflow-hidden bg-black"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <p
          className="text-center text-xl sm:text-2xl md:text-4xl tracking-[0.08em] text-slate-100"
          style={{ fontFamily: "Orbitron, Rajdhani, 'Segoe UI', monospace", textShadow: '0 0 18px rgba(148,163,184,0.45)' }}
        >
          {typed}
          <span className="ml-1 inline-block h-[1em] w-[0.08em] bg-slate-100/85 align-middle animate-pulse" />
        </p>
      </div>
    </motion.div>
  )
}

function RevealCameraIntro({ trigger = 0, controlsRef, isMobile, onSfxCue }) {
  const { camera } = useThree()
  const animRef = useRef(null)
  const base = useMemo(
    () => (isMobile ? new THREE.Vector3(0, 0.15, 3.8) : new THREE.Vector3(0, 0.2, 3.4)),
    [isMobile],
  )
  const from = useMemo(
    () => (isMobile ? new THREE.Vector3(0, 0.18, 4.55) : new THREE.Vector3(0, 0.24, 4.2)),
    [isMobile],
  )

  useEffect(() => {
    if (!trigger) return
    camera.position.copy(from)
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
    animRef.current = { t: 0 }
    onSfxCue?.('reveal:dolly-start')
  }, [trigger, camera, from, controlsRef, onSfxCue])

  useFrame((_, delta) => {
    if (!animRef.current) return
    animRef.current.t = Math.min(1, animRef.current.t + delta / 1.1)
    const eased = 1 - Math.pow(1 - animRef.current.t, 3)
    camera.position.lerpVectors(from, base, eased)
    if (controlsRef.current) controlsRef.current.update()
    if (animRef.current.t >= 1) {
      animRef.current = null
      onSfxCue?.('reveal:dolly-end')
    }
  })

  return null
}

function CameraFocusController({ selectedFeature, controlsRef, isMobile, resetToGlobalKey = 0, isUserInteracting = false }) {
  const { camera } = useThree()
  const desiredRef = useRef(null)
  const focusSettleUntilRef = useRef(0)
  const lastFocusFeatureIdRef = useRef(null)

  useEffect(() => {
    if (!selectedFeature?.geometry) {
      lastFocusFeatureIdRef.current = null
      return
    }
    const id = selectedFeature.id
    if (lastFocusFeatureIdRef.current !== id) {
      lastFocusFeatureIdRef.current = id
      focusSettleUntilRef.current = Date.now() + CAMERA_FOCUS_SETTLE_MS
    }
    const centroid = geoCentroid(selectedFeature.geometry)
    if (!Array.isArray(centroid) || centroid.length < 2) return
    const [lng, lat] = centroid
    const surfacePoint = lonLatToVector3(Number(lng), Number(lat), EARTH_RADIUS, 0)
    const outward = surfacePoint.clone().normalize()
    const focusDistance = isMobile ? 3.2 : 2.9
    const desiredPosition = outward.multiplyScalar(focusDistance)
    const desiredTarget = surfacePoint.clone().multiplyScalar(0.34)
    desiredRef.current = { position: desiredPosition, target: desiredTarget }
  }, [selectedFeature, isMobile])

  useEffect(() => {
    const globalPosition = isMobile
      ? new THREE.Vector3(0, 0.15, 3.8)
      : new THREE.Vector3(0, 0.2, 3.4)
    desiredRef.current = { position: globalPosition, target: new THREE.Vector3(0, 0, 0) }
    focusSettleUntilRef.current = 0
    lastFocusFeatureIdRef.current = null
  }, [resetToGlobalKey, isMobile])

  useFrame(() => {
    // 交互中只暂停对焦，不要清空 desiredRef，否则松手后对焦目标丢失
    if (isUserInteracting) return
    if (Date.now() < focusSettleUntilRef.current) return
    if (!desiredRef.current) return
    const { position, target } = desiredRef.current
    camera.position.lerp(position, 0.08)
    if (controlsRef.current) {
      controlsRef.current.target.lerp(target, 0.1)
      controlsRef.current.update()
    } else {
      camera.lookAt(target)
    }
    if (camera.position.distanceTo(position) < 0.015) {
      desiredRef.current = null
    }
  })

  return null
}

function Earth({
  introDone,
  skipRequested,
  onIntroDone,
  onCountryClick,
  onHoverGeo,
  lowPerf = false,
  selectedFeature = null,
  startAnimation = true,
  isUserInteracting = false,
  onInteractionChange,
  dragSensitivity = 'normal',
  inertiaLevel = 'medium',
  precisionPickMode = false,
  interactionProfile = 'balanced',
}) {
  const groupRef = useRef(null)
  const rotateRef = useRef(null)
  const introStartRef = useRef(0)
  const startedRef = useRef(false)
  const finishedRef = useRef(false)
  const dragRef = useRef({
    active: false,
    engaged: false,
    lastX: 0,
    lastY: 0,
    moved: 0,
    prevDx: 0,
    prevDy: 0,
    speed: 0,
    startAt: 0,
  })
  const inertiaRef = useRef(0)
  const pitchInertiaRef = useRef(0)
  const suppressClickRef = useRef(false)
  const hoverRef = useRef(false)
  const idleResumeAtRef = useRef(0)
  const clickLockUntilRef = useRef(0)

  const [dayMap, normalMap, specMap] = useTexture([
    EARTH_TEXTURES.day,
    EARTH_TEXTURES.normal,
    EARTH_TEXTURES.specular,
  ])

  const segments = lowPerf ? 64 : 96
  const interactionConfig = INTERACTION_PROFILES[interactionProfile] || INTERACTION_PROFILES.balanced

  useEffect(() => {
    ;[dayMap, normalMap, specMap].forEach((map) => {
      if (!map) return
      map.anisotropy = 8
      map.colorSpace = THREE.SRGBColorSpace
    })
  }, [dayMap, normalMap, specMap])

  useEffect(() => {
    if (skipRequested && groupRef.current) {
      groupRef.current.scale.setScalar(1)
      finishedRef.current = true
      onIntroDone?.()
    }
  }, [skipRequested, onIntroDone])

  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.z = THREE.MathUtils.degToRad(EARTH_AXIAL_TILT_DEG)
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current || !rotateRef.current) return
    if (!startAnimation) {
      groupRef.current.scale.setScalar(0.1)
      return
    }
    if (!startedRef.current) {
      introStartRef.current = state.clock.getElapsedTime()
      startedRef.current = true
      groupRef.current.scale.setScalar(0.1)
    }
    if (!finishedRef.current) {
      const elapsedMs = (state.clock.getElapsedTime() - introStartRef.current) * 1000
      const t = THREE.MathUtils.clamp(elapsedMs / INTRO_MS, 0, 1)
      const eased = easeOutBack(t)
      const scale = 0.1 + (1 - 0.1) * eased
      groupRef.current.scale.setScalar(scale)
      if (t >= 1) {
        finishedRef.current = true
        onIntroDone?.()
      }
      return
    }
    const nowMs = Date.now()
    const canIdleMotion =
      !selectedFeature &&
      !isUserInteracting &&
      nowMs >= clickLockUntilRef.current &&
      (!precisionPickMode || !hoverRef.current) &&
      nowMs >= idleResumeAtRef.current
    if (canIdleMotion && Math.abs(inertiaRef.current) > 0.00001) {
      rotateRef.current.rotation.y += inertiaRef.current
      inertiaRef.current *= INERTIA_DAMPING[inertiaLevel] ?? INERTIA_DAMPING.medium
    }
    if (canIdleMotion && Math.abs(pitchInertiaRef.current) > 0.00001) {
      const maxPitch = THREE.MathUtils.degToRad(EARTH_MAX_PITCH_DEG)
      rotateRef.current.rotation.x = THREE.MathUtils.clamp(
        rotateRef.current.rotation.x + pitchInertiaRef.current,
        -maxPitch,
        maxPitch,
      )
      pitchInertiaRef.current *= 0.82
    }
    if (introDone && canIdleMotion && EARTH_IDLE_AUTO_ROTATE > 0) {
      rotateRef.current.rotation.y += delta * EARTH_IDLE_AUTO_ROTATE
    }
  })

  useEffect(() => {
    if (!selectedFeature) return
    inertiaRef.current = 0
    pitchInertiaRef.current = 0
    idleResumeAtRef.current = Date.now() + 2600
  }, [selectedFeature])

  useEffect(() => {
    const stopDrag = () => {
      if (!dragRef.current.active) return
      dragRef.current.active = false
      inertiaRef.current = 0
      pitchInertiaRef.current = 0
      idleResumeAtRef.current = Date.now() + 900
      onInteractionChange?.(false)
    }
    window.addEventListener('pointerup', stopDrag)
    return () => {
      window.removeEventListener('pointerup', stopDrag)
    }
  }, [onInteractionChange])

  return (
    <group ref={groupRef}>
      <group ref={rotateRef}>
        <mesh
        onPointerDown={(event) => {
          if (event.button !== 0) return
          event.stopPropagation()
          dragRef.current.active = true
          dragRef.current.lastX = event.clientX
          dragRef.current.lastY = event.clientY
          dragRef.current.moved = 0
          dragRef.current.engaged = false
          dragRef.current.prevDx = 0
          dragRef.current.prevDy = 0
          dragRef.current.speed = 0
          dragRef.current.startAt = Date.now()
          inertiaRef.current = 0
          pitchInertiaRef.current = 0
          idleResumeAtRef.current = Date.now() + interactionConfig.idleResumeMs
          onInteractionChange?.(true)
        }}
        onPointerMove={(event) => {
          if (!rotateRef.current) return
          if (Date.now() < clickLockUntilRef.current) {
            inertiaRef.current = 0
            pitchInertiaRef.current = 0
            return
          }
          const localPoint = rotateRef.current.worldToLocal(event.point.clone())
          const { lat, lng } = cartesianToLatLng(localPoint, EARTH_RADIUS)
          if (!dragRef.current.active) {
            const alt = cartesianToLatLngAlt(localPoint, EARTH_RADIUS)
            onHoverGeo?.({ lat, lng, latAlt: alt.lat, lngAlt: alt.lng, point: localPoint })
            return
          }
          event.stopPropagation()
          const dx = event.clientX - dragRef.current.lastX
          const dy = event.clientY - dragRef.current.lastY
          dragRef.current.lastX = event.clientX
          dragRef.current.lastY = event.clientY
          dragRef.current.moved += Math.hypot(dx, dy)
          if (!dragRef.current.engaged && dragRef.current.moved >= DRAG_START_THRESHOLD_PX) {
            dragRef.current.engaged = true
          }
          if (!dragRef.current.engaged) {
            inertiaRef.current = 0
            pitchInertiaRef.current = 0
            return
          }
          const smoothDx = dragRef.current.prevDx * 0.35 + dx * 0.65
          const smoothDy = dragRef.current.prevDy * 0.35 + dy * 0.65
          dragRef.current.prevDx = smoothDx
          dragRef.current.prevDy = smoothDy
          dragRef.current.speed = Math.hypot(smoothDx, smoothDy)
          const factor = DRAG_SENSITIVITY[dragSensitivity] ?? DRAG_SENSITIVITY.normal
          const rawDeltaRotation = smoothDx * factor * 1.15
          const rawPitchDelta = -smoothDy * factor * 0.36
          const deltaRotation = THREE.MathUtils.clamp(rawDeltaRotation, -MAX_ROTATION_STEP_RAD, MAX_ROTATION_STEP_RAD)
          const pitchDelta = THREE.MathUtils.clamp(rawPitchDelta, -MAX_PITCH_STEP_RAD, MAX_PITCH_STEP_RAD)
          const maxPitch = THREE.MathUtils.degToRad(EARTH_MAX_PITCH_DEG)
          rotateRef.current.rotation.y += deltaRotation
          rotateRef.current.rotation.x = THREE.MathUtils.clamp(rotateRef.current.rotation.x + pitchDelta, -maxPitch, maxPitch)
          const keepInertia =
            !DISABLE_DRAG_INERTIA &&
            dragRef.current.moved >= interactionConfig.inertiaMovePx &&
            dragRef.current.speed >= interactionConfig.inertiaMinVelocityPx
          inertiaRef.current = keepInertia ? deltaRotation * 0.78 : 0
          pitchInertiaRef.current = keepInertia ? pitchDelta * 0.68 : 0
          idleResumeAtRef.current = Date.now() + interactionConfig.idleResumeMs
        }}
        onPointerUp={(event) => {
          if (event.button !== 0) return
          event.stopPropagation()
          dragRef.current.active = false
          onInteractionChange?.(false)
          if (dragRef.current.moved <= CLICK_SELECT_MAX_MOVE_PX) {
            const localPoint = rotateRef.current ? rotateRef.current.worldToLocal(event.point.clone()) : event.point.clone()
            const primary = cartesianToLatLng(localPoint, EARTH_RADIUS)
            const alt = cartesianToLatLngAlt(localPoint, EARTH_RADIUS)
            onCountryClick?.({ lat: primary.lat, lng: primary.lng, latAlt: alt.lat, lngAlt: alt.lng, point: localPoint })
            // Country-select should "consume" the gesture. Clear inertia immediately so the globe
            // doesn't drift right after mouse release (feels hard to control).
            inertiaRef.current = 0
            pitchInertiaRef.current = 0
            // Give focus/transition a moment before auto-motion resumes.
            idleResumeAtRef.current = Date.now() + Math.max(1700, interactionConfig.idleResumeMs + 500)
            clickLockUntilRef.current = Date.now() + CLICK_ROTATION_LOCK_MS
            suppressClickRef.current = true
            window.setTimeout(() => {
              suppressClickRef.current = false
            }, 80)
          }
          if (dragRef.current.engaged && dragRef.current.moved > CLICK_SELECT_MAX_MOVE_PX) {
            inertiaRef.current = 0
            pitchInertiaRef.current = 0
            // Hard pause after release to avoid any perceived drift.
            idleResumeAtRef.current = Date.now() + Math.max(2200, interactionConfig.idleResumeMs + 1000)
          }
        }}
        onPointerEnter={() => {
          hoverRef.current = true
          if (precisionPickMode) {
            inertiaRef.current = 0
            idleResumeAtRef.current = Date.now() + 1600
          }
        }}
        onPointerLeave={() => {
          onHoverGeo?.(null)
          hoverRef.current = false
          idleResumeAtRef.current = Date.now() + interactionConfig.idleResumeMs
          if (!dragRef.current.active) return
          dragRef.current.active = false
          dragRef.current.engaged = false
          onInteractionChange?.(false)
        }}
        onClick={(event) => {
          // Click selection is handled in onPointerUp only.
          // Keeping this handler as a no-op avoids duplicate trigger/toggle behavior.
          event.stopPropagation()
        }}
      >
        <sphereGeometry args={[EARTH_RADIUS, segments, segments]} />
        <meshPhongMaterial
          map={dayMap}
          normalMap={normalMap}
          specularMap={specMap}
          shininess={18}
          specular={new THREE.Color('#2b3c5a')}
        />
        </mesh>
        <mesh scale={1.018}>
          <sphereGeometry args={[EARTH_RADIUS, 48, 48]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>
        <CountryOutline feature={selectedFeature} pulse={Boolean(selectedFeature)} />
      </group>
    </group>
  )
}

function CameraSnapshotBridge({ onSnapshot }) {
  const { camera, size } = useThree()
  useFrame(() => {
    onSnapshot?.({
      position: camera.position.toArray(),
      quaternion: camera.quaternion.toArray(),
      fov: camera.fov,
      near: camera.near,
      far: camera.far,
      aspect: camera.aspect,
      width: size.width,
      height: size.height,
    })
  })
  return null
}

function GlobeToMapStage({
  stage,
  progress = 0,
  cinematicTuning = DEFAULT_CINEMATIC_TUNING,
  targetView,
  transitionDurationMs,
  onMapReady,
  activeCountry,
  characterImageUrl,
  welcomeText,
  welcomeAudio,
  welcomeAudioReady,
  onGuidePopupClose,
}) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const popupRef = useRef(null)
  const explorerMarkerRef = useRef(null)
  const explorerPopupRef = useRef(null)
  const [tokenMissing, setTokenMissing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [explorerHint, setExplorerHint] = useState(null)
  const searchAbortRef = useRef(null)
  const cinematicInitRef = useRef(false)

  // Map stage AI assistant (AMap-style: select a place -> chat & generate budget guide).
  const [aiPromptNonce, setAiPromptNonce] = useState(0)
  const [aiAutoPrompt, setAiAutoPrompt] = useState('')
  const [aiBudget, setAiBudget] = useState(2500)
  const [aiDays, setAiDays] = useState(5)
  const [aiPeople, setAiPeople] = useState(2)
  const [aiPreference, setAiPreference] = useState('通用')
  const [aiDestination, setAiDestination] = useState(
    activeCountry?.nameEn || activeCountry?.name || 'destination',
  )
  const hasSentInitialAiRef = useRef(false)
  const lastAiDestinationSentRef = useRef('')

  const buildAiPrompt = useCallback(() => {
    const destination = String(aiDestination || 'destination').trim()
    const budget = Number.isFinite(Number(aiBudget)) ? Number(aiBudget) : 2500
    const days = Number.isFinite(Number(aiDays)) ? Number(aiDays) : 5
    const people = Number.isFinite(Number(aiPeople)) ? Number(aiPeople) : 2
    const pref = String(aiPreference || '通用')
    const modeHint =
      /极限|ultra|hard|budget/i.test(pref)
        ? '风格模式：极限省钱（尽量用步行/公共交通、免费景点、二手/性价比住宿；把每一天的最低花费也列出来）'
        : /舒适|comfortable|balance/i.test(pref)
          ? '风格模式：舒适平衡（在不爆预算的前提下，安排更高性价比的交通/住宿，减少排队时间；并给出“省钱替代方案”）'
          : '风格模式：通用（既好玩也尽量省）'
    return [
      '你叫小元，是一个省钱旅行规划助手。',
      `目的地：${destination}`,
      `约束：预算 ${budget} 元；${days} 天；${people} 人`,
      `偏好：${pref}`,
      modeHint,
      '请生成一份结构化的省钱攻略：',
      '1) 按天时间线（Day 1/Day 2/...），每天下午/晚上分别给低成本选择',
      '2) 预算拆分（交通/住宿/餐饮/门票/机动），并给出省钱替代方案',
      '3) 交通与住宿策略（建议怎么选区域与交通方式）',
      '4) 避坑清单（3-6 条）',
      '5) 给我可直接复制到高德/Google 地图的“关键词列表”（每段 1 行）',
      '不要废话，尽量用中文。',
    ].join('\n')
  }, [aiDestination, aiBudget, aiDays, aiPeople, aiPreference])

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    const mapStyle = import.meta.env.VITE_MAPBOX_STYLE_URL || DEFAULT_MAPBOX_STYLE
    if (!token) {
      setTokenMissing(true)
      return
    }
    if (!mapContainerRef.current || mapRef.current) return
    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: targetView?.center || [104, 34],
      zoom: targetView?.zoom ?? 1.8,
      bearing: targetView?.bearing ?? 0,
      pitch: targetView?.pitch ?? 58,
      antialias: true,
      attributionControl: false,
      cooperativeGestures: true,
    })
    mapRef.current = map
    map.on('load', () => {
      // AMap-like baseline controls (zoom/compass).
      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left')
      if (!map.getLayer(CINEMATIC_3D_BUILDINGS_LAYER_ID) && map.getSource('composite')) {
        const layers = map.getStyle()?.layers || []
        const labelLayerId = layers.find((l) => l.type === 'symbol' && l.layout?.['text-field'])?.id
        map.addLayer(
          {
            id: CINEMATIC_3D_BUILDINGS_LAYER_ID,
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', ['get', 'extrude'], 'true'],
            type: 'fill-extrusion',
            minzoom: 12,
            paint: {
              'fill-extrusion-color': '#d6e6ff',
              'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 12, 0, 16, ['get', 'height']],
              'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 12, 0, 16, ['get', 'min_height']],
              'fill-extrusion-opacity': 0,
            },
          },
          labelLayerId,
        )
      }
      onMapReady?.(map)

    })
    return () => {
      if (markerRef.current) markerRef.current.remove()
      markerRef.current = null
      if (popupRef.current) popupRef.current.remove()
      popupRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [onMapReady, targetView])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    if (!cinematicInitRef.current) {
      cinematicInitRef.current = true
      if (map.getFog) {
        map.setFog({
          range: [0.8, 10],
          color: '#e2f2ff',
          'high-color': '#f7fbff',
          'horizon-blend': 0.08,
          'space-color': '#dbeafe',
          'star-intensity': 0,
        })
      }
    }
    const roadLayerIds = ['road-primary', 'road-secondary-tertiary', 'road-street', 'road-label']
    const poiLayerIds = ['poi-label', 'poi-scalerank1', 'poi-scalerank2', 'poi-scalerank3']
    const zoom = map.getZoom()
    const k = stage === 'transitioning' ? THREE.MathUtils.clamp(progress, 0, 1) : stage === 'map' ? 1 : 0
    roadLayerIds.forEach((id) => {
      if (id.includes('label')) {
        safeSetPaintProperty(map, id, 'text-opacity', 0.35 + k * 0.65)
      } else {
        safeSetPaintProperty(map, id, 'line-opacity', cinematicTuning.roadBaseOpacity + k * cinematicTuning.roadBoostOpacity)
      }
    })
    const poiRevealByZoom = THREE.MathUtils.clamp((zoom - cinematicTuning.poiStartZoom) / cinematicTuning.poiZoomRange, 0, 1)
    const poiOpacity = 0.06 + poiRevealByZoom * k * 0.94
    poiLayerIds.forEach((id) => {
      safeSetPaintProperty(map, id, 'text-opacity', poiOpacity)
      safeSetPaintProperty(map, id, 'icon-opacity', poiOpacity)
    })
    const buildingRevealByZoom = THREE.MathUtils.clamp(
      (zoom - cinematicTuning.buildingStartZoom) / cinematicTuning.buildingZoomRange,
      0,
      1,
    )
    const buildingOpacity = k * buildingRevealByZoom * cinematicTuning.buildingMaxOpacity
    safeSetPaintProperty(map, CINEMATIC_3D_BUILDINGS_LAYER_ID, 'fill-extrusion-opacity', buildingOpacity)
  }, [stage, progress, cinematicTuning])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    // Keep map canvas resolution synced while overlay/fade transitions run.
    map.resize()
  }, [stage, transitionDurationMs])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !activeCountry?.center) return

    if (markerRef.current) markerRef.current.remove()
    markerRef.current = null
    if (popupRef.current) popupRef.current.remove()
    popupRef.current = null

    const markerEl = document.createElement('button')
    markerEl.type = 'button'
    markerEl.className = 'rw-guide-marker'
    markerEl.style.cssText =
      'width:24px;height:24px;border-radius:9999px;background:#f43f5e;border:2px solid white;box-shadow:0 0 0 4px rgba(244,63,94,.25);cursor:pointer;'
    markerEl.setAttribute('aria-label', `${activeCountry.name || activeCountry.nameEn} 动漫向导`)

    const container = document.createElement('div')
    container.style.cssText = 'width:236px;font-family:Inter,Segoe UI,sans-serif;color:#0f172a;'
    container.innerHTML = `
      <div style="display:flex;gap:10px;align-items:flex-start">
        <img src="${characterImageUrl}" alt="${activeCountry.name || activeCountry.nameEn} 角色向导" style="width:86px;height:126px;object-fit:cover;border-radius:10px;border:1px solid rgba(15,23,42,.1)" />
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:14px;line-height:1.2;margin-bottom:6px">${activeCountry.name || activeCountry.nameEn} 特色向导</div>
          <div style="font-size:11px;color:#0f172a;margin-bottom:4px">代表元素：${activeCountry.icon || '✦'} · ${activeCountry.motif || '本地风情'}</div>
          <div style="font-size:12px;color:#334155;line-height:1.45">${welcomeText}</div>
          <button data-role="play-voice" style="margin-top:8px;background:#0ea5e9;color:#fff;border:0;border-radius:8px;padding:6px 10px;font-size:12px;cursor:pointer">▶ 播放欢迎语</button>
        </div>
      </div>
    `

    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      offset: 18,
      maxWidth: '268px',
    }).setDOMContent(container)
    popupRef.current = popup

    const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
      .setLngLat(activeCountry.center)
      .setPopup(popup)
      .addTo(map)
    markerRef.current = marker

    const playBtn = container.querySelector('[data-role="play-voice"]')
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (welcomeAudio && welcomeAudioReady) {
          welcomeAudio.currentTime = 0
          void welcomeAudio.play().catch(() => {})
          return
        }
        if ('speechSynthesis' in window) {
          const utter = new SpeechSynthesisUtterance(
            String(
              `${activeCountry.localGreeting || ''} ${activeCountry.nameEn || activeCountry.name || ''}. ${welcomeText || 'Welcome!'}`,
            ),
          )
          utter.lang = activeCountry.primaryLang === 'jpn' ? 'ja-JP' : 'en-US'
          utter.rate = 0.98
          window.speechSynthesis.cancel()
          window.speechSynthesis.speak(utter)
        }
      })
    }

    popup.on('close', () => {
      onGuidePopupClose?.()
    })
  }, [activeCountry, characterImageUrl, welcomeAudio, welcomeAudioReady, welcomeText, onGuidePopupClose])

  const showExplorerAt = (lng, lat, title, placeName) => {
    const map = mapRef.current
    if (!map) return
    if (explorerPopupRef.current) explorerPopupRef.current.remove()
    explorerPopupRef.current = null

    const popupEl = document.createElement('div')
    popupEl.style.cssText = 'font-family:Inter,Segoe UI,sans-serif; color:#0f172a; min-width:180px;'
    popupEl.innerHTML = `
      <div style="font-weight:800; margin-bottom:4px;">${title || 'Selected location'}</div>
      <div style="font-size:12px; color:#334155; line-height:1.35; margin-bottom:6px;">${placeName || ''}</div>
      <div style="font-size:11px; color:#64748b; line-height:1.35;">lng ${lng.toFixed(5)} · lat ${lat.toFixed(5)}</div>
    `

    const popup = new mapboxgl.Popup({ closeButton: true, closeOnClick: true, offset: 18 }).setDOMContent(popupEl)
    explorerPopupRef.current = popup

    if (explorerMarkerRef.current) explorerMarkerRef.current.remove()
    const el = document.createElement('button')
    el.type = 'button'
    el.style.cssText =
      'width:16px;height:16px;border-radius:9999px;background:#0ea5e9;border:2px solid white;box-shadow:0 0 0 4px rgba(14,165,233,.25);cursor:pointer;'
    explorerMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map)

    setExplorerHint({ title: title || 'Selected location', placeName, lng, lat })

    const dest = title || placeName || 'destination'
    setAiDestination(dest)

    if (!hasSentInitialAiRef.current) {
      hasSentInitialAiRef.current = true
      setAiAutoPrompt(buildAiPrompt())
      setAiPromptNonce((v) => v + 1)
      lastAiDestinationSentRef.current = dest
    } else if (String(lastAiDestinationSentRef.current) !== dest) {
      // AMap-like behavior: selecting a new place regenerates the guide.
      lastAiDestinationSentRef.current = dest
      setAiAutoPrompt(buildAiPrompt())
      setAiPromptNonce((v) => v + 1)
    }
  }

  const reverseGeocode = async (lng, lat) => {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    if (!token) return null
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&types=place,locality,poi,address,postcode&language=en&limit=1`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const f = Array.isArray(data?.features) ? data.features[0] : null
    if (!f) return null
    return { title: f.text || 'Selected location', placeName: f.place_name }
  }

  const forwardGeocode = async (q) => {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    if (!token || !q.trim()) return null
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      q.trim(),
    )}.json?access_token=${token}&autocomplete=true&limit=5&types=place,locality,poi,address,postcode&language=en`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const f = Array.isArray(data?.features) ? data.features[0] : null
    if (!f || !Array.isArray(f.center)) return null
    return { lng: f.center[0], lat: f.center[1], title: f.text || 'Selected location', placeName: f.place_name }
  }

  useEffect(() => {
    if (tokenMissing) return undefined
    const map = mapRef.current
    if (!map) return undefined
    let cancelled = false
    const onMapClick = async (e) => {
      if (cancelled) return
      const lng = e.lngLat.lng
      const lat = e.lngLat.lat
      const geo = await reverseGeocode(lng, lat)
      showExplorerAt(lng, lat, geo?.title || 'Selected location', geo?.placeName)
    }
    map.on('click', onMapClick)
    return () => {
      cancelled = true
      map.off('click', onMapClick)
    }
  }, [tokenMissing])

  useEffect(() => {
    if (!activeCountry) return
    if (!hasSentInitialAiRef.current) {
      hasSentInitialAiRef.current = true
      const dest = activeCountry?.nameEn || activeCountry?.name || 'destination'
      setAiDestination(dest)
      setAiAutoPrompt(buildAiPrompt())
      setAiPromptNonce((v) => v + 1)
      lastAiDestinationSentRef.current = dest
    } else {
      // Keep destination in sync when user selects a different place.
      setAiDestination(activeCountry?.nameEn || activeCountry?.name || 'destination')
    }
  }, [activeCountry, buildAiPrompt])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !targetView || stage === 'globe') return
    let secondPhaseTimer = null
    const bearing = targetView.bearing ?? 0
    const transitionPitch = targetView.transitionPitch ?? 56
    const transitionZoom = targetView.transitionZoom ?? targetView.zoom ?? 3.4

    const runFinalView = (duration) => {
      if (Array.isArray(targetView.bounds) && targetView.bounds.length === 2) {
        const cameraForBounds = map.cameraForBounds(targetView.bounds, {
          padding: 60,
          bearing,
          pitch: targetView.pitch ?? 0,
        })
        if (cameraForBounds?.center) {
          map.easeTo({
            center: cameraForBounds.center,
            zoom: Number.isFinite(cameraForBounds.zoom) ? cameraForBounds.zoom : targetView.zoom ?? 4,
            bearing,
            pitch: targetView.pitch ?? 0,
            duration,
            essential: true,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          })
          return
        }
      }
      map.easeTo({
        center: targetView.center,
        zoom: targetView.zoom ?? 4,
        bearing,
        pitch: targetView.pitch ?? 0,
        duration,
        essential: true,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      })
    }

    if (stage === 'transitioning') {
      map.stop()
      map.easeTo({
        center: targetView.center,
        zoom: transitionZoom,
        bearing,
        pitch: transitionPitch,
        duration: Math.round(transitionDurationMs * 0.56),
        essential: true,
        easing: (t) => 1 - Math.pow(1 - t, 2),
      })
      secondPhaseTimer = window.setTimeout(() => {
        const area = Number(targetView.area || 0)
        const isTinyCountry = area > 0 && area < cinematicTuning.smallCountryAreaThreshold
        if (isTinyCountry || !Array.isArray(targetView.bounds) || targetView.bounds.length !== 2) {
          map.flyTo({
            center: targetView.center,
            zoom: Math.max(targetView.zoom ?? 4.5, 5.2),
            bearing,
            pitch: targetView.pitch ?? 0,
            speed: 1.02,
            curve: 1.32,
            essential: true,
          })
        } else {
          runFinalView(Math.round(transitionDurationMs * 0.44))
        }
      }, Math.round(transitionDurationMs * 0.56))
      return () => {
        if (secondPhaseTimer) window.clearTimeout(secondPhaseTimer)
      }
    }

    if (Array.isArray(targetView.bounds) && targetView.bounds.length === 2) {
      map.fitBounds(targetView.bounds, {
        padding: 60,
        duration: 0,
        bearing,
        pitch: targetView.pitch ?? 0,
      })
      return
    }
    map.easeTo({
      center: targetView.center,
      zoom: targetView.zoom ?? 4,
      bearing,
      pitch: targetView.pitch ?? 0,
      duration: 0,
    })
  }, [stage, targetView, transitionDurationMs, cinematicTuning.smallCountryAreaThreshold])

  return (
    <div
      className={`absolute inset-0 z-10 transition-opacity duration-[1200ms] ${
        stage === 'globe' ? 'hidden pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <div ref={mapContainerRef} className="h-full w-full" />
      <div className="pointer-events-auto absolute left-4 top-4 z-30">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 backdrop-blur px-2 py-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search place / POI…"
            className="w-[240px] bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              const q = searchQuery.trim()
              void (async () => {
                const r = await forwardGeocode(q)
                if (!r) return
                showExplorerAt(r.lng, r.lat, r.title, r.placeName)
                const map = mapRef.current
                map?.easeTo({
                  center: [r.lng, r.lat],
                  zoom: Math.max(map.getZoom(), 11),
                  duration: transitionDurationMs,
                })
              })()
            }}
          />
          <button
            type="button"
            className="rounded-full border border-white/20 bg-black/35 px-3 py-2 text-sm text-white/90 hover:bg-black/55 transition"
            onClick={() => {
              const q = searchQuery.trim()
              void (async () => {
                const r = await forwardGeocode(q)
                if (!r) return
                showExplorerAt(r.lng, r.lat, r.title, r.placeName)
                const map = mapRef.current
                map?.easeTo({
                  center: [r.lng, r.lat],
                  zoom: Math.max(map.getZoom(), 11),
                  duration: transitionDurationMs,
                })
              })()
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div className="pointer-events-auto absolute right-0 top-0 z-40 h-full w-[420px] border-l border-white/10 bg-black/35 backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">TravelMate AI</span>
            <span className="text-[11px] text-white/70">Budget planner & itinerary chat</span>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/20 bg-black/30 px-2 py-1 text-[11px] text-white/90 hover:bg-black/50 transition"
            onClick={() => {
              setAiAutoPrompt(buildAiPrompt())
              setAiPromptNonce((v) => v + 1)
            }}
            title="生成省钱攻略"
          >
            一键生成
          </button>
        </div>
        <div className="px-3 py-2 border-b border-white/10">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[11px] text-white/70">
              Budget (元)
              <input
                type="number"
                value={aiBudget}
                onChange={(e) => setAiBudget(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none"
              />
            </label>
            <label className="text-[11px] text-white/70">
              Days
              <input
                type="number"
                value={aiDays}
                onChange={(e) => setAiDays(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="text-[11px] text-white/70">
              People
              <input
                type="number"
                value={aiPeople}
                onChange={(e) => setAiPeople(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none"
              />
            </label>
            <label className="text-[11px] text-white/70">
              Preference
              <select
                value={aiPreference}
                onChange={(e) => setAiPreference(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm text-white outline-none"
              >
                <option value="通用">通用</option>
                <option value="极限省钱">极限省钱</option>
                <option value="舒适平衡">舒适平衡</option>
                <option value="美食优先">美食优先</option>
                <option value="海岛放松">海岛放松</option>
                <option value="徒步自然">徒步自然</option>
                <option value="拍照出片">拍照出片</option>
                <option value="人文历史">人文历史</option>
                <option value="自然">自然</option>
              </select>
            </label>
          </div>
          <div className="mt-2 text-[11px] text-white/70">
            Destination：{aiDestination}
          </div>
        </div>
        <div className="h-[calc(100%-140px)] overflow-hidden">
          <AIChat autoPrompt={aiAutoPrompt} autoPromptNonce={aiPromptNonce} />
        </div>
      </div>

      {tokenMissing ? (
        <div className="absolute inset-x-4 top-20 z-50 rounded-xl border border-amber-300/50 bg-amber-500/15 p-3 text-sm text-amber-100 backdrop-blur">
          未检测到 `VITE_MAPBOX_ACCESS_TOKEN`，已预留 3D→Mapbox 过渡框架。配置 token 后即可启用地图无缝展开。
        </div>
      ) : null}
    </div>
  )
}

function CountryMorphOverlay({ feature, stage, progress, cameraSnapshot, mapInstance, theme = 'sky' }) {
  const canvasRef = useRef(null)
  const themeStyle = MORPH_THEME[theme] || MORPH_THEME.sky

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined
    let raf = 0
    let running = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.floor(window.innerWidth)
      const h = Math.floor(window.innerHeight)
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      if (!running) return
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)
      if (!feature?.geometry || stage !== 'transitioning' || !cameraSnapshot) {
        raf = window.requestAnimationFrame(draw)
        return
      }

      const tempCamera = new THREE.PerspectiveCamera(
        cameraSnapshot.fov,
        cameraSnapshot.aspect || w / Math.max(1, h),
        cameraSnapshot.near || 0.1,
        cameraSnapshot.far || 100,
      )
      tempCamera.position.fromArray(cameraSnapshot.position)
      tempCamera.quaternion.fromArray(cameraSnapshot.quaternion)
      tempCamera.updateProjectionMatrix()
      tempCamera.updateMatrixWorld()

      const rings = geometryToRings(feature.geometry)
      ctx.save()
      ctx.shadowColor = themeStyle.glow
      ctx.shadowBlur = 12
      ctx.lineWidth = 1.8
      ctx.strokeStyle = themeStyle.stroke
      ctx.fillStyle = themeStyle.fill

      ctx.beginPath()
      for (const ring of rings) {
        if (!Array.isArray(ring) || ring.length < 3) continue
        for (let i = 0; i < ring.length; i += 1) {
          const [lng, lat] = ring[i]
          const spherePoint = lonLatToVector3(Number(lng), Number(lat), EARTH_RADIUS, 0.015)
          const projected = spherePoint.clone().project(tempCamera)
          const sx = ((projected.x + 1) / 2) * w
          const sy = ((1 - projected.y) / 2) * h

          let tx = ((Number(lng) + 180) / 360) * w
          let ty = ((90 - Number(lat)) / 180) * h
          if (mapInstance && mapInstance.loaded()) {
            const p = mapInstance.project([Number(lng), Number(lat)])
            tx = p.x
            ty = p.y
          }

          const x = sx * (1 - progress) + tx * progress
          const y = sy * (1 - progress) + ty * progress
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
      }
      ctx.fill('evenodd')
      ctx.stroke()
      ctx.restore()

      // Country floating label follows the morph path.
      if (feature?.geometry) {
        const c = geoCentroid(feature.geometry)
        if (Array.isArray(c) && c.length >= 2) {
          const [lng, lat] = c
          const spherePoint = lonLatToVector3(Number(lng), Number(lat), EARTH_RADIUS, 0.02)
          const projected = spherePoint.clone().project(tempCamera)
          const sx = ((projected.x + 1) / 2) * w
          const sy = ((1 - projected.y) / 2) * h
          let tx = ((Number(lng) + 180) / 360) * w
          let ty = ((90 - Number(lat)) / 180) * h
          if (mapInstance && mapInstance.loaded()) {
            const p = mapInstance.project([Number(lng), Number(lat)])
            tx = p.x
            ty = p.y
          }
          const x = sx * (1 - progress) + tx * progress
          const y = sy * (1 - progress) + ty * progress
          const label = feature.name || feature.nameEn || 'Country'
          ctx.save()
          ctx.font = '600 13px Inter, Segoe UI, sans-serif'
          const tw = Math.max(72, ctx.measureText(label).width + 16)
          const th = 26
          ctx.shadowBlur = 0
          ctx.fillStyle = 'rgba(2,6,23,0.7)'
          ctx.fillRect(x - tw / 2, y - th - 12, tw, th)
          ctx.strokeStyle = themeStyle.stroke
          ctx.lineWidth = 1
          ctx.strokeRect(x - tw / 2, y - th - 12, tw, th)
          ctx.fillStyle = 'rgba(226,232,240,0.96)'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, x, y - th / 2 - 12)
          ctx.restore()
        }
      }

      raf = window.requestAnimationFrame(draw)
    }

    raf = window.requestAnimationFrame(draw)
    return () => {
      running = false
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [feature, stage, progress, cameraSnapshot, mapInstance, themeStyle])

  if (stage !== 'transitioning') return null
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[15]" />
}

export default function GlobeEntrance() {
  const [preludeVisible, setPreludeVisible] = useState(true)
  const [introDone, setIntroDone] = useState(false)
  const [skipRequested, setSkipRequested] = useState(false)
  const [lastClick, setLastClick] = useState(null)
  const [hoverCountry, setHoverCountry] = useState(null)
  const [selectedCountryId, setSelectedCountryId] = useState(null)
  const [resetToGlobalKey, setResetToGlobalKey] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [revealKey, setRevealKey] = useState(0)
  const [revealPulse, setRevealPulse] = useState(false)
  const [transitionStage, setTransitionStage] = useState('globe')
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [transitionDurationMs, setTransitionDurationMs] = useState(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return GLOBE_TO_MAP_TRANSITION_MS
    const raw = window.localStorage.getItem(DEV_STORAGE_KEYS.morphDuration)
    const n = Number(raw)
    if (!Number.isFinite(n)) return GLOBE_TO_MAP_TRANSITION_MS
    return Math.min(2600, Math.max(600, Math.round(n / 100) * 100))
  })
  const [mapReady, setMapReady] = useState(false)
  const [targetMapView, setTargetMapView] = useState(null)
  const [cameraSnapshot, setCameraSnapshot] = useState(null)
  const [showGuideAi, setShowGuideAi] = useState(false)
  const [guideAiNonce, setGuideAiNonce] = useState(0)
  const [assetReady, setAssetReady] = useState({ image: false, audio: false })
  const [allowMapTransition, setAllowMapTransition] = useState(false)
  const [controlFeel, setControlFeel] = useState('globe')
  const [dragSensitivity, setDragSensitivity] = useState('normal')
  const [inertiaLevel, setInertiaLevel] = useState('heavy')
  const [precisionPickMode, setPrecisionPickMode] = useState(true)
  const [interactionProfile, setInteractionProfile] = useState('balanced')
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [morphTheme, setMorphTheme] = useState(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return 'sky'
    const v = window.localStorage.getItem(DEV_STORAGE_KEYS.morphTheme)
    return MORPH_THEME[v] ? v : 'sky'
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundLevel, setSoundLevel] = useState('medium')
  const [keySfxOnly, setKeySfxOnly] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [showForceEnter, setShowForceEnter] = useState(false)
  const [debugPhase, setDebugPhase] = useState('boot')
  const [devPanelOpen, setDevPanelOpen] = useState(false)
  const [activePreset, setActivePreset] = useState('custom')
  const [cinematicTuning, setCinematicTuning] = useState(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return { ...DEFAULT_CINEMATIC_TUNING }
    const raw = window.localStorage.getItem(DEV_STORAGE_KEYS.cinematicTuning)
    return raw ? parseCinematicTuning(raw) : { ...DEFAULT_CINEMATIC_TUNING }
  })
  const controlsRef = useRef(null)
  const audioCtxRef = useRef(null)
  const welcomeAudioRef = useRef(null)
  const mapRef = useRef(null)
  const transitionTimerRef = useRef(null)

  const countryCentroids = useMemo(() => {
    return countries
      .map((c) => {
        const latlng = Array.isArray(c.latlng) ? c.latlng : null
        if (!latlng || latlng.length < 2) return null
        return {
          name: c.translations?.zho?.common || c.translations?.cmn?.common || c.name?.common || 'Unknown',
          nameEn: c.name?.common || 'Unknown',
          cca3: c.cca3 || '',
          lat: Number(latlng[0]),
          lng: Number(latlng[1]),
        }
      })
      .filter(Boolean)
  }, [])

  const countryMetaByNumeric = useMemo(() => {
    const map = new Map()
    for (const c of countries) {
      const numeric = normalizeNumericCode(c.ccn3)
      if (!numeric) continue
      const primaryLang = Object.keys(c.languages || {})[0] || 'eng'
      map.set(numeric, {
        name: c.translations?.zho?.common || c.translations?.cmn?.common || c.name?.common || '未知国家',
        nameEn: c.name?.common || 'Unknown',
        cca3: c.cca3 || '',
        capital: Array.isArray(c.capital) ? c.capital[0] : '',
        region: c.region || 'Asia',
        subregion: c.subregion || '',
        primaryLang,
      })
    }
    return map
  }, [])

  const countryPolygons = useMemo(() => {
    const fc = topojsonFeature(worldAtlas, worldAtlas.objects.countries)
    const features = Array.isArray(fc?.features) ? fc.features : []
    return features
      .map((f) => {
        const numericCode = normalizeNumericCode(f.id)
        const meta = countryMetaByNumeric.get(numericCode)
        const area = geoArea(f.geometry)
        return {
          id: numericCode || String(f.id || ''),
          geometry: f.geometry,
          area,
          name: meta?.name || `国家-${numericCode || 'unknown'}`,
          nameEn: meta?.nameEn || `Country-${numericCode || 'unknown'}`,
          cca3: meta?.cca3 || '',
          capital: meta?.capital || '',
          region: meta?.region || 'Asia',
          subregion: meta?.subregion || '',
          primaryLang: meta?.primaryLang || 'eng',
        }
      })
      .filter((f) => !!f.geometry && Number.isFinite(f.area) && f.area > 0 && f.area <= MAX_REASONABLE_COUNTRY_AREA)
  }, [countryMetaByNumeric])

  const selectedFeature = useMemo(
    () => countryPolygons.find((f) => f.id === selectedCountryId) || null,
    [countryPolygons, selectedCountryId],
  )
  const polygonByCca3 = useMemo(() => {
    const map = new Map()
    for (const p of countryPolygons) {
      if (p.cca3) map.set(p.cca3, p)
    }
    return map
  }, [countryPolygons])
  const eastAsiaPolygons = useMemo(
    () => EAST_ASIA_SAFE_CCA3.map((code) => polygonByCca3.get(code)).filter(Boolean),
    [polygonByCca3],
  )
  const activeCountryProfile = useMemo(
    () => (selectedFeature ? buildCountryGuideProfile(selectedFeature) : null),
    [selectedFeature],
  )
  const activeCharacterImage = useMemo(
    () => (selectedFeature && activeCountryProfile ? buildCharacterSvgDataUrl(selectedFeature, activeCountryProfile) : ''),
    [selectedFeature, activeCountryProfile],
  )

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (transitionStage !== 'transitioning') return
    const done = window.setTimeout(() => {
      setTransitionStage('map')
    }, transitionDurationMs)
    return () => window.clearTimeout(done)
  }, [transitionStage, transitionDurationMs])

  useEffect(() => {
    if (transitionStage !== 'transitioning') {
      setTransitionProgress(0)
      return
    }
    let raf = 0
    const started = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - started) / Math.max(300, transitionDurationMs))
      setTransitionProgress(p)
      if (p < 1) raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [transitionStage, transitionDurationMs])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!activeCharacterImage) return undefined
    const img = new Image()
    img.src = activeCharacterImage
    img.onload = () => setAssetReady((prev) => ({ ...prev, image: true }))
    img.onerror = () => setAssetReady((prev) => ({ ...prev, image: false }))
    return undefined
  }, [activeCharacterImage])

  useEffect(() => {
    const audio = new Audio(DEFAULT_GUIDE_AUDIO_URL)
    audio.preload = 'auto'
    welcomeAudioRef.current = audio
    const onCanPlay = () => setAssetReady((prev) => ({ ...prev, audio: true }))
    const onError = () => setAssetReady((prev) => ({ ...prev, audio: false }))
    audio.addEventListener('canplaythrough', onCanPlay, { once: true })
    audio.addEventListener('error', onError, { once: true })
    audio.load()
    return () => {
      audio.pause()
      welcomeAudioRef.current = null
    }
  }, [])

  const cameraConfig = useMemo(
    () => ({
      position: isMobile ? [0, 0.15, 3.8] : [0, 0.2, 3.4],
      fov: isMobile ? 52 : 46,
      near: 0.1,
      far: 100,
    }),
    [isMobile],
  )

  const controlParams = useMemo(() => {
    if (controlFeel === 'globe') {
      return {
        dampingFactor: 0.04,
        rotateSpeed: 1.15,
        zoomSpeed: 0.7,
        autoRotateSpeed: 0.26,
        minPolarAngle: Math.PI / 2,
        maxPolarAngle: Math.PI / 2,
      }
    }
    if (controlFeel === 'cinema') {
      return {
        dampingFactor: 0.06,
        rotateSpeed: 0.72,
        zoomSpeed: 0.58,
        autoRotateSpeed: 0.2,
        minPolarAngle: Math.PI / 2 - 0.45,
        maxPolarAngle: Math.PI / 2 + 0.45,
      }
    }
    return {
      dampingFactor: 0.045,
      rotateSpeed: 1.02,
      zoomSpeed: 0.72,
      autoRotateSpeed: 0.28,
      minPolarAngle: Math.PI / 2 - 0.3,
      maxPolarAngle: Math.PI / 2 + 0.3,
    }
  }, [controlFeel])

  useEffect(() => {
    const stopInteract = () => setIsUserInteracting(false)
    window.addEventListener('pointerup', stopInteract)
    window.addEventListener('touchend', stopInteract)
    window.addEventListener('mouseup', stopInteract)
    return () => {
      window.removeEventListener('pointerup', stopInteract)
      window.removeEventListener('touchend', stopInteract)
      window.removeEventListener('mouseup', stopInteract)
    }
  }, [])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return undefined
    const handleStart = () => setIsUserInteracting(true)
    const handleEnd = () => setIsUserInteracting(false)
    controls.addEventListener('start', handleStart)
    controls.addEventListener('end', handleEnd)
    return () => {
      controls.removeEventListener('start', handleStart)
      controls.removeEventListener('end', handleEnd)
    }
  }, [controlsRef])

  const resolveCountryMatch = (lat, lng) => {
    const microOverride = pickMicrostateOverride(lat, lng, polygonByCca3)
    if (microOverride) {
      return {
        matchedFeature: microOverride,
        nearest: null,
        nearestCentroid: null,
        eastAsiaPriorityHit: null,
        matchedArea: microOverride?.geometry ? geoArea(microOverride.geometry) : 0,
      }
    }
    const microAssist = pickMicroClickAssist(lat, lng, polygonByCca3)
    if (microAssist) {
      return {
        matchedFeature: microAssist,
        nearest: null,
        nearestCentroid: null,
        eastAsiaPriorityHit: null,
        matchedArea: microAssist?.geometry ? geoArea(microAssist.geometry) : 0,
      }
    }

    if (isEastAsiaFocus(lat, lng)) {
      const eastHit = findCountryByPolygon(lat, lng, eastAsiaPolygons)
      if (eastHit) {
        return {
          matchedFeature: eastHit,
          nearest: null,
          nearestCentroid: null,
          eastAsiaPriorityHit: eastHit,
          matchedArea: eastHit?.geometry ? geoArea(eastHit.geometry) : 0,
        }
      }
      let best = null
      let minDist = Infinity
      for (const candidate of eastAsiaPolygons) {
        if (!candidate?.geometry) continue
        const c = geoCentroid(candidate.geometry)
        if (!Array.isArray(c) || c.length < 2) continue
        const dist = haversineKm(lat, lng, Number(c[1]), Number(c[0]))
        if (dist < minDist) {
          minDist = dist
          best = candidate
        }
      }
      if (best && minDist <= EAST_ASIA_FALLBACK_MAX_KM) {
        return {
          matchedFeature: best,
          nearest: null,
          nearestCentroid: null,
          eastAsiaPriorityHit: best,
          matchedArea: best?.geometry ? geoArea(best.geometry) : 0,
        }
      }
      return { matchedFeature: null, nearest: null, nearestCentroid: null, eastAsiaPriorityHit: null, matchedArea: 0 }
    }

    const polygonHit = findCountryByPolygon(lat, lng, countryPolygons)
    const nearestCentroid = findNearestCountry(lat, lng, countryCentroids)
    const nearestLimit = nearestCentroid?.cca3 && SMALL_ISLAND_FALLBACK_CCA3.has(nearestCentroid.cca3)
      ? SMALL_ISLAND_FALLBACK_MAX_KM
      : NEAREST_COUNTRY_SNAP_KM
    const nearest = nearestCentroid && nearestCentroid.distanceKm <= nearestLimit ? nearestCentroid : null
    const fallbackByNearest = !polygonHit && nearest?.cca3 ? polygonByCca3.get(nearest.cca3) || null : null
    let eastAsiaPriorityHit = null
    const matchedFeature =
      polygonHit ||
      fallbackByNearest ||
      eastAsiaPriorityHit ||
      null
    const matchedArea = matchedFeature?.geometry ? geoArea(matchedFeature.geometry) : 0
    return { matchedFeature, nearest, nearestCentroid, eastAsiaPriorityHit, matchedArea }
  }

  const resolveWithFallbackGeo = ({ lat, lng, latAlt, lngAlt }) => {
    const primary = resolveCountryMatch(lat, lng)
    const hasAlt = Number.isFinite(latAlt) && Number.isFinite(lngAlt)
    if (!hasAlt) return primary
    const alt = resolveCountryMatch(latAlt, lngAlt)
    if (isEastAsiaFocus(lat, lng) || isEastAsiaFocus(latAlt, lngAlt)) {
      const pCode = primary.matchedFeature?.cca3 || ''
      const aCode = alt.matchedFeature?.cca3 || ''
      const pEast = EAST_ASIA_SAFE_CCA3.includes(pCode)
      const aEast = EAST_ASIA_SAFE_CCA3.includes(aCode)
      if (!pEast && aEast) return alt
      if (pEast && aEast && pCode && aCode && pCode !== aCode) {
        const pIn = inCountryHintBox(pCode, lat, lng)
        const aIn = inCountryHintBox(aCode, latAlt, lngAlt)
        if (!pIn && aIn) return alt
      }
    }
    return primary
  }

  const handleGeoHover = (payload) => {
    if (!payload) {
      setHoverCountry(null)
      return
    }
    const { lat, lng, latAlt, lngAlt } = payload
    const { matchedFeature } = resolveWithFallbackGeo({ lat, lng, latAlt, lngAlt })
    setHoverCountry((prev) => {
      const nextId = matchedFeature?.id || null
      const prevId = prev?.id || prev?.cca3 || null
      if (prevId === nextId) return prev
      if (!matchedFeature) return null
      return {
        id: matchedFeature?.id || null,
        cca3: matchedFeature?.cca3 || '',
        name: matchedFeature?.name || '未知区域',
        nameEn: matchedFeature?.nameEn || 'Unknown',
      }
    })
  }

  const handleGeoClick = ({ lat, lng, latAlt, lngAlt }) => {
    const { matchedFeature, nearestCentroid, eastAsiaPriorityHit } = resolveWithFallbackGeo({ lat, lng, latAlt, lngAlt })
    const finalFeature = matchedFeature
    const hitId = finalFeature?.id || null
    if (hitId && hitId === selectedCountryId) {
      setSelectedCountryId(null)
      setResetToGlobalKey((v) => v + 1)
      setLastClick(null)
      setTransitionStage('globe')
      return
    }
    setSelectedCountryId(hitId)
    setHoverCountry(
      finalFeature
        ? {
            id: finalFeature.id,
            cca3: finalFeature.cca3 || '',
            name: finalFeature.name,
            nameEn: finalFeature.nameEn,
          }
        : null,
    )
    console.log(
      '[GlobeEntrance] clicked lat/lng:',
      lat.toFixed(4),
      lng.toFixed(4),
      '| matched country:',
      finalFeature?.nameEn || 'unknown',
    )
    setLastClick({
      lat,
      lng,
      countryName: finalFeature?.name || '未知区域',
      countryNameEn: finalFeature?.nameEn || 'Unknown',
      distanceKm: nearestCentroid?.distanceKm || (eastAsiaPriorityHit ? 0 : null),
    })

    if (finalFeature?.geometry && allowMapTransition) {
      const centroid = geoCentroid(finalFeature.geometry)
      const bounds = geometryToBounds(finalFeature.geometry)
      const azimuth = controlsRef.current?.getAzimuthalAngle?.() || 0
      const bearing = THREE.MathUtils.radToDeg(-azimuth)
      const transitionPitch = estimatePitchFromCameraSnapshot(cameraSnapshot)
      const transitionZoom = bounds ? estimateZoomFromBounds(bounds) : 3.4
      setTargetMapView({
        center: Array.isArray(centroid) ? centroid : [lng, lat],
        bounds,
        area: finalFeature.area || 0,
        bearing,
        pitch: 0,
        transitionPitch,
        transitionZoom,
      })
      if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current)
      transitionTimerRef.current = window.setTimeout(() => {
        setTransitionStage('transitioning')
      }, transitionDurationMs)
    }
  }

  const onSkip = () => {
    if (import.meta.env.DEV) console.log('[GlobeDebug] manual skip clicked')
    setPreludeVisible(false)
    setSkipRequested(true)
    setIntroDone(true)
    setRevealPulse(true)
    setRevealKey((v) => v + 1)
  }

  const handleGuidePopupClose = () => {
    setShowGuideAi(true)
    setGuideAiNonce((v) => v + 1)
  }

  useEffect(() => {
    if (!revealPulse) return
    const t = window.setTimeout(() => setRevealPulse(false), 760)
    return () => window.clearTimeout(t)
  }, [revealPulse])

  useEffect(() => {
    if (!preludeVisible) return
    setDebugPhase('prelude-visible')
    if (import.meta.env.DEV) console.log('[GlobeDebug] prelude visible')
    const showBtnTimer = window.setTimeout(() => setShowForceEnter(true), 2200)
    const hardFallback = window.setTimeout(() => {
      if (import.meta.env.DEV) console.log('[GlobeDebug] hard fallback enter globe')
      setPreludeVisible(false)
      setRevealPulse(true)
      setRevealKey((v) => v + 1)
    }, PRELUDE_GLITCH_MS + PRELUDE_SLOGAN_HOLD_MS + PRELUDE_FADE_MS + 900)
    return () => {
      window.clearTimeout(showBtnTimer)
      window.clearTimeout(hardFallback)
      setShowForceEnter(false)
    }
  }, [preludeVisible])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    console.log('[GlobeDebug] state', {
      preludeVisible,
      introDone,
      transitionStage,
      revealKey,
      skipRequested,
      showForceEnter,
    })
  }, [preludeVisible, introDone, transitionStage, revealKey, skipRequested, showForceEnter])

  useEffect(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return
    window.localStorage.setItem(DEV_STORAGE_KEYS.morphDuration, String(transitionDurationMs))
  }, [transitionDurationMs])

  useEffect(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return
    window.localStorage.setItem(DEV_STORAGE_KEYS.morphTheme, morphTheme)
  }, [morphTheme])

  useEffect(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return
    window.localStorage.setItem(DEV_STORAGE_KEYS.cinematicTuning, JSON.stringify(cinematicTuning))
  }, [cinematicTuning])

  useEffect(() => {
    const matched = Object.entries(PRODUCTION_PRESETS).find(([, preset]) => {
      if (preset.transitionDurationMs !== transitionDurationMs) return false
      if (preset.controlFeel !== controlFeel) return false
      const t = preset.tuning
      return (
        Math.abs(cinematicTuning.roadBaseOpacity - t.roadBaseOpacity) < 1e-6 &&
        Math.abs(cinematicTuning.roadBoostOpacity - t.roadBoostOpacity) < 1e-6 &&
        Math.abs(cinematicTuning.poiStartZoom - t.poiStartZoom) < 1e-6 &&
        Math.abs(cinematicTuning.poiZoomRange - t.poiZoomRange) < 1e-6 &&
        Math.abs(cinematicTuning.buildingStartZoom - t.buildingStartZoom) < 1e-6 &&
        Math.abs(cinematicTuning.buildingZoomRange - t.buildingZoomRange) < 1e-6 &&
        Math.abs(cinematicTuning.buildingMaxOpacity - t.buildingMaxOpacity) < 1e-6 &&
        Math.abs(cinematicTuning.smallCountryAreaThreshold - t.smallCountryAreaThreshold) < 1e-6
      )
    })
    setActivePreset(matched ? matched[0] : 'custom')
  }, [cinematicTuning, transitionDurationMs, controlFeel])

  const ensureAudioContext = useCallback(() => {
    if (!soundEnabled) return null
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return null
      audioCtxRef.current = new Ctx()
    }
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()
    setAudioReady(ctx.state === 'running')
    return ctx
  }, [soundEnabled])

  useEffect(() => {
    const unlock = () => {
      ensureAudioContext()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [ensureAudioContext])

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close()
    }
  }, [])

  const playTone = (ctx, { freq = 220, duration = 0.12, type = 'sine', gain = 0.03, glideTo = null } = {}) => {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const amp = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, now)
    if (glideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(0.001, glideTo), now + duration)
    }
    amp.gain.setValueAtTime(0.0001, now)
    amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), now + 0.02)
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    osc.connect(amp).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + duration + 0.03)
  }

  const playNoiseBurst = (ctx, { duration = 0.18, gain = 0.018 } = {}) => {
    const now = ctx.currentTime
    const length = Math.max(1, Math.floor(ctx.sampleRate * duration))
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const amp = ctx.createGain()
    amp.gain.setValueAtTime(gain, now)
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    source.connect(amp).connect(ctx.destination)
    source.start(now)
    source.stop(now + duration + 0.02)
  }

  const handleSfxCue = useCallback((cue) => {
    console.log('[GlobeEntrance:sfx]', cue)
    const ctx = ensureAudioContext()
    if (!ctx || !soundEnabled) return
    const gainScale = soundLevel === 'low' ? 0.55 : soundLevel === 'high' ? 1.45 : 1
    const isKeyCue = cue === 'prelude:start' || cue === 'reveal:dolly-start' || cue === 'reveal:dolly-end'
    if (keySfxOnly && !isKeyCue) return

    const tone = (opts) => playTone(ctx, { ...opts, gain: (opts.gain || 0.01) * gainScale })
    const noise = (opts) => playNoiseBurst(ctx, { ...opts, gain: (opts.gain || 0.01) * gainScale })

    if (cue === 'prelude:start') {
      noise({ duration: 0.26, gain: 0.014 })
      tone({ freq: 92, glideTo: 78, duration: 0.22, type: 'sawtooth', gain: 0.008 })
      return
    }
    if (cue === 'prelude:slogan-complete') {
      tone({ freq: 440, duration: 0.08, type: 'triangle', gain: 0.018 })
      tone({ freq: 554, duration: 0.1, type: 'triangle', gain: 0.014 })
      return
    }
    if (cue === 'prelude:fade') {
      tone({ freq: 310, glideTo: 210, duration: 0.2, type: 'sine', gain: 0.012 })
      return
    }
    if (cue === 'reveal:dolly-start') {
      tone({ freq: 180, glideTo: 620, duration: 0.38, type: 'sawtooth', gain: 0.013 })
      noise({ duration: 0.12, gain: 0.009 })
      return
    }
    if (cue === 'reveal:dolly-end') {
      tone({ freq: 520, duration: 0.12, type: 'triangle', gain: 0.016 })
    }
  }, [ensureAudioContext, keySfxOnly, soundEnabled, soundLevel])

  const handlePreludeDone = useCallback(() => {
    if (import.meta.env.DEV) console.log('[GlobeDebug] prelude onDone fired')
    setPreludeVisible(false)
    setRevealPulse(true)
    setRevealKey((v) => v + 1)
    setDebugPhase('prelude-done')
  }, [])

  const applyProductionPreset = useCallback((key) => {
    const preset = PRODUCTION_PRESETS[key]
    if (!preset) return
    setTransitionDurationMs(preset.transitionDurationMs)
    setControlFeel(preset.controlFeel)
    setCinematicTuning(parseCinematicTuning(JSON.stringify(preset.tuning)))
    setActivePreset(key)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const key = normalizePresetKey(new URLSearchParams(window.location.search).get('preset'))
    if (key) applyProductionPreset(key)
  }, [applyProductionPreset])

  useEffect(() => {
    syncPresetToUrl(activePreset)
  }, [activePreset])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      {preludeVisible ? (
        <GlitchPrelude
          onDone={handlePreludeDone}
          onSfxCue={handleSfxCue}
        />
      ) : null}
      {preludeVisible && showForceEnter ? (
        <button
          type="button"
          onClick={() => {
            if (import.meta.env.DEV) console.log('[GlobeDebug] force enter clicked')
            setPreludeVisible(false)
            setRevealPulse(true)
            setRevealKey((v) => v + 1)
            setDebugPhase('force-enter')
          }}
          className="fixed right-4 top-4 z-[130] rounded-full border border-white/30 bg-black/55 px-4 py-2 text-xs text-white backdrop-blur hover:bg-black/75"
        >
          立即进入地球
        </button>
      ) : null}
      <GlobeToMapStage
        stage={transitionStage}
        progress={transitionProgress}
        cinematicTuning={cinematicTuning}
        targetView={targetMapView}
        transitionDurationMs={transitionDurationMs}
        onMapReady={(map) => {
          mapRef.current = map
          setMapReady(true)
        }}
        activeCountry={
          selectedFeature
            ? {
                ...selectedFeature,
                center: Array.isArray(targetMapView?.center) ? targetMapView.center : geoCentroid(selectedFeature.geometry),
                icon: activeCountryProfile?.icon || '',
                motif: activeCountryProfile?.motif || '',
                localGreeting: activeCountryProfile?.localGreeting || '',
              }
            : null
        }
        characterImageUrl={
          assetReady.image && activeCharacterImage
            ? activeCharacterImage
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80'
        }
        welcomeText={
          activeCountryProfile?.welcomeText ||
          `Welcome to ${selectedFeature?.nameEn || selectedFeature?.name || 'this destination'}!`
        }
        welcomeAudio={welcomeAudioRef.current}
        welcomeAudioReady={assetReady.audio}
        onGuidePopupClose={handleGuidePopupClose}
      />
      <CountryMorphOverlay
        feature={selectedFeature}
        stage={transitionStage}
        progress={transitionProgress}
        cameraSnapshot={cameraSnapshot}
        mapInstance={mapRef.current}
        theme={morphTheme}
      />
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.8]}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
        camera={cameraConfig}
        onPointerDown={() => setIsUserInteracting(true)}
        onPointerUp={() => setIsUserInteracting(false)}
        onPointerLeave={() => setIsUserInteracting(false)}
        onTouchStart={() => setIsUserInteracting(true)}
        onTouchEnd={() => setIsUserInteracting(false)}
        style={{ touchAction: 'none' }}
        className={`relative z-0 pointer-events-auto transition-opacity duration-[1200ms] ${
          transitionStage === 'globe' ? 'opacity-100' : transitionStage === 'transitioning' ? 'opacity-0' : 'opacity-0 pointer-events-none'
        }`}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 6, 14]} />
        <ambientLight intensity={0.52} />
        <pointLight position={[4.2, 2.8, 4.8]} intensity={1.45} color="#ffffff" />
        <pointLight position={[-3.2, -2.4, -4.2]} intensity={0.45} color="#60a5fa" />
        <Suspense fallback={null}>
          <CameraSnapshotBridge onSnapshot={setCameraSnapshot} />
          <RevealCameraIntro
            trigger={revealKey}
            controlsRef={controlsRef}
            isMobile={isMobile}
            onSfxCue={handleSfxCue}
          />
          <CameraFocusController
            selectedFeature={selectedFeature}
            controlsRef={controlsRef}
            isMobile={isMobile}
            resetToGlobalKey={resetToGlobalKey}
            isUserInteracting={isUserInteracting}
          />
          <Earth
            introDone={introDone}
            skipRequested={skipRequested}
            onIntroDone={() => setIntroDone(true)}
            onCountryClick={handleGeoClick}
            onHoverGeo={handleGeoHover}
            lowPerf={isMobile}
            selectedFeature={selectedFeature}
            startAnimation={!preludeVisible}
            isUserInteracting={isUserInteracting}
            onInteractionChange={setIsUserInteracting}
            dragSensitivity={dragSensitivity}
            inertiaLevel={inertiaLevel}
            precisionPickMode={precisionPickMode}
            interactionProfile={interactionProfile}
          />
          <Stars radius={100} depth={40} count={isMobile ? 1200 : 2200} factor={2.8} saturation={0} fade speed={0.55} />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enableRotate={false}
          enableZoom
          enablePan={false}
          enableDamping={false}
          dampingFactor={controlParams.dampingFactor}
          rotateSpeed={controlParams.rotateSpeed}
          zoomSpeed={controlParams.zoomSpeed}
          autoRotate={false}
          autoRotateSpeed={controlParams.autoRotateSpeed}
          minPolarAngle={controlParams.minPolarAngle}
          maxPolarAngle={controlParams.maxPolarAngle}
          minDistance={2}
          maxDistance={6}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_ROTATE,
          }}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
          target={[0, 0, 0]}
        />
      </Canvas>

      {revealPulse ? (
        <motion.div
          initial={{ opacity: 0.75, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.55 }}
          transition={{ duration: 0.72, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.36) 0%, rgba(56,189,248,0.14) 20%, rgba(2,6,23,0) 66%)',
          }}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 md:p-6">
        <div className="rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs md:text-sm backdrop-blur">
          Roamwise 3D Globe Entrance
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] text-slate-200/90 backdrop-blur">
          {transitionStage === 'globe'
            ? '3D Globe'
            : transitionStage === 'transitioning'
              ? '3D -> 2D Transitioning'
              : mapReady
                ? 'Mapbox Ready'
                : 'Mapbox Loading'}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={activePreset}
            onChange={(e) => {
              const v = e.target.value
              if (v === 'custom') return
              applyProductionPreset(v)
            }}
            className="rounded-full border border-white/25 bg-black/40 px-3 py-2 text-xs md:text-sm font-medium hover:bg-black/60 transition"
            aria-label="过渡预设"
            title="过渡预设"
          >
            <option value="custom">自定义</option>
            {Object.entries(PRODUCTION_PRESETS).map(([key, preset]) => (
              <option key={key} value={key}>
                {preset.label}
              </option>
            ))}
          </select>
          <select
            value={interactionProfile}
            onChange={(e) => setInteractionProfile(e.target.value)}
            className="rounded-full border border-white/25 bg-black/40 px-3 py-2 text-xs md:text-sm font-medium hover:bg-black/60 transition"
            aria-label="交互模式"
            title="交互模式"
          >
            <option value="click">点击优先</option>
            <option value="balanced">平衡模式</option>
            <option value="drag">拖拽优先</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSoundEnabled((v) => !v)
              if (!soundEnabled && audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume()
            }}
            className="rounded-full border border-white/25 bg-black/40 px-3 py-2 text-xs md:text-sm font-medium hover:bg-black/60 transition"
            title={audioReady ? '音效就绪' : '点击页面以启用音频'}
          >
            {soundEnabled ? '🔊 音效开' : '🔇 音效关'}
          </button>
          <select
            value={soundLevel}
            onChange={(e) => setSoundLevel(e.target.value)}
            className="rounded-full border border-white/25 bg-black/40 px-3 py-2 text-xs md:text-sm font-medium hover:bg-black/60 transition"
            aria-label="音效强度"
            title="音效强度"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
          <button
            type="button"
            onClick={() => setKeySfxOnly((v) => !v)}
            className={`rounded-full border px-3 py-2 text-xs md:text-sm font-medium transition ${
              keySfxOnly
                ? 'border-emerald-300/60 bg-emerald-500/25 text-emerald-100'
                : 'border-white/25 bg-black/40 hover:bg-black/60'
            }`}
            title="仅关键音效"
          >
            {keySfxOnly ? '关键音效' : '全音效'}
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-full border border-white/25 bg-black/40 px-4 py-2 text-xs md:text-sm font-medium hover:bg-black/60 transition"
          >
            跳过动画
          </button>
          <button
            type="button"
            onClick={() => setPrecisionPickMode((v) => !v)}
            className={`rounded-full border px-3 py-2 text-xs md:text-sm font-medium transition ${
              precisionPickMode
                ? 'border-amber-300/60 bg-amber-500/25 text-amber-100'
                : 'border-white/25 bg-black/40 hover:bg-black/60'
            }`}
            title="精确点选模式"
          >
            {precisionPickMode ? '精确点选: 开' : '精确点选: 关'}
          </button>
        </div>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-16 z-20 -translate-x-1/2 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs text-amber-200 backdrop-blur">
        当前命中: {hoverCountry?.name || selectedFeature?.name || '未命中'} ({hoverCountry?.nameEn || selectedFeature?.nameEn || 'N/A'})
      </div>
      {selectedFeature ? (
        <div className="pointer-events-none absolute left-1/2 top-26 z-20 -translate-x-1/2 rounded-full border border-emerald-300/35 bg-black/45 px-3 py-1 text-xs text-emerald-200 backdrop-blur">
          已选国家: {selectedFeature.name} ({selectedFeature.nameEn})
        </div>
      ) : null}

      {import.meta.env.DEV ? (
        <div className="absolute right-4 top-20 z-20">
          <button
            type="button"
            onClick={() => setDevPanelOpen((v) => !v)}
            className="mb-2 ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/45 text-sm text-slate-100 backdrop-blur hover:bg-black/65 transition"
            title={devPanelOpen ? '收起调试面板' : '展开调试面板'}
            aria-label={devPanelOpen ? '收起调试面板' : '展开调试面板'}
          >
            {devPanelOpen ? '×' : '⚙'}
          </button>
          {devPanelOpen ? (
            <div className="rounded-xl border border-white/15 bg-black/35 p-2.5 backdrop-blur-md">
              <p className="mb-2 text-[11px] font-semibold text-slate-200">Morph Dev Controls</p>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[11px] text-slate-300">时长</span>
                <input
                  type="range"
                  min={600}
                  max={2600}
                  step={100}
                  value={transitionDurationMs}
                  onChange={(e) => setTransitionDurationMs(Number(e.target.value))}
                  className="w-28"
                />
                <span className="w-12 text-[11px] text-slate-300">{transitionDurationMs}ms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-300">主题</span>
                {[
                  { key: 'sky', label: '蓝' },
                  { key: 'violet', label: '紫' },
                  { key: 'mint', label: '青' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setMorphTheme(item.key)}
                    className={`rounded-full border px-2 py-1 text-[11px] ${
                      morphTheme === item.key ? MORPH_THEME[item.key].chip : 'border-white/20 bg-black/30 text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setAllowMapTransition((v) => !v)
                  if (!allowMapTransition) {
                    setTransitionStage('globe')
                  }
                }}
                className={`mt-2 rounded-full border px-3 py-1 text-[11px] transition ${
                  allowMapTransition
                    ? 'border-amber-300/70 bg-amber-500/25 text-amber-100'
                    : 'border-white/25 bg-black/30 text-slate-200 hover:bg-black/50'
                }`}
              >
                {allowMapTransition ? '自动展开地图: 开' : '自动展开地图: 关'}
              </button>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-slate-300">手感</span>
                <button
                  type="button"
                  onClick={() => setControlFeel('soft')}
                  className={`rounded-full border px-2 py-1 text-[11px] ${
                    controlFeel === 'soft'
                      ? 'border-cyan-300/70 bg-cyan-500/25 text-cyan-100'
                      : 'border-white/25 bg-black/30 text-slate-200'
                  }`}
                >
                  标准柔和
                </button>
                <button
                  type="button"
                  onClick={() => setControlFeel('cinema')}
                  className={`rounded-full border px-2 py-1 text-[11px] ${
                    controlFeel === 'cinema'
                      ? 'border-fuchsia-300/70 bg-fuchsia-500/25 text-fuchsia-100'
                      : 'border-white/25 bg-black/30 text-slate-200'
                  }`}
                >
                  影院柔和
                </button>
                <button
                  type="button"
                  onClick={() => setControlFeel('globe')}
                  className={`rounded-full border px-2 py-1 text-[11px] ${
                    controlFeel === 'globe'
                      ? 'border-emerald-300/70 bg-emerald-500/25 text-emerald-100'
                      : 'border-white/25 bg-black/30 text-slate-200'
                  }`}
                >
                  真实地球仪
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-slate-300">拖拽灵敏度</span>
                {[
                  { key: 'slow', label: '慢' },
                  { key: 'normal', label: '标准' },
                  { key: 'fast', label: '快' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setDragSensitivity(item.key)}
                    className={`rounded-full border px-2 py-1 text-[11px] ${
                      dragSensitivity === item.key
                        ? 'border-sky-300/70 bg-sky-500/25 text-sky-100'
                        : 'border-white/25 bg-black/30 text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-slate-300">惯性强度</span>
                {[
                  { key: 'light', label: '轻' },
                  { key: 'medium', label: '中' },
                  { key: 'heavy', label: '重' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setInertiaLevel(item.key)}
                    className={`rounded-full border px-2 py-1 text-[11px] ${
                      inertiaLevel === item.key
                        ? 'border-violet-300/70 bg-violet-500/25 text-violet-100'
                        : 'border-white/25 bg-black/30 text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-2 space-y-2 border-t border-white/10 pt-2">
                <p className="text-[11px] text-slate-300">Cinematic 调参</p>
                <div className="flex items-center gap-2">
                  {Object.entries(PRODUCTION_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => applyProductionPreset(key)}
                      className={`rounded-full border px-2 py-1 text-[11px] ${
                        activePreset === key
                          ? 'border-emerald-300/70 bg-emerald-500/25 text-emerald-100'
                          : 'border-white/25 bg-black/30 text-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2">
                  <span className="w-20 text-[11px] text-slate-300">道路增强</span>
                  <input
                    type="range"
                    min={0.2}
                    max={1.2}
                    step={0.05}
                    value={cinematicTuning.roadBoostOpacity}
                    onChange={(e) =>
                      setCinematicTuning((prev) => ({ ...prev, roadBoostOpacity: Number(e.target.value) }))
                    }
                    className="w-28"
                  />
                  <span className="w-10 text-[11px] text-slate-300">{cinematicTuning.roadBoostOpacity.toFixed(2)}</span>
                </label>
                <label className="flex items-center gap-2">
                  <span className="w-20 text-[11px] text-slate-300">POI起始</span>
                  <input
                    type="range"
                    min={6}
                    max={14}
                    step={0.2}
                    value={cinematicTuning.poiStartZoom}
                    onChange={(e) => setCinematicTuning((prev) => ({ ...prev, poiStartZoom: Number(e.target.value) }))}
                    className="w-28"
                  />
                  <span className="w-10 text-[11px] text-slate-300">z{cinematicTuning.poiStartZoom.toFixed(1)}</span>
                </label>
                <label className="flex items-center gap-2">
                  <span className="w-20 text-[11px] text-slate-300">建筑起始</span>
                  <input
                    type="range"
                    min={10}
                    max={15}
                    step={0.2}
                    value={cinematicTuning.buildingStartZoom}
                    onChange={(e) =>
                      setCinematicTuning((prev) => ({ ...prev, buildingStartZoom: Number(e.target.value) }))
                    }
                    className="w-28"
                  />
                  <span className="w-10 text-[11px] text-slate-300">z{cinematicTuning.buildingStartZoom.toFixed(1)}</span>
                </label>
                <label className="flex items-center gap-2">
                  <span className="w-20 text-[11px] text-slate-300">建筑强度</span>
                  <input
                    type="range"
                    min={0.1}
                    max={0.95}
                    step={0.05}
                    value={cinematicTuning.buildingMaxOpacity}
                    onChange={(e) =>
                      setCinematicTuning((prev) => ({ ...prev, buildingMaxOpacity: Number(e.target.value) }))
                    }
                    className="w-28"
                  />
                  <span className="w-10 text-[11px] text-slate-300">{cinematicTuning.buildingMaxOpacity.toFixed(2)}</span>
                </label>
                <label className="flex items-center gap-2">
                  <span className="w-20 text-[11px] text-slate-300">小国阈值</span>
                  <input
                    type="range"
                    min={0.0002}
                    max={0.01}
                    step={0.0002}
                    value={cinematicTuning.smallCountryAreaThreshold}
                    onChange={(e) =>
                      setCinematicTuning((prev) => ({ ...prev, smallCountryAreaThreshold: Number(e.target.value) }))
                    }
                    className="w-28"
                  />
                  <span className="w-10 text-[11px] text-slate-300">
                    {cinematicTuning.smallCountryAreaThreshold.toFixed(4)}
                  </span>
                </label>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTransitionDurationMs(GLOBE_TO_MAP_TRANSITION_MS)
                  setMorphTheme('sky')
                  setAllowMapTransition(false)
                  setControlFeel('globe')
                  setDragSensitivity('normal')
                  setInertiaLevel('heavy')
                  setPrecisionPickMode(true)
                  setInteractionProfile('balanced')
                  setCinematicTuning({ ...DEFAULT_CINEMATIC_TUNING })
                  setActivePreset('custom')
                  if (typeof window !== 'undefined') {
                    window.localStorage.removeItem(DEV_STORAGE_KEYS.morphDuration)
                    window.localStorage.removeItem(DEV_STORAGE_KEYS.morphTheme)
                    window.localStorage.removeItem(DEV_STORAGE_KEYS.cinematicTuning)
                  }
                }}
                className="mt-2 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[11px] text-slate-200 hover:bg-black/50 transition"
              >
                恢复默认
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      {import.meta.env.DEV ? (
        <div className="fixed bottom-3 left-3 z-[140] rounded-lg border border-lime-300/40 bg-black/70 px-3 py-1.5 text-[11px] text-lime-200">
          phase={debugPhase} | prelude={String(preludeVisible)} | introDone={String(introDone)} | stage={transitionStage}
        </div>
      ) : null}

      <aside
        className={`absolute right-0 top-0 z-40 h-full w-full max-w-[28rem] border-l border-slate-200/20 bg-slate-950/92 shadow-2xl backdrop-blur transition-transform duration-500 ${
          showGuideAi ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">AI 旅行助手</p>
            <p className="text-[11px] text-slate-300">欢迎消息已自动发送，可继续追问细化行程。</p>
          </div>
          <button
            type="button"
            onClick={() => setShowGuideAi(false)}
            className="rounded-lg border border-white/20 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
          >
            关闭
          </button>
        </div>
        <div className="h-[calc(100%-3.5rem)] overflow-hidden p-3">
          <AIChat
            autoPrompt={
              activeCountryProfile?.aiGreeting ||
              `你好，我想了解${selectedFeature?.name || selectedFeature?.nameEn || '这个国家'}的省钱旅行建议。`
            }
            autoPromptNonce={guideAiNonce}
          />
        </div>
      </aside>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 md:p-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">探索你的下一段旅程</h1>
        <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-200/90">
          旋转地球，点击任意位置触发经纬度事件。当前为入口阶段，后续可接国家级数据与路线推荐。
        </p>
        <p className="mt-1 text-xs text-slate-400">
          角色资源：{assetReady.image ? '已预加载' : '加载中'} · 语音资源：{assetReady.audio ? '已预加载' : '回退TTS'}
        </p>
        {lastClick ? (
          <div className="mt-3 space-y-1">
            <p className="text-xs md:text-sm text-sky-300">
              点击坐标：lat {lastClick.lat.toFixed(4)} / lng {lastClick.lng.toFixed(4)}
            </p>
            <p className="text-xs md:text-sm text-emerald-300">
              最近国家: {lastClick.countryName} ({lastClick.countryNameEn})
              {lastClick.distanceKm != null ? ` · 约 ${Math.round(lastClick.distanceKm)}km` : ''}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-xs md:text-sm text-slate-300">提示：拖拽旋转、滚轮缩放、点击地球打印经纬度。</p>
        )}
        {hoverCountry ? (
          <p className="mt-2 text-xs md:text-sm text-amber-300">
            悬停命中: {hoverCountry.name} ({hoverCountry.nameEn})
          </p>
        ) : null}
        <div className="pointer-events-auto mt-5 flex flex-wrap gap-3">
          <Link
            to="/map"
            className="inline-flex min-h-11 items-center rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold hover:bg-sky-700 transition"
          >
            进入地图主页
          </Link>
          <button
            type="button"
            onClick={() => {
              setSelectedCountryId(null)
              setLastClick(null)
              setResetToGlobalKey((v) => v + 1)
              setTransitionStage('globe')
            }}
            className="inline-flex min-h-11 items-center rounded-xl border border-white/30 bg-black/30 px-5 py-2.5 text-sm font-semibold hover:bg-black/50 transition"
          >
            重置视角
          </button>
          {lastClick?.countryName ? (
            <Link
              to={`/routes?destination=${encodeURIComponent(lastClick.countryName)}`}
              className="inline-flex min-h-11 items-center rounded-xl border border-emerald-300/70 bg-emerald-500/15 px-5 py-2.5 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/25 transition"
            >
              查看 {lastClick.countryName} 路线
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
