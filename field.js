// 场景 控制当前场上的怪物设定 与场地特性
ap.module("field").defines(function() {
	ap.field = {
		// 目前已经生成的怪兽
		monsters: [],
		// 目前已经生成的boss怪兽
		boss: [],
		// 计划生成数量
		monstersAmount: 0,
		bossAmount: 0,

		init: function(config) {

		},
		// 创建怪兽   类型，数量，位置
		createMonster: function(type, number, pos) {

		},
		// 复制怪物   怪物本身， 位置， callback
		copyMonster: function(monster, pos, callback) {
			var newMonster = ap.Utils.deepCopy(monster);
			callback(newMonster);


		},

	};
});