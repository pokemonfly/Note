// 场景特性 数量受难度决定
ap.module("feature").defines(function() {
	ap.feature = [
		{
			name : "冲锋",
			description : "怪兽获得冲锋技能"
			effect : function (field) {
				field.monsters.each(function (monster) {
						monster.skills.push(ap.SkillList["CHARGE"]);
				});
			}
		},
		{
			name : "连射",
			description : "首领怪兽获得连射技能"
			effect : function (field) {
				field.boss.each(function (monster) {
						monster.skills.push(ap.SkillList["FIRE"]);
				});
			}
		},
		{
			name : "毒沼",
			description : "首领怪兽会在玩家脚下创建剧毒沼泽"
			effect : function (field) {
				field.boss.each(function (boss) {
						boss.skills.push(ap.SkillList["MIASMA"]);
				});
			}
		},
		{
			name : "复仇",
			description : "怪兽死亡后会使首领怪兽获得强大力量"
			effect : function (field) {
				field.monsters.each(function (monster) {
						monster.onDead = function () {
							ap.Field.boss.each(function (boss) {
								boss.status.push(ap.Status.create("MIGHT", 30, boss.power * 0.1))
							})
						}
				});
			}
		},
		{
			name : "亵渎",
			description : "首领怪兽会在玩家脚下创建不停扩大的沼泽"
			effect : function (field) {
				field.boss.each(function (boss) {
						boss.skills.push(ap.SkillList["BLASPHEMY"]);
				});
			}
		},
		{
			name : "厚皮",
			description : "所有怪兽的生命提高"
			effect : function (field) {
				field.monsters.each(function (monsters) {
						monsters.life *= 2;
						monsters.lifeLimit *= 2;
				});
				field.boss.each(function (boss) {
						boss.life *= 2;
						boss.lifeLimit *= 2;
				});
			}
		},
		{
			name : "成群",
			description : "场内怪兽数目提高"
			init : function (field) {
				field.monstersAmount *= 2;
				field.bossAmount *= 2;
			)
		},
		{
			name : "幻影",
			description : "首领怪兽在受到伤害时会有几率创造1个比较弱的分身"
			effect : function (field) {
				field.boss.each(function (boss) {
						boss.hit
				});
			}
		},
	];
});