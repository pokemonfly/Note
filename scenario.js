// 剧情
ap.module("scenario").requires("ui").defines(function() {
	ap.scenario = [{
		name: "newgame",
		description: "开始新游戏",
		// 判断是否需要进行剧情演出 trigger 为空就需要手动触发(通过name)
		trigger: null,
		// 是否需要中断游戏来播放剧情
		needPause: true,
		run: function() {
			ap.ui.playScenario(this);
		},
		// 剧情播放完毕的回调
		callback: function(difficulty) {
			ap.system.newGame(difficulty);
		},
		// 剧情演出 台词
		script: [{
			// 台词
			words: "联盟成立之前不久，诺克萨斯最高指挥部镇压了自称王储的瑞斯卡里奥发动的政变，理由是他们追求黑暗的秘术知识。"
		}, {
			words: "于是有那么一群被称作灰色秩序的放逐者，被迫离开他们的家园。"
		}, {
			words: "组织的领导者是一对夫妻，神秘术士格雷戈里·哈斯塔和他的妻子暗影巫女阿莫琳。"
		}, {
			words: "他们从瓦洛兰大陆带走了一批魔法师和其他知识分子，他们越过宏伟屏障，在禁忌的巫毒之地北部重新安家。"
		}, {
			words: "虽然生存时常充满挑战，但他们却超越前人，成功地在这里生活下去"
		}, {
			words: "几年之后，格雷戈里和阿莫琳生了个女儿，她的名字叫做安妮。"
		}, {
			words: "很早的时候格雷戈里就知道女儿非同一般，安妮身上流淌的术士血液和出色的黑暗魔法让她拥有惊人的秘术能量。"
		}, {
			words: "联盟的人认为这个女孩是最受欢迎的英雄之一，连要驱逐她父母的城邦居民也不例。"
		}, {
			words: "我们的故事就要从安妮与她最亲密的伙伴提伯斯相遇开始......"
		}, {
			words: "一个平常的早晨，安妮一个人看家。无聊的安妮趴在窗台，看着外面的灰色树林。"
		}, {
			words: "吼~~~远方传来了野兽狂暴的嘶吼。"
		}, {
			// 头像
			icon: "Annie",
			words: "好像，它在叫我去玩？"
		}, {
			icon: "Annie",
			words: "那就偷偷出去看看。最好带点什么东西去吧，树林里有好多坏东西呢。"
		}, {
			icon: "Annie",
			words: "带什么好呢？"
		}, {
			// 难度选择框
			select: ["小熊布偶（简单）", "魔法手杖（普通）", "血纹咒印（困难，一周目慎选）"],
			words: "(迷之音：请选择难度。通关后部分资料可以继承，建议从简单开始。)"
		}, {
			// 显示条件
			which: function(diff) {
				return diff === 0;
			},
			words: "软软的小熊布偶平息了安妮内心隐约的不安。"
		}, {
			which: function(diff) {
				return diff === 0;
			},
			icon: "Annie",
			words: "这次就在附近找找看吧。"
		}, {
			which: function(diff) {
				return diff === 0;
			},
			words: "安妮带着小熊布偶出门了..."
		}, {
			which: function(diff) {
				return diff === 1;
			},
			words: "结实的手杖传来的可靠的感觉。"
		}, {
			which: function(diff) {
				return diff === 1;
			},
			icon: "Annie",
			words: "这次就走远点吧。"
		}, {
			which: function(diff) {
				return diff === 1;
			},
			icon: "Annie",
			words: "安妮握着魔法手杖出门了..."
		}, {
			// 显示条件
			which: function(diff) {
				return diff === 2;
			},
			words: "血纹咒印闪耀的光芒似乎和安妮的血脉共鸣了。"
		}, {
			// 显示条件
			which: function(diff) {
				return diff === 2;
			},
			icon: "Annie",
			words: "这种感觉，我好像更厉害了。"
		}, {
			// 显示条件
			which: function(diff) {
				return diff === 2;
			},
			words: "安妮带着血纹咒印出门了..."
		}]
	}, {
		name: "lv6",
		description: "角色提升到6级时，遇到熊，击败后获得技能",

		trigger: function() {
			if (game.field.player.level == 6 && game.field.isNewField) {
				return true;
			} else {
				return false;
			}
		},

		needPause: true,
		run: function() {
			ap.utils.playScenario(this);
			game.field.addMonster("XXX");
		},

		script: [{

			icon: null,

			words: "森林里传来野兽的吼声"
		}, {
			// 头像
			icon: "Annie",
			// 台词
			words: "那边就是我要找的小熊吧。"
		}]

	}, {
		name: "gameover",
		description: "玩家死亡，游戏结束",
		// 判断是否需要进行剧情演出 trigger 为空就需要手动触发(通过name)
		trigger: null,
		// 是否需要中断游戏来播放剧情
		needPause: true,
		run: function() {
			ap.ui.playScenario(this);
		},
		// 剧情播放完毕的回调
		callback: function() {
			ap.system.gameOver();
		},
		// 剧情演出 台词
		script: [{
			words: "树林里的怪物不断的涌出，强烈的敌意化作凶猛的攻击袭向安妮。"
		}, {
			icon: "Annie",
			words: "好疼，好累，好冷..."
		}, {
			icon: "Annie",
			words: "不和你们玩了！"
		}, {
			words: "安妮从口袋摸出了一块宝石，用魔力点燃了它。一阵闪烁中，安妮消失在原地。"
		}, {
			words: "神秘术士当然不会对自己的女儿吝啬，那是逃跑用的宝石。"
		}, {
			icon: "Annie",
			words: "下次，下次一定要打扁这些坏家伙。哼！"
		}, {
			words: "(迷之音：本次游戏虽然残念的结束了，但安妮的冒险并没有结束。本次获得的稀有道具都已经保留。祝愿下次能走的更远...）"
		}]
	}];
});