// 剧情
ap.module("scenario").requires("ui").defines(function() {
	ap.scenario = [{
		name: "newGame",
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
		}, {
			words: "（谜之音：游戏内可以点击右下角的帮助 或者 按下H键获得游戏帮助。)"
		}]
	}, {
		name: "meetBear",
		description: "角色提升到6级时，遇到熊",
		trigger: function() {
			if (ap.game.player.level >= 6 && ap.field.num > 1 && !this.disabled && ap.game.leaveKillCount > 0) {
				this.run();
				this.disabled = true;
			}
		},
		background: 'canvas',
		needPause: true,
		run: function() {
			ap.ui.playScenario(this);
		},
		callback: function() {
			var m = new ap.Monster(ap.config.rareMonster[1]);
			m.pos = ap.collision.getRandomPos(m.radius);
			m.rank = 2;
			m.onKill = function() {
				m.isKilled = true;
				ap.game.lockCurrentField = false;
				ap.mediator.fire("killBear");
			};
			ap.game.addMonster(m);
			ap.ui.addMessage("安妮命运的邂逅，史诗级暗影熊出现了！", "yellow");
			// 锁定当前区域
			ap.game.lockCurrentField = true;
		},
		script: [{
			icon: "Bear ",
			words: "吼~~~~~~~~~~~~~~~~~~"
		}, {
			icon: "Bear ",
			words: "吼~~~~~~~~~~~~"
		}, {
			icon: "Bear ",
			words: "吼~~~~~~"
		}, {
			words: "森林里传来野兽的吼声。"
		}, {
			icon: "Annie",
			words: "就在前面了！"
		}, {
			icon: "Annie",
			words: "那就是我要找的小熊吧。（兴奋）"
		}, {
			words: "被瘴气浸入的暗影熊目露凶光，冲了过来！"
		}, {
			icon: "Annie",
			words: "不听话的孩子是要被教训的。嘿！"
		}]
	}, {
		name: "killBear",
		description: "击败熊后获得技能",
		trigger: null,
		background: 'canvas',
		needPause: true,
		run: function() {
			ap.ui.playScenario(this);
		},
		// 剧情播放完毕的回调
		callback: function() {
			var s = ap.game.player.skills["tibbers"];
			s.isLock = false;
			ap.ui.setSkillStatus(s.dom, true);
		},
		// 剧情演出 台词
		script: [{
			words: "暗影熊被打倒了。"
		}, {
			icon: "Bear",
			words: "吼...（颤抖）"
		}, {
			icon: "Annie",
			words: "你现在愿意和我做朋友了吧？"
		}, {
			icon: "Bear",
			words: "吼...（点头）"
		}, {
			icon: "Annie",
			words: "那你以后就是我的小熊了❤~你的名字就叫提伯斯好了~"
		}, {
			icon: "Annie",
			words: "来和我签下契约，成为魔法小熊吧~"
		}, {
			icon: "Bear",
			words: "吼...（颤抖）"
		}, {
			words: "安妮咏唱了一段咒文，暗影熊最后化作布偶上的闪动的符号。那是个封印魔物的符号。"
		}, {
			icon: "Annie",
			words: "嘻嘻~交到朋友真好啊，再继续玩会吧~"
		}, {
			words: "(迷之音：安妮解锁了一个新技能：提伯斯之怒。）"
		}, {
			words: "(提伯斯会攻击周围的敌人，并周期性的对附近的敌人造成伤害。敌人会优先攻击提伯斯。）"
		}]
	}, {
		name: "patDead",
		description: "宠物熊第一次死亡事件",
		trigger: null,
		background: 'canvas',
		needPause: true,
		disabled: false,
		run: function() {
			if (!this.disabled) {
				ap.ui.playScenario(this);
				this.disabled = true;
			}
		},
		callback: function() {},
		// 剧情演出 台词
		script: [{
			words: "提伯斯被打的破破烂烂，终于倒下了..."
		}, {
			icon: "Bear",
			words: "吼...（痛苦）"
		}, {
			icon: "Annie",
			words: "小熊！！你们，你们竟然伤到了我的小熊！我要把你们都烧掉！"
		}, {
			words: "安妮的愤怒使她暂时获得了强大的力量。"
		}]
	}, {
		name: "gameOver",
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
			ap.system.saveGame();
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
	}, {
		name: "loadGame",
		description: "继续游戏",
		trigger: null,
		needPause: true,
		run: function() {
			ap.ui.playScenario(this);
		},
		// 剧情播放完毕的回调
		callback: function() {
			ap.system.loadGame();
		},
		// 剧情演出 台词
		script: [{
			words: "我们的主角休息好又回来了。"
		}, {
			icon: "Annie",
			words: "我上次走到到哪儿来着？唔唔唔~~就从这里开始吧。"
		}]
	}, {
		name: "help",
		description: "帮助",
		trigger: null,
		background: 'canvas',
		needPause: true,
		run: function() {
			ap.ui.playScenario(this);
		},
		callback: function() {},
		script: [{
			words: "游戏指引 & TIPS"
		}, {
			words: "关于移动：<br/> 使用 鼠标右击地面 或者 方向键 来移动角色。"
		}, {
			words: "关于攻击：<br/> 使用 鼠标左键 或者 空格键 或者 A键 来释放普通攻击。<br/>使用 QWER键 来释放角色技能。"
		}, {
			words: "关于瞄准：<br/> 角色的攻击会瞄准当前鼠标的位置，如果使用键盘移动的话，就是攻击最近移动的方向。"
		}, {
			which: function() {
				return ap.game.player.level > 6;
			},
			words: "关于提伯斯：<br/> 提伯斯可以吸引周围敌人的注意力，并周期性的灼烧附近的敌人。"
		}, {
			words: "关于回复：<br/> 玩家回复的手段：攻击附带的生命吸取，怪物掉落的生命药水。攻击就是最好的回复。"
		}, {
			words: "关于区域：<br/> 每个地图都有一些特性，具体参考界面左上方的标识。特性会强化怪物的某些方面。"
		}, {
			words: "关于稀有区域：<br/> 稀有区域内有一个特殊的怪物，会召唤其他怪物，而且有概率掉落可继承的稀有物品。"
		}, {
			words: "关于角色属性：<br/> 游戏中可以按下 C键 来显示角色属性面板。"
		}, {
			words: "关于数据统计：<br/> 游戏中可以按下 Y键 来显示统计面板。"
		}, {
			words: "关于暂停：<br/> 游戏中可以按下 Esc键 来暂停游戏。"
		}, {
			words: "关于难度：<br/> 难度影响玩家的等级上限和结局。难度越高，怪物越强，但掉落稀有物品的概率也越大。"
		}, {
			words: "关于中断1：<br/> 游戏中可以随时中断游戏。在暂停游戏界面选择中断游戏，即可保存当前游戏退至主界面。"
		}, {
			words: "下次可以通过主界面的继续来继续上次的游戏。<br/> 继续游戏会将玩家的生命恢复到一半以上，并且重置场景中的怪物。"
		}, {
			words: "关于继承：<br/> 游戏中获得的稀有物品将在玩家死亡时或者中断时保存。下次游戏时将在继承这些稀有物品的情况下进行。"
		}, {
			words: "TIPS 1: <br/> 困难难度在没有继承物品的情况下较难应对，请在简单或者普通模式下获得部分物品后再来挑战。"
		}, {
			words: "TIPS 2: <br/> 危机的时候请不要犹豫，中断游戏再继续可以让角色回复部分生命。"
		}, {
			words: "TIPS 3: <br/> 游戏内置金手指，具体点击F12查看。"
		}]
	}, {
		name: "gameFinish",
		description: "游戏结束",
		trigger: function() {
			if ((ap.game.player.level >= 30 && ap.game.difficulty === 0) ||
				(ap.game.player.level >= 40 && ap.game.difficulty === 1) ||
				(ap.game.player.level >= 50 && ap.game.difficulty === 2)) {
				// 3种难度的结束等级不一样
				this.run();
			}
		},
		needPause: true,
		run: function() {
			ap.ui.playScenario(this);
		},
		// 剧情播放完毕的回调
		callback: function() {
			// 结束游戏
			ap.game.player.life = 0;
			ap.system.saveGame();
		},
		// 剧情演出 台词
		script: [{
			words: "天色渐渐变暗...."
		}, {
			icon: "Annie",
			words: "肚子饿了...回家吧。"
		}, {
			icon: "Annie",
			words: "今天真开心呐，恩，是吧小熊？"
		}, {
			icon: "Bear",
			words: "吼...（温顺）"
		}, {
			which: function() {
				return ap.game.difficulty === 0;
			},
			icon: "Annie",
			words: "下次再带你去远点的地方玩~"
		}, {
			which: function() {
				return ap.game.difficulty === 0;
			},
			words: "(迷之音：简单模式通关。Thanks for playing. 欢迎继续挑战更高难度。）"
		}, {
			which: function() {
				return ap.game.difficulty === 1;
			},
			icon: "Annie",
			words: "下次再带你去更远点的地方玩~ 那边虽然有更厉害的怪物，不过有我在，一定没问题的。"
		}, {
			which: function() {
				return ap.game.difficulty === 1;
			},
			words: "(迷之音：普通模式通关。Thanks for playing. 欢迎继续挑战更高难度。）"
		}, {
			which: function() {
				return ap.game.difficulty === 2;
			},
			icon: "Annie",
			words: "这片树林已经没有我的对手了，以后有机会去别的地方吧~"
		}, {
			which: function() {
				return ap.game.difficulty === 2;
			},
			words: "(迷之音：困难模式通关。Thanks for playing. ）"
		}]
	}];
});