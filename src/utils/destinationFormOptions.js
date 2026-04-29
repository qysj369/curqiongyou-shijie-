/**
 * 表单里与目的地相关的下拉数据：排除洲级目的地（如南极洲），避免在「国家/目的地」语义下出现整洲项。
 */

/**
 * 网友留言板「国家/地区」：用 `country` 字段。
 * @param {Array<{ country?: string, continent?: string }>} destList
 * @returns {string[]}
 */
export function getBoardCountryOptionsFromDestinations(destList) {
  const names = destList
    .filter((d) => d && d.continent !== '南极洲')
    .map((d) => d.country)
    .filter(Boolean)
  return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
}

/**
 * 问答 / 找旅伴 / 投稿等「目的地」下拉：用目的地 `name`。
 * @param {Array<{ name?: string, continent?: string }>} destList
 * @returns {string[]}
 */
export function getDestinationNamesForForms(destList) {
  const names = destList
    .filter((d) => d && d.continent !== '南极洲')
    .map((d) => d.name)
    .filter(Boolean)
  return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
}
