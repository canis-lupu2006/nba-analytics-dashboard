const LOGO_ALIASES = {
  NOP: 'NO',
  UTA: 'UTAH',
}

export function teamLogo(abbr) {
  const key = LOGO_ALIASES[abbr] || abbr
  return `https://a.espncdn.com/i/teamlogos/nba/500/${key}.png`
}
