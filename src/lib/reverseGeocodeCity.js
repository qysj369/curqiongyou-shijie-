/**
 * 经纬度 → 城市名（中国优先：有高德 Key 时用高德逆地理；否则 OpenStreetMap Nominatim）。
 * @param {number} lng
 * @param {number} lat
 * @returns {Promise<{ city: string, countryCode: string }>}
 */
export async function reverseGeocodeCity(lng, lat) {
  const key = import.meta.env.VITE_AMAP_KEY
  if (key && String(key).trim()) {
    try {
      const url = `https://restapi.amap.com/v3/geocode/regeo?key=${encodeURIComponent(String(key).trim())}&location=${lng},${lat}&radius=1000&extensions=base`
      const r = await fetch(url)
      const data = await r.json()
      if (data?.status === '1' && data.regeocode) {
        const ac = data.regeocode.addressComponent || {}
        let city = ''
        if (typeof ac.city === 'string' && ac.city.trim()) {
          city = ac.city.replace(/市$/, '')
        } else if (Array.isArray(ac.city) && ac.city.length === 0) {
          city = String(ac.province || '').replace(/省$|市$|自治区$|特别行政区$/, '')
        } else {
          city = String(ac.district || ac.province || '').replace(/市$|区$|县$/, '')
        }
        return { city: city.trim() || String(ac.province || '').trim(), countryCode: 'CN' }
      }
    } catch {
      /* fall through */
    }
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=zh`
    const r = await fetch(url, {
      headers: { 'User-Agent': 'RoamwiseBudgetTravel/1.0 (contact: site footer)' },
    })
    if (!r.ok) return { city: '', countryCode: '' }
    const data = await r.json()
    const a = data.address || {}
    const city =
      a.city ||
      a.town ||
      a.county ||
      a.state_district ||
      a.state ||
      (typeof data.display_name === 'string' ? data.display_name.split(',')[0] : '') ||
      ''
    const cc = (a.country_code || '').toString().toUpperCase()
    return { city: String(city).trim(), countryCode: cc }
  } catch {
    return { city: '', countryCode: '' }
  }
}
