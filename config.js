// 全局配置
ap.module("config").requires("image").defines(function() {
	ap.config = {
		
		monsters : [{
			name:"杂鱼",
			skill : null,
			rank : 0,
		}],

		difficulty : {
			"EASY" : {
				
			},
			"NORMAL" : {

			},
			"HARD" : {

			}
		},
		// 玩家初始属性
		player : {
			// 安妮的初始属性大多已经在player中预设
			"Annie" : {
				animSheet : new ap.Image("media/sprites/annie.png", ap.Image.OFFSET.BELOW),
				skill : ["Pyromania"]
			}
		}

	};
});