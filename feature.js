// 场景特性 数量受难度决定
ap.module("feature").defines(function() {
	"use strict";
	ap.feature = [{
		name: "冲锋",
		description: "怪兽获得冲锋技能",
		effect: function(field) {
			field.monsters.forEach(function(monster) {
				var sk = ap.skill.createSkill("charge", monster);
				monster.skills["charge"] = sk;
			});
		}
	}, {
		name: "连射",
		description: "首领怪兽获得连射技能",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				var sk = ap.skill.createSkill("fire", boss);
				boss.skills["fire"] = sk;
			});
		}
	}, {
		name: "追踪",
		description: "首领怪兽会释放追踪火球",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				var sk = ap.skill.createSkill("track", boss);
				boss.skills["track"] = sk;
			});
		}
	}, {
		name: "毒沼",
		description: "首领怪兽会在玩家脚下创建剧毒沼泽",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				var sk = ap.skill.createSkill("miasma", boss);
				boss.skills["miasma"] = sk;
			});
		}
	}, {
		name: "复仇",
		description: "怪兽死亡后会使首领怪兽获得威能和激怒",
		effect: function(field) {
			field.monsters.forEach(function(monster) {
				monster.onDead = (function() {
					this.isKilled = true;
					var bosses = ap.game.getCurrentMonster(1);
					bosses.forEach(function(boss) {
						var s = ap.status.createStatus("fury", "", "", 0, 5);
						boss.status.push(s);
						s = ap.status.createStatus("might", "", "", boss.power * 0.2, 5);
						boss.status.push(s);
					});
				}).bind(this);
			});
		}
	}, {
		name: "厚皮",
		description: "所有怪兽的生命提高",
		effect: function(field) {
			field.monsters.forEach(function(monster) {
				monster.life *= 1.5;
				monster.lifeLimit *= 1.5;
			});
			field.bosses.forEach(function(boss) {
				boss.life *= 1.5;
				boss.lifeLimit *= 1.5;
			});
		}
	}, {
		name: "监禁",
		description: "首领怪兽会种植定身植物",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				var sk = ap.skill.createSkill("prison", boss);
				boss.skills["prison"] = sk;
			});
		}
	}, {
		name: "吸血",
		description: "怪兽会把伤害转换为自己的生命",
		effect: function(field) {
			field.monsters.forEach(function(monster) {
				monster.drainLife += 1.5;
			});
			field.bosses.forEach(function(boss) {
				boss.drainLife += 1.5;
			});
		}
	}, {
		name: "沉默",
		description: "首领怪兽使玩家沉默，短时间内无法使用技能",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				var sk = ap.skill.createSkill("silence", boss);
				boss.skills["silence"] = sk;
			});
		}
	}, {
		name: "寒气",
		description: "首领怪兽会种植减速植物",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				var sk = ap.skill.createSkill("cold", boss);
				boss.skills["cold"] = sk;
			});
		}
	}, {
		name: "生长",
		description: "首领怪兽会治疗全部怪物",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				var sk = ap.skill.createSkill("growth", boss);
				boss.skills["growth"] = sk;
			});
		}
	}, {
		name: "召唤",
		description: "首领怪兽会召唤手下来作战",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				var sk = ap.skill.createSkill("summon", boss);
				boss.skills["summon"] = sk;
			});
		}
	}, {
		name: "歼灭",
		description: "首领怪兽会使用大范围高伤害技能",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				var sk = ap.skill.createSkill("annihilation", boss);
				boss.skills["annihilation"] = sk;
			});
		}
	}, {
		name: "反噬",
		description: "首领怪兽会反弹伤害",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				boss.isReflection = true;
			});
		}
	}, {
		name: "疾病",
		description: "怪兽的基础攻击将附带毒伤害",
		effect: function(field) {
			field.monsters.forEach(function(monster) {
				if (monster.skill.length > 0) {
					monster.skills[monster.skill[0]].status = ["poison"];
				}
			});
			field.bosses.forEach(function(boss) {
				if (boss.skill.length > 0) {
					boss.skills[boss.skill[0]].status = ["poison"];
				}
			});
		}
	}, {
		name: "幻影",
		description: "首领怪兽在受到伤害时会有几率创造1个比较弱的分身",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				// 重写boss的一些方法
				boss.hurt = (function(damage) {
					if (Math.random() < 1) {
						// 被击中后创建幻影 幻影伤害低，无特殊技能 
						var phantom = new ap.Monster(ap.config.bosses[this._id]);
						phantom.pos = ap.collision.getRandomPos(phantom.radius, this.pos.x, this.pos.y, 500);
						phantom.life = this.life / 3;
						phantom.exp = 1;
						phantom.name = this.name + "幻影";
						phantom.power = this.poswer / 2;
						// 幻影击杀不能加数目
						phantom.onKill = function() {
							this.isKilled = true;
							ap.game.leaveKillCount += 1;
						};
						ap.game.addMonster(phantom);
					}
					this.life -= damage;
				}).bind(boss);
			});
		}
	}];
});

// Bomb	爆弹	召唤爆弹蘑菇