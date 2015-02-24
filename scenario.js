// 剧情
ap.Scenario = {
	story : [
		{
			description : "角色提升到6级时，遇到熊，击败后获得技能",
			// 判断是否需要进行剧情演出
			trigger : function () {
				if (game.field.player.level == 6 && game.field.isNewField) {
					return true;
				} else {
					return false;
				}
			},
			// 是否需要中断游戏来播放剧情
			needPause : true,
			run : function () {
				ap.utils.playScenario(this);
				game.field.addMonster("XXX");
			},
			// 剧情演出 台词
			script : [
				{
					// 头像
					icon : null,
					// 台词
					words : "森林里传来野兽的吼声" 
				}，
				{
					// 头像
					icon : "Annie",
					// 台词
					words : "那边就是我要找的小熊吧。" 
				}
			],

		},
	],

};