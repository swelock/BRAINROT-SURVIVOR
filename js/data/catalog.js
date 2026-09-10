export const characters = [
 {id:'tung',name:'TUNG TUNG TUNG SAHUR',ru:'ТУНГ ТУНГ ТУНГ САХУР',role:['Урон по площади','Area damage'],color:'#cd9659',hp:100,speed:220,armor:0,dash:3,passive:['Барабан судьбы','Drum of doom'],description:['Удар по земле каждые 8 сек. Урон по площади +10%.','Ground slam every 8s. +10% area damage.']},
 {id:'shark',name:'TRALALERO TRALALA',ru:'ТРАЛАЛЕРО ТРАЛАЛА',role:['Мобильность','Mobility'],color:'#70b8dc',hp:85,speed:260,armor:0,dash:2.2,passive:['Быстрее брейнрота','Fastest brainrot alive'],description:['Скорость +15%. Рывок оставляет опасный след на 2 сек. Скорость снарядов +10%.','+15% movement. Dash leaves a damaging 2s trail. +10% projectile speed.']},
 {id:'croc',name:'BOMBARDIRO CROCODILO',ru:'БОМБАРДИРО КРОКОДИЛО',role:['Взрывы','Explosions'],color:'#8bb75e',hp:110,speed:205,armor:1,dash:3.2,passive:['Бомбарда!','Bombarda!'],description:['Взрывной снаряд каждые 7 сек. Радиус взрывов +15%.','Explosive projectile every 7s. +15% explosion radius.']},
 {id:'cup',name:'BALLERINA CAPPUCCINA',ru:'БАЛЕРИНА КАПУЧИНА',role:['Уклонение','Evasion'],color:'#eca5bc',hp:90,speed:240,armor:0,dash:2.5,passive:['Идеальный пируэт','Perfect spin'],description:['Вращение с уроном и неуязвимостью каждые 6 сек. Уклонение +10%.','Damage spin and brief invulnerability every 6s. +10% dodge.']},
 {id:'chaos',name:'THE ABSOLUTE BRAINROT',ru:'АБСОЛЮТНЫЙ БРЕЙНРОТ',role:['Хаос','Chaos'],color:'#b597ee',hp:95,speed:230,armor:0,dash:3,passive:['Случайная реальность','Randomized reality'],description:['Случайное усиление на 5 сек. каждые 12 сек. Удача +10%.','Random 5s mini-buff every 12s. +10% luck.']}
];
export const weapons = [
 {id:'basic',icon:'🤢',name:['Базовая рвота','Basic vomit'],desc:['Прицельный выстрел: 10 урона / 0,8 сек.','Aimed shot: 10 damage / 0.8s.'],damage:10,cooldown:.8,color:'#c3ef5c',evolution:'apocalypse',requires:'toxicStomach',evo:['Рвота апокалипсиса','Apocalypse vomit']},
 {id:'toxic',icon:'🟢',name:['Токсичный спрей','Toxic spray'],desc:['Конус: 6 урона + яд 3/сек. на 3 сек.','Cone: 6 damage + 3/s poison for 3s.'],damage:6,cooldown:1.4,color:'#82ef7b',evolution:'storm',requires:'biohazard',evo:['Токсичный шторм','Toxic storm']},
 {id:'nuclear',icon:'☢',name:['Ядерная рвота','Nuclear vomit'],desc:['Взрыв: 40 урона, радиус 80 / 4 сек.','Explosion: 40 damage, radius 80 / 4s.'],damage:40,cooldown:4,color:'#efcb5e',evolution:'doom',requires:'explosiveDigestion',evo:['Снаряд судьбы','Doom projectile']},
 {id:'rainbow',icon:'🌈',name:['Радужная рвота','Rainbow vomit'],desc:['Яд, заморозка, крит, отбрасывание или цепь.','Poison, freeze, critical, knockback or chain.'],damage:15,cooldown:1.1,color:'#cc8bff',evolution:'absoluteRainbow',requires:'luckyStomach',evo:['Абсолютная радуга','Absolute rainbow']},
 {id:'burp',icon:'💥',name:['Взрывная отрыжка','Explosive burp'],desc:['Взрыв в скоплении врагов: 35 урона / 5 сек.','Enemy cluster explosion: 35 damage / 5s.'],damage:35,cooldown:5,color:'#ff996e'},
 {id:'orbit',icon:'🌀',name:['Орбита брейнрота','Brainrot orbit'],desc:['Два спутника наносят контактный урон.','Two satellites deal contact damage.'],damage:14,cooldown:.32,color:'#78d9ec',evolution:'galactic',requires:'orbitalChaos',evo:['Галактический брейнрот','Galactic brainrot']},
 {id:'sigma',icon:'⚡',name:['Сигма-волна','Sigma shockwave'],desc:['Круговая волна с отбрасыванием / 6 сек.','Circular knockback shockwave / 6s.'],damage:30,cooldown:6,color:'#a8c5ff'}
];
const U=(id,ru,en,desc,endesc,key,value,max=1,rarity=0)=>({id,name:[ru,en],desc:[desc,endesc],key,value,max,rarity});
export const upgrades=[
 U('strong','Крепкий желудок','Stronger stomach','+15% урона','+15% damage','damage',.15,5),
 U('crit','Критический брейнрот','Critical brainrot','+5% шанс крита','+5% critical chance','crit',.05,5,1),
 U('critDamage','Критическая катастрофа','Critical disaster','+25% критический урон','+25% critical damage','critDamage',.25,4,1),
 U('double','Двойная проблема','Double trouble','+10% шанс дополнительного снаряда','+10% extra projectile chance','double',.1,5,1),
 U('cooldown','Быстрое пищеварение','Speedy digestion','−10% перезарядки','−10% attack cooldown','cooldown',.1,5),
 U('overclock','Разогнанный желудок','Overclocked stomach','+20% скорость атаки','+20% attack speed','attackSpeed',.2,3,2),
 U('more','Больше рвоты','More vomit','+1 снаряд','+1 projectile','count',1,4,2),
 U('size','Большой беспорядок','Bigger mess','+15% размер снарядов','+15% projectile size','size',.15,4),
 U('fast','Быстрый беспорядок','Faster mess','+20% скорость снарядов','+20% projectile speed','projectileSpeed',.2,4),
 U('pierce','Сквозная проблема','Piercing problem','+1 пробитие','+1 pierce','pierce',1,3,1),
 U('health','Толстая кожа','Thicker skin','+15 здоровья, включая лечение','+15 max HP and heal 15','health',15,5),
 U('regen','Регенерация','Regeneration','+1 здоровье / сек.','+1 HP / second','regen',1,5,1),
 U('armor','Крепкая голова','Hard head','+1 броня','+1 armor','armor',1,4),
 U('dash','Экстренный рефлекс','Emergency reflex','+10% дальность рывка','+10% dash distance','dashDistance',.1,3),
 U('speed','Быстрые ноги','Quick feet','+10% скорость движения','+10% movement speed','speed',.1,4),
 U('luck','Удачный день','Lucky day','+10% удача','+10% luck','luck',.1,5),
 U('chest','Магнит сундуков','Chest magnet','+15% частота сундуков','+15% chest frequency','chest',.15,3,1),
 U('multi','Охотник за множителями','Multiplier hunter','+10% шанс множителя','+10% multiplier chance','multi',.1,3,1),
 U('toxicBlood','Токсичная кровь','Toxic blood','Атаковавший вас враг получает яд','Poison enemies that damage you','toxicBlood',1,1,1),
 U('overflow','Переполнение','Brainrot overflow','Каждая 20-я атака: круговой залп','Every 20th attack: radial burst','overflow',1,1,2),
 U('lastStand','Последний рубеж','Last stand','+30% урона при здоровье ниже 25%','+30% damage below 25% HP','lastStand',1,1,1),
 U('magnet','Магнитный хаос','Magnetic chaos','+70 радиус сбора опыта','+70 XP pickup radius','magnet',70,1),
 U('bossHunter','Охотник на боссов','Boss hunter','+25% урона боссам','+25% boss damage','bossDamage',.25,1,2),
 U('unstable','Нестабильная энергия','Unstable energy','15% шанс малого взрыва при попадании','15% chance of impact explosion','unstable',.15,1,2),
 U('gambler','Азарт','Gambler','8% шанс легендарной карточки при повышении уровня','8% chance of a legendary choice each level','gambler',1,1,2),
 U('toxicStomach','Токсичный желудок','Toxic stomach','Эволюция базовой рвоты; +20% урон ядом','Basic evolution; +20% poison damage','poison',.2,1,1),
 U('biohazard','Биоугроза','Biohazard','Эволюция спрея; +25% урон ядом','Spray evolution; +25% poison damage','poison',.25,1,1),
 U('explosiveDigestion','Взрывное пищеварение','Explosive digestion','Эволюция ядерной рвоты; +10% урон взрывов','Nuclear evolution; +10% explosion damage','explosion',.1,1,1),
 U('luckyStomach','Удачливый желудок','Lucky stomach','Эволюция радуги; +10% удача','Rainbow evolution; +10% luck','luck',.1,1,1),
 U('orbitalChaos','Орбитальный хаос','Orbital chaos','Эволюция орбиты; +15% урон по площади','Orbit evolution; +15% area damage','area',.15,1,1),
 U('legend','Абсолютное безумие','Absolute madness','+35% урона и +1 снаряд','+35% damage and +1 projectile','legend',1,2,3)
];
export const buffs=[
 ['energy','⚡','Энергетик','Energy drink',15,'Скорость +50%','+50% speed'],['sigma','💀','Сигма-режим','Sigma mode',10,'Урон ×2','×2 damage'],['overload','🔥','Перегрузка','Overload',12,'Атака +75%','+75% attack speed'],['clover','🍀','Счастливый клевер','Lucky clover',20,'Удача +50%','+50% luck'],['invincible','🛡','Неуязвимость','Invincible',5,'Полная защита','No damage'],['rainbow','🌈','Радужное событие','Rainbow event',15,'Стихийные снаряды','Elemental projectiles'],['magnet','🧲','Супермагнит','Super magnet',12,'Сбор опыта издалека','Long-range XP pickup'],['turbo','💨','Турборежим','Turbo mode',8,'Скорость +100%','+100% speed'],['fever','💣','Взрывная лихорадка','Explosion fever',10,'20% шанс взрыва','20% explosion chance'],['rain','🤢','Рвотный дождь','Vomit rain',8,'Дождь снарядов','Projectile rain'],['slow','⏳','Замедление','Slow motion',7,'Враги медленнее на 40%','Enemies 40% slower'],['boost','🧠','Брейнрот-буст','Brainrot boost',10,'+1 снаряд; размер +25%','+1 projectile; +25% size']
].map(([id,icon,ru,en,duration,dr,de])=>({id,icon,name:[ru,en],duration,desc:[dr,de]}));
export const enemies={
 clubber:{hp:22,speed:76,damage:12,r:17,color:'#c39a74',xp:4},runner:{hp:16,speed:148,damage:9,r:13,color:'#ddaa63',xp:5},shooter:{hp:28,speed:60,damage:10,r:16,color:'#be91d1',xp:7},tank:{hp:135,speed:47,damage:23,r:27,color:'#899b96',xp:14},bomber:{hp:25,speed:123,damage:28,r:16,color:'#ea8960',xp:8},weird:{hp:42,speed:100,damage:14,r:18,color:'#69c7ad',xp:9}
};
export const themes=[['#416146','#334e39','#b2d39a','НОРМАЛЬНЫЙ БРЕЙНРОТ','NORMAL BRAINROT'],['#4b6935','#39512c','#d2de78','ТОКСИЧНЫЙ БРЕЙНРОТ','TOXIC BRAINROT'],['#555d35','#42482d','#d7cf87','ТРАВА ЧТО-ТО ЗНАЕТ','THE GRASS IS SUSPICIOUS'],['#49425f','#39354b','#b8c78b','РЕАЛЬНОСТЬ ЛОМАЕТСЯ','REALITY IS BREAKING'],['#393754','#292d44','#afa0dd','АБСОЛЮТНЫЙ БРЕЙНРОТ','ABSOLUTE BRAINROT']];
export const waveNames=[['Брейнрот начинается','The brainrot begins'],['Они привели друзей','They brought friends'],['Не стой на месте','Keep moving'],['Это уже личное','Now it is personal'],['Трава наблюдает','The grass is watching'],['Осторожно, взрывоопасно','Handle with care'],['Потрогай странную траву','Touch suspicious grass'],['Крупная неприятность','A big problem'],['Кто это вообще?','What even is that?'],['Реальность вышла из чата','Reality has left the chat'],['Обратно дороги нет','No going back'],['Секрет раскрыт','Secret unlocked'],['Последние клетки мозга','The last brain cells'],['Ещё одну волну','Just one more wave'],['Абсолютный брейнрот','Absolute brainrot']];
export const bossNames={clubber:['БОЛЬШОЙ ДУБИНЩИК','THE BIG CLUBBER'],weird:['СТРАННЫЙ ТИП','THE WEIRD ONE'],breaker:['РАЗРУШИТЕЛЬ РЕАЛЬНОСТИ','THE REALITY BREAKER'],absolute:['АБСОЛЮТНЫЙ БРЕЙНРОТ','THE ABSOLUTE BRAINROT']};
