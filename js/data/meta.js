const branches=[
 ['🤢',['Пищеварение','Vomit'],[
 ['digestion1','Пищеварение I','Digestion I',10,'damage',.05,'+5% урона','+5% damage'],
 ['digestion2','Пищеварение II','Digestion II',20,'damage',.05,'+5% урона','+5% damage'],
 ['projectile1','Снаряд I','Projectile I',25,'fifth',1,'Каждая 5-я атака: +1 снаряд','Every 5th attack: +1 projectile'],
 ['attack1','Скорость атаки I','Attack speed I',20,'attackSpeed',.05,'+5% скорость атаки','+5% attack speed'],
 ['attack2','Скорость атаки II','Attack speed II',35,'attackSpeed',.05,'+5% скорость атаки','+5% attack speed'],
 ['toxicStomach','Токсичный желудок','Toxic stomach',60,'poison',.2,'Эволюция рвоты; +20% урон ядом','Vomit evolution; +20% poison damage'],
 ['explosiveDigestion','Взрывное пищеварение','Explosive digestion',70,'explosion',.1,'Эволюция ядерной рвоты; +10% урон взрывов','Nuclear evolution; +10% explosion damage'],
 ['apocalypse','Апокалипсис','Apocalypse',100,'apocalypse',1,'+10% урона рядом с 3 врагами','+10% damage near 3 enemies'],
 ['nuclearStomach','Ядерный желудок','Nuclear stomach',200,'nuclearStomach',1,'Каждые 100 снарядов: мощный взрыв','Every 100 projectiles: a large explosion']]],
 ['♥',['Выживание','Survival'],[
 ['health1','Здоровье I','Health I',10,'health',10,'+10 здоровья','+10 max HP'],['health2','Здоровье II','Health II',20,'health',10,'+10 здоровья','+10 max HP'],
 ['regen1','Регенерация I','Regeneration I',25,'regen',.5,'+0,5 здоровья / сек.','+0.5 HP / second'],['armor1','Броня I','Armor I',30,'armor',1,'+1 броня','+1 armor'],
 ['dash1','Рывок I','Dash I',25,'dashCooldown',.1,'−10% перезарядки рывка','−10% dash cooldown'],['dash2','Рывок II','Dash II',40,'dashDistance',.1,'+10% дальность рывка','+10% dash distance'],
 ['second','Второй шанс','Second chance',100,'second',1,'Пережить смертельный удар с 1 HP, раз за забег','Survive a fatal hit with 1 HP once per run'],
 ['unbreakable','Несокрушимый','Unbreakable',90,'unbreakable',1,'−10% входящего урона при HP <30%','−10% incoming damage below 30% HP'],
 ['survivor','Абсолютный выживший','Absolute survivor',200,'survivor',1,'30 сек. при HP <25%: восстановить 25% HP, один раз','30s below 25% HP: heal 25% once per run']]],
 ['↗',['Мобильность','Mobility'],[
 ['speed1','Скорость I','Speed I',15,'speed',.05,'+5% скорость','+5% movement speed'],['speed2','Скорость II','Speed II',25,'speed',.05,'+5% скорость','+5% movement speed'],['speed3','Скорость III','Speed III',40,'speed',.05,'+5% скорость','+5% movement speed'],
 ['dashMaster','Мастер рывка','Dash master',60,'dashCooldown',.15,'−15% перезарядки рывка','−15% dash cooldown'],['afterimage','Послесвечение','Afterimage',70,'afterimage',1,'Рывок оставляет опасный след на 2 сек.','Dash leaves a damaging trail for 2s'],['unstoppable','Неудержимый','Unstoppable',90,'unstoppable',1,'+20% скорость на 2 сек. после рывка','+20% speed for 2s after dashing']]],
 ['♣',['Удача','Luck'],[
 ['luck1','Удача I','Luck I',15,'luck',.05,'+5% удача','+5% luck'],['luck2','Удача II','Luck II',30,'luck',.05,'+5% удача','+5% luck'],['chestFinder','Искатель сундуков','Chest finder',35,'chest',.1,'+10% частота сундуков','+10% chest frequency'],['multiplierHunter','Охотник за множителями','Multiplier hunter',50,'rareMulti',.1,'+10% вес редких множителей','+10% rare multiplier weight'],['rareChoices','Редкий выбор','Rare choices',60,'rare',.2,'+20% вес редких улучшений','+20% rare upgrade weight'],['luckyStomach','Удачливый желудок','Lucky stomach',80,'luck',.1,'Эволюция радуги; +10% удача','Rainbow evolution; +10% luck'],['gamblerSoul','Душа игрока','Gambler’s soul',120,'rewardDouble',.08,'8% шанс удвоить награду','8% chance to double run rewards'],['absoluteLuck','Абсолютная удача','Absolute luck',200,'absoluteLuck',.15,'+15% шанс редкого содержимого сундуков','+15% rare chest reward chance']]],
 ['🧬',['Награды','Rewards'],[
 ['dna1','Бонус ДНК I','DNA bonus I',15,'dna',.05,'+5% ДНК','+5% DNA'],['dna2','Бонус ДНК II','DNA bonus II',30,'dna',.1,'+10% ДНК','+10% DNA'],['killBonus','Награда за убийства','Kill bonus',45,'killBonus',1,'+1 ДНК за 100 убийств','+1 DNA per 100 kills'],['bossBonus','Награда за боссов','Boss bonus',60,'bossBonus',.25,'+25% ДНК за боссов','+25% boss DNA'],['survivorBonus','Награда выжившего','Survivor bonus',75,'survivorBonus',.1,'+10% награда после 10-й волны','+10% rewards after wave 10'],['investor','Брейнрот-инвестор','Brainrot investor',120,'dna',.15,'+15% ДНК','+15% DNA']]]
];
export const metaBranches=branches.map(([icon,name,nodes],branch)=>({icon,name,nodes:nodes.map(([id,ru,en,cost,key,value,dr,de],i)=>({id,name:[ru,en],cost,key,value,desc:[dr,de],requires:i?[nodes[i-1][0]]:[],branch,index:i,icon}))}));
export const metaNodes=metaBranches.flatMap(b=>b.nodes);
export function canBuy(save,node){return !save.upgrades[node.id]&&save.dna>=node.cost&&node.requires.every(id=>save.upgrades[id]);}
export function buy(save,id){const n=metaNodes.find(n=>n.id===id);if(!n||!canBuy(save,n))return false;save.dna-=n.cost;save.upgrades[id]=1;return true;}
