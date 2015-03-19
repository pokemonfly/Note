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
		name: "毒沼",
		description: "首领怪兽会在玩家脚下创建剧毒沼泽",
		effect: function(field) {
				field.bosses.forEach(function(boss) {
					var sk = ap.skill.createSkill("miasma", boss);
					boss.skills["miasma"] = sk;
				});
			}
			// }, {
			// 	name: "复仇",
			// 	description: "怪兽死亡后会使首领怪兽获得强大力量",
			// 	effect: function(field) {
			// 		field.monsters.forEach(function(monster) {
			// 			monster.onDead = function() {
			// 				ap.Field.boss.forEach(function(boss) {
			// 					boss.status.push(ap.Status.create("MIGHT", 30, boss.power * 0.1));
			// 				});
			// 			};
			// 		});
			// 	}
			// }, {
			// 	name: "亵渎",
			// 	description: "首领怪兽会在玩家脚下创建不停扩大的沼泽",
			// 	effect: function(field) {
			// 		field.bosses.forEach(function(boss) {
			// 			boss.skills.push(ap.SkillList["BLASPHEMY"]);
			// 		});
			// 	}
	}, {
		name: "厚皮",
		description: "所有怪兽的生命提高",
		effect: function(field) {
				field.monsters.forEach(function(monsters) {
					monsters.life *= 2;
					monsters.lifeLimit *= 2;
				});
				field.bosses.forEach(function(boss) {
					boss.life *= 2;
					boss.lifeLimit *= 2;
				});
			}
			// }, {
			// 	name: "成群",
			// 	description: "场内怪兽数目提高",
			// 	init: function(field) {
			// 		field.monstersAmount *= 2;
			// 		field.bossAmount *= 2;
			// 	}
// 			Prison	监禁	强制的定身
// Repel	击退
// Disease	疾病	50%中毒
// Back	反噬	反弹伤害
// Vampire	吸血	10%吸血
// Cold	寒气	80%减速
// Counter	反制	定时的强制反制
// Annihilation	歼灭	大范围aoe
// Summon	召唤	四个角刷新小怪
// Guard	守卫	场上怪物多余XX时，受到的伤害减少
// Track	追踪	追踪的投射物
// Growth	生长	全员获得回血效果
// Bomb	爆弹	召唤爆弹蘑菇
// Thorns	荆棘	召唤荆棘林

	}, {
		name: "幻影",
		description: "首领怪兽在受到伤害时会有几率创造1个比较弱的分身",
		effect: function(field) {
			field.bosses.forEach(function(boss) {
				// boss.hit
			});
		}
	}];
});