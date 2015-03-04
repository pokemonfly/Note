// 全局配置
ap.module("config").defines(function() {
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
		}
	};
});