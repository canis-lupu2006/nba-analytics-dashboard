import { readFileSync } from 'node:fs'
const wp = JSON.parse(readFileSync('src/data/wnba/players.json', 'utf8'))
const np = JSON.parse(readFileSync('src/data/players_2026.json', 'utf8'))
const norm = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u2018\u2019\u0060\u00b4']/g, '').trim()

const wtests = ['aja wilson', 'aja', 'caitlin clark', 'caitlin', 'kelsey plum', 'breanna stewart', 'napheesa collier', 'satou sabally', 'dijonai', "d'jonai carrington"]
for (const t of wtests) {
  const hit = wp.find((p) => norm(p.name).includes(norm(t)))
  console.log('WNBA', JSON.stringify(t), '=>', hit ? hit.name : 'RIEN')
}
console.log('---')
const ntests = ['lebron james', 'lillard', 'kyrie', 'haliburton', 'wembanyama', 'victor', 'nicolas claxton', 'dangelo', "d'angelo", 'russell']
for (const t of ntests) {
  const hit = np.find((p) => norm(p.name).includes(norm(t)))
  console.log('NBA', JSON.stringify(t), '=>', hit ? hit.name : 'RIEN')
}
