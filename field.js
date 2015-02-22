// 当前的场景
ap.Field = {
	monsters : [],
	boss : [],

	monstersAmount : 0,
	bossAmount : 0,
	// 创建怪兽   类型，数量，位置
	createMonster : function (type, number, pos) {

	}
	// 复制怪物   怪物本身， 位置， callback
	copyMonster : function (monster, pos, callback) {
		var newMonster = ap.Utils.deepCopy(monster);
		callback(newMonster);


	},

	init : function () {

	},

};