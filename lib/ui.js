// UI 关联DOM用
// 以防万一
window.requestAnimationFrame = window.requestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
ap.module("ui").requires("utils").defines(function() {
	"use strict";
	ap.ui = {
		// 当前游戏动画循环调用用
		_anims: {},
		_next: 1,
		// 战斗信息计数 最多30个
		messageCount: 0,
		// 剧情界面是否加过listener
		scenarioHasEvent: false,
		// =============剧情相关=============
		// 当前播放的剧情
		script: null,
		// 当前播放到的位置
		cur: 0,
		// 剧情的返回值
		returnValue: 0,
		// 剧情播放完的回调
		callback: null,
		// 游戏是否暂停
		isPause: false,
		// =============DOM关联==================
		// Loading界面
		loading: null,
		// 主界面
		main: null,
		// 主界面 - 选项
		startGame: null,
		continueGame: null,
		// 剧情界面
		scenario: null,
		// 剧情界面 - 背景
		scenarioBg: null,
		// 剧情界面 - 头像		
		head: null,
		// 剧情界面 - 文本
		lines: null,
		// 剧情界面 - 画面选项 框
		selecter: null,
		// 剧情界面 - 画面选项 内容
		selectList: null,
		// 游戏界面
		gameUI: null,
		// 游戏界面 - 战斗信息
		messageList: null,
		// 游戏界面 - 画布
		canvas: null,
		// 等级
		level: null,
		// 游戏界面 - 血条
		life: null,
		lifeNum: null,
		lifeBar: null,
		// 游戏界面 - 护盾条
		shield: null,
		shieldNum: null,
		shieldBar: null,
		// 游戏界面 - 经验条
		exp: null,
		// 游戏界面 - 技能栏
		skillList: [],
		// 游戏界面 - 区域特性栏 - 区域号
		areaCount: null,
		// 游戏界面 - 区域特性栏 - 稀有标识
		rare: null,
		// 游戏界面 - 区域特性栏 - 特性列表
		featureList: null,
		// 游戏界面 - 区域特性栏 - 剩余击杀数
		leaveKill: null,
		// 游戏界面 - 区域特性栏 - 文字说明 可以离开
		canLeave: null,
		// 游戏界面 - 区域特性栏 - 文字说明 不能离开
		cannotLeave: null,
		// 游戏界面 - 角色面板 
		playerInfo: null,
		// 游戏界面 - 角色面板 - 名称
		nameInfo: null,
		// 游戏界面 - 角色面板 - 等级
		levelInfo: null,
		// 游戏界面 - 角色面板 - 距离升级
		nextLvExpInfo: null,
		// 游戏界面 - 角色面板 - 生命
		lifeInfo: null,
		// 游戏界面 - 角色面板 - 攻击力
		powerInfo: null,
		// 游戏界面 - 角色面板 - 攻速
		attackSpeedInfo: null,
		// 游戏界面 - 角色面板 - 暴击
		criticalInfo: null,
		// 游戏界面 - 角色面板 - 生命吸取
		drainLifeInfo: null,
		// 游戏界面 - 角色面板 - 移动速度
		moveSpeedInfo: null,
		// 游戏界面 - 角色面板 - 闪避
		dodgeInfo: null,
		// 游戏界面 - 技能栏 - 技能0 - 普通攻击
		skill0: null,
		// 游戏界面 - 技能栏 - 技能1
		skill1: null,
		// 游戏界面 - 技能栏 - 技能2
		skill2: null,
		// 游戏界面 - 技能栏 - 技能3
		skill3: null,
		// 游戏界面 - 技能栏 - 技能4
		skill4: null,
		// 游戏界面 - 状态栏
		statusList: null,
		// 游戏界面 - 系统菜单
		systemMenu: null,
		// 游戏界面 - 系统菜单 - 中断
		save: null,
		// 游戏界面 - 系统菜单 - 返回
		returnGame: null,
		// 游戏界面 - 统计
		achievement: null,
		// 游戏界面 - 统计 - 稀有物品收集
		rareCollect: null,
		// 游戏界面 - 统计 - 本次游戏击杀怪物数
		currentKillCount: null,
		// 游戏界面 - 统计 - 本次游戏游戏时间
		currentGameTime: null,
		// 游戏界面 - 统计 - 嗜火
		skillKillCount0: null,
		// 游戏界面 - 统计 - 焚烧
		skillKillCount1: null,
		// 游戏界面 - 统计 - 碎裂之火
		skillKillCount2: null,
		// 游戏界面 - 统计 - 提伯斯-爪击
		skillKillCount3: null,
		// 游戏界面 - 统计 - 提伯斯-灼热
		skillKillCount4: null,
		// 游戏界面 - 统计 - 嗜火爆炸
		skillKillCount5: null,
		// 游戏界面 - 统计 - 碎裂之火爆炸
		skillKillCount6: null,
		// 游戏界面 - 统计 - 毒焰
		skillKillCount7: null,
		// 游戏界面 - 统计 - 总计击杀怪物数
		killCount: null,
		// 游戏界面 - 统计 - 总计游戏时间
		gameTime: null,
		// 游戏界面 - 统计 - 角色最高等级
		maxLevel: null,
		// 游戏界面 - 统计 - 最远达到的区域数
		maxFieldNum: null,
		// 角色面板是否显示中
		playerInfoIsShow: false,
		// 统计面板是否显示中
		achievementIsShow: false,

		// DOM 关联  是否有上次的存档
		init: function(hasLastGame) {
			// loading 界面
			this.loading = ap.$("#loading");
			// 主界面
			this.main = ap.$("#main");
			this.startGame = ap.$("#newGame");
			this.continueGame = ap.$("#loadGame");
			// 剧情界面
			this.scenario = ap.$("#scenario");
			this.selecter = ap.$("#selecter");
			this.selectList = ap.$("#selectList");
			this.scenarioBg = ap.$("#scenarioBg");
			this.head = ap.$("#head");
			this.messageList = ap.$("#messageInfo");
			this.lines = ap.$("#lines");
			// 游戏界面
			this.gameUI = ap.$("#ui");
			this.canvas = ap.$("canvas")[0];
			this.level = ap.$("#level");
			this.life = ap.$("#life");
			this.lifeBar = ap.$("#lifeInner");
			this.lifeNum = ap.$("#lifeNum");
			this.shield = ap.$("#shieldInner");
			this.shieldNum = ap.$("#shieldNum");
			this.shieldBar = ap.$("#shieldInner");
			this.exp = ap.$("#expInner");
			// 游戏界面 - 区域特性栏
			this.areaCount = ap.$("#areaCount");
			this.rare = ap.$("#rare");
			this.featureList = ap.$("#featureList");
			this.leaveKill = ap.$("#leaveKill");
			this.canLeave = ap.$("#canLeave");
			this.cannotLeave = ap.$("#cannotLeave");
			// 游戏界面 - 角色面板
			this.playerInfo = ap.$("#playerInfo");
			this.nameInfo = ap.$("#nameInfo");
			this.levelInfo = ap.$("#levelInfo");
			this.nextLvExpInfo = ap.$("#nextLvExpInfo");
			this.lifeInfo = ap.$("#lifeInfo");
			this.powerInfo = ap.$("#powerInfo");
			this.attackSpeedInfo = ap.$("#attackSpeedInfo");
			this.criticalInfo = ap.$("#criticalInfo");
			this.drainLifeInfo = ap.$("#drainLifeInfo");
			this.moveSpeedInfo = ap.$("#moveSpeedInfo");
			this.dodgeInfo = ap.$("#dodgeInfo");
			// 游戏界面 - 技能栏
			this.skill0 = ap.$("#skill0");
			this.skill1 = ap.$("#skill1");
			this.skill2 = ap.$("#skill2");
			this.skill3 = ap.$("#skill3");
			this.skill4 = ap.$("#skill4");
			// 游戏界面 - 状态栏
			this.statusList = ap.$("#statusList");
			// 游戏界面 - 系统菜单
			this.systemMenu = ap.$("#system");
			this.save = ap.$("#save");
			this.returnGame = ap.$("#returnGame");
			// 游戏界面 - 统计
			this.achievement = ap.$("#achievement");
			this.rareCollect = ap.$("#rareCollect");
			this.currentKillCount = ap.$("#currentKillCount");
			this.currentGameTime = ap.$("#currentGameTime");
			this.skillKillCount0 = ap.$("#skillKillCount0");
			this.skillKillCount1 = ap.$("#skillKillCount1");
			this.skillKillCount2 = ap.$("#skillKillCount2");
			this.skillKillCount3 = ap.$("#skillKillCount3");
			this.skillKillCount4 = ap.$("#skillKillCount4");
			this.skillKillCount5 = ap.$("#skillKillCount5");
			this.skillKillCount6 = ap.$("#skillKillCount6");
			this.skillKillCount7 = ap.$("#skillKillCount7");
			this.killCount = ap.$("#killCount");
			this.gameTime = ap.$("#gameTime");
			this.maxLevel = ap.$("#maxLevel");
			this.maxFieldNum = ap.$("#maxFieldNum");

			this.canvas.height = document.body.clientHeight;
			this.canvas.width = document.body.clientWidth;

			// DOM 事件绑定
			// 开始按钮
			this.startGame.addEventListener("click", function() {
				ap.ui.newGame();
				event.stopPropagation();
				event.preventDefault();
			});
			// 继续按钮
			this.continueGame.addEventListener("click", function() {
				if (!ap.ui.hasClass(this, "disable")) {
					ap.ui.loadGame();
				}
				event.stopPropagation();
				event.preventDefault();
			});
			// 游戏系统菜单界面按钮
			this.save.addEventListener("click", function() {
				ap.system.saveGame();
				event.stopPropagation();
				event.preventDefault();
			});
			this.returnGame.addEventListener("click", function() {
				ap.ui.showPause();
				event.stopPropagation();
				event.preventDefault();
			});
			// 游戏系统菜单界面隐藏 ESC键
			window.addEventListener('keyup', function(event) {
				if (event.keyCode == ap.KEY.ESC && !ap.ui.hasClass(ap.ui.systemMenu, "hidden")) {
					// 取消暂停
					ap.ui.showPause();
				}
			}, false);
			// 剧情界面的跳过按钮
			ap.$("#close").addEventListener("click", this.skipScenario.bind(this), false);

			// 战斗信息列表的滚动事件
			ap.$("#message").addEventListener("mousewheel", function(e) {
				var w = e.wheelDelta > 0 ? 1 : -1,
					ul = this.children[0].children[0],
					height = ul.offsetHeight,
					pHeight = ul.parentNode.offsetHeight,
					top = +(ul.style.top || "0px").replace("px", ""),
					newTop = top;
				if (height > pHeight) {
					newTop += 5 * w;
					if (newTop > 0) {
						newTop = 0;
					}
					if (newTop < pHeight - height) {
						newTop = pHeight - height;
					}
					ul.style.top = newTop + "px";
				}
			});
			// 快捷方式 系统图标
			ap.$("#playInfoIcon").addEventListener("click", this.showRolePanel.bind(this), false);
			ap.$("#achieveIcon").addEventListener("click", this.showAchievement.bind(this), false);
			ap.$("#helpIcon").addEventListener("click", this.showHelp.bind(this), false);
			// 面板的关闭按钮
			ap.$("#closePlayerInfo").addEventListener("click", this.showRolePanel.bind(this), false);
			ap.$("#closeAchieve").addEventListener("click", this.showAchievement.bind(this), false);
			// 防止选中内容
			document.body.onselectstart = function() {
				return false;
			};
			window.addEventListener("resize", this.resize.bind(this));
		},
		// 窗口变化大小时
		resize: function() {
			var width = document.body.clientWidth,
				height = document.body.clientHeight;
			this.canvas.height = height;
			this.canvas.width = width;
			ap.game.width = width;
			ap.game.height = height;
		},
		// 重置UI内容
		resetUI: function() {
			// 清空信息战斗信息列表的内容
			if (this.messageList.children.length > 0) {
				this.messageList.innerHTML = "";
				this.messageCount = 0;
			}
			// 隐藏弹出的界面
			this.addClass(this.playerInfo, "hidden");
			this.addClass(this.systemMenu, "hidden");
			this.addClass(this.achievement, "hidden");
			this.setShield(0);
			this.addMessage("欢迎开始冒险~");
			this.addMessage("游戏中可以随时按Esc键暂停。");
		},
		// CSS 操作
		hasClass: function(obj, cls) {
			return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		},
		addClass: function(obj, cls) {
			if (!this.hasClass(obj, cls)) {
				obj.className += " " + cls + " ";
			}
		},
		removeClass: function(obj, cls) {
			if (this.hasClass(obj, cls)) {
				var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
				obj.className = obj.className.replace(reg, '');
			}
		},

		// 动画循环播放
		setAnimation: function(callback) {
			var current = this._next++;
			this._anims[current] = true;
			var animate = function() {
				if (!ap.ui._anims[current]) {
					return;
				}
				window.requestAnimationFrame(animate);
				callback();
			};
			window.requestAnimationFrame(animate);
			return current;
		},
		// 清空当前播放的动画
		clearAnimation: function(id) {
			delete this._anims[id];
		},

		// ==============剧情播放相关==============
		// 播放剧情
		playScenario: function(scenario) {
			this.script = scenario.script;
			if (scenario.needPause) {
				this.pause();
			}
			// 显示剧情界面
			this.showUI("scenario");
			this.callback = scenario.callback || {};
			this.cur = 0;
			// 设置背景 
			if (scenario.background) {
				if (scenario.background != "canvas") {
					this.removeClass(this.scenarioBg, "hidden");
					this.scenarioBg.style.backgroundImage = scenario.background;
				} else {
					this.addClass(this.scenarioBg, "hidden");
				}
			} else {
				this.scenarioBg.style.backgroundImage = "";
				this.removeClass(this.scenarioBg, "hidden");
			}
			this.playNext();
		},
		// 播放下一句
		playNext: function() {
			if (this.cur == this.script.length) {
				this.scenarioRemoveListener();
				// 如果之前暂停了的话，恢复游戏
				this.start();
				this.showUI("gameUI");
				// 剧情播放完毕执行回调
				if (this.callback) {
					this.callback(this.returnValue);
				}
				return;
			}
			var section = this.script[this.cur];
			this.cur++;
			// 判断当前条件是否要播放 针对选择枝
			if (section.which && !section.which(this.returnValue)) {
				this.playNext();
				return;
			}
			// 设置头像
			if (section.icon) {
				this.head.className = section.icon.toLowerCase();
			} else {
				this.head.className = "none";
			}
			// 设置台词
			if (section.words) {
				this.lines.innerHTML = section.words;
			} else {
				this.lines.innerHTML = "";
			}
			// 创建一个选择菜单 并关联监听器
			if (section.select) {
				this.removeClass(this.selecter, "hidden");
				this.selectList.innerHTML = "";
				var fr = document.createDocumentFragment();
				var i = 0;
				section.select.map(function(s) {
					var li = ap.$new("li");
					li.innerHTML = s;
					li.addEventListener("click", (function(val) {
						return function() {
							ap.ui.returnValue = val;
							ap.ui.playNext();
						};
					})(i));
					fr.appendChild(li);
					i++;
				});
				this.selectList.appendChild(fr);
				this.scenarioRemoveListener();
			} else {
				this.addClass(this.selecter, "hidden");
				// 添加动作
				if (!this.scenarioHasEvent) {
					window.addEventListener("keyup", this.playNextHandler, false);
					window.addEventListener("mouseup", this.playNextHandler, false);
					this.scenarioHasEvent = true;
				}
			}

		},
		// 跳过剧情
		skipScenario: function() {
			this.cur = this.script.length;
			ap.ui.playNext();
		},
		playNextHandler: function(e) {
			// 点击画面或者按下空格或Enter时
			if (e.type !== 'keyup' || e.keyCode === 32 || e.keyCode === 13) {
				ap.ui.playNext();
			}
		},
		// 去掉剧情绑定的事件
		scenarioRemoveListener: function() {
			if (this.scenarioHasEvent) {
				window.removeEventListener("keyup", this.playNextHandler, false);
				window.removeEventListener("mouseup", this.playNextHandler, false);
				this.scenarioHasEvent = false;
			}
		},
		// 接收画面点击的选项
		setResultValue: function(val) {
			this.returnValue = val;
			this.playNext();
		},
		// 画面点击新游戏
		newGame: function() {
			this.resetUI();
			// 触发新开游戏事件
			ap.mediator.fire("newGame");
		},
		// 画面点击继续
		loadGame: function() {
			this.resetUI();
			// 触发新开游戏事件
			ap.mediator.fire("loadGame");
		},
		// 显示指定界面
		showUI: function(name) {
			var list = ["loading", "main", "scenario", "gameUI"];
			for (var i = 0; i < list.length; i++) {
				if (name == list[i]) {
					this.removeClass(this[list[i]], "hidden");
				} else {
					this.addClass(this[list[i]], "hidden");
				}
			}
			if (name == "main") {
				if (ap.system.hasLastGame()) {
					this.removeClass(this.continueGame, "disable");
				} else {
					this.addClass(this.continueGame, "disable");
				}
			}
		},
		// ============================游戏UI相关============================
		// 设置等级
		setLevel: function(lv) {
			this.level.innerHTML = lv;
		},
		// 刷新血量条
		setLife: function(num, max) {
			this.lifeNum.innerHTML = ~~num + "/" + ~~max;
			this.lifeBar.style.width = (num / max * 100) + "%";
			// 刷新角色面板
			this.refreshRoleJoho();
		},
		// 刷新护盾条
		setShield: function(num, max) {
			if (num === 0) {
				// 护盾耗尽 消除护盾
				this._showShield(false);
				return;
			}
			if (num == max) {
				// 初次添加
				this._showShield(true);
			}
			this.shieldNum.innerHTML = ~~num + "/" + ~~max;
			this.shieldBar.style.width = (num / max * 100) + "%";
		},
		// 更新经验条
		setExpUI: function(num, max) {
			var per = ~~(num / max * 100);
			this.exp.style.width = per + "%";
			this.exp.parentNode.title = "当前经验：" + num + " 距离升级还有：" + (max - num);
			this.level.title = "当前经验：" + num + " 距离升级还有：" + (max - num);
		},
		// 控制护盾界面是否显示
		_showShield: function(flg) {
			if (flg) {
				this.addClass(this.life, "hasShield");
				this.removeClass(this.shield, "hidden");
				this.removeClass(this.shieldNum, "hidden");
			} else {
				this.removeClass(this.life, "hasShield");
				this.addClass(this.shield, "hidden");
				this.addClass(this.shieldNum, "hidden");
			}
		},
		// 添加战斗信息
		addMessage: function(message, color) {
			this.messageCount++;
			// 超出消除
			if (this.messageCount > 50) {
				this.messageList.removeChild(this.messageList.children[0]);
				this.messageCount--;
			}
			if (color) {
				message = "<span style='color:" + color + ";'>" + message + "</span>";
			}
			var m = ap.$new("li");
			m.innerHTML = (new Date()).toTimeString().substr(0, 8) + " " + message;
			this.messageList.appendChild(m);
			// 保持显示最后一行
			var height = this.messageList.offsetHeight,
				pHeight = this.messageList.parentNode.offsetHeight;
			if (height > pHeight) {
				this.messageList.style.top = pHeight - height + "px";
			} else {
				this.messageList.style.top = "0px";
			}
		},
		// 设置特性栏
		setFeature: function(areaCount, isRare, feature, leaveKill) {
			this.areaCount.innerHTML = areaCount;
			if (isRare) {
				this.removeClass(this.rare, "hidden");
			} else {
				this.addClass(this.rare, "hidden");
			}
			this.featureList.innerHTML = "";
			var df = document.createDocumentFragment();
			for (var i = 0; i < feature.length; i++) {
				var span = ap.$new("span");
				span.innerHTML = feature[i].name;
				span.title = feature[i].description;
				span.className = "pointer";
				df.appendChild(span);
			}
			this.featureList.appendChild(df);
			this.removeClass(this.cannotLeave, "hidden");
			this.addClass(this.canLeave, "hidden");
			this.leaveKill.innerHTML = leaveKill;
		},
		// 更新离开前击杀数
		setLeaveKill: function(num) {
			if (num === 0) {
				this.removeClass(this.canLeave, "hidden");
				this.addClass(this.cannotLeave, "hidden");
			} else {
				this.leaveKill.innerHTML = num;
			}
		},
		// 显示 / 隐藏 角色信息面板
		showRolePanel: function() {
			if (this.hasClass(this.playerInfo, "hidden")) {
				// 显示面板
				this.removeClass(this.playerInfo, "hidden");
				this.playerInfoIsShow = true;
				this.refreshRoleJoho();
			} else {
				// 隐藏面板
				this.addClass(this.playerInfo, "hidden");
				this.playerInfoIsShow = false;
			}
		},
		// 刷新角色面板内容
		refreshRoleJoho: function() {
			if (this.playerInfoIsShow) {
				var player = ap.game.player;
				if (player) {
					this.nameInfo.innerHTML = player.name;
					this.levelInfo.innerHTML = player.level;
					this.nextLvExpInfo.innerHTML = player.nextLvExp - player.exp;
					this.lifeInfo.innerHTML = ~~player.life + "/" + player.lifeLimit;
					this.powerInfo.innerHTML = ~~player.power;
					this.attackSpeedInfo.innerHTML = player.attackSpeed.toFixed(2);
					this.criticalInfo.innerHTML = ~~(player.critical * 100);
					this.drainLifeInfo.innerHTML = ~~(player.drainLife * 100);
					this.moveSpeedInfo.innerHTML = ~~player.moveSpeed;
					this.dodgeInfo.innerHTML = ~~(player.dodge * 100);
				} else {
					// 在player初始化的时候是取不到ap.game.player的
					window.setTimeout(function() {
						ap.ui.refreshRoleJoho();
					}, 1);
				}
			}
		},
		// 初始化技能栏图标
		initSkillUI: function(player) {
			var skills = [];
			// 对象转换为数组
			for (var s in player.skills) {
				skills.push(player.skills[s]);
			}
			// 玩家的技能默认有5个
			for (var i = 0; i < skills.length; i++) {
				var dom = this["skill" + i],
					sk = skills[i];
				dom.style.background = "url('" + sk.icon + "')";
				dom.title = sk.description;
				ap.ui.removeClass(dom.children[0], "playCd");
				// 建立DOM关联
				sk.dom = dom;
				if (sk.isLock) {
					this.setSkillStatus(dom, false);
				}
			}

		},
		// 设置技能冷却中的动画效果 dom: 技能图标节点 cd：动画效果时间
		setCoolDown: function(dom, cd) {
			var node = dom.children[0];
			// 设置冷却时间
			node.style.animationDuration = cd + "s";
			node.style.animationPlayState = "running";
			node.style.webkitAnimationDuration = cd + "s";
			node.style.webkitAnimationPlayState = "running";
			ap.ui.removeClass(node, "playCd");
			// 使用异步来实现dom的绘制
			window.setTimeout(function() {
				ap.ui.addClass(node, "playCd");
			}, 15);
			// 这里设为15是因为可悲的IE不响应。
		},
		// 初始化玩家状态栏图标
		initStatusUI: function() {
			var fr = document.createDocumentFragment();
			this.statusList.innerHTML = "";
			for (var s in ap.status) {
				var status = ap.status[s];
				if (status.hasOwnProperty("icon")) {
					// 只对有编号的状态初始化
					var li = ap.$new("li");
					// buff左对齐，debuff右对齐
					this.addClass(li, status.type);
					// 初期不显示
					this.addClass(li, "hidden");
					li.style.backgroundPositionX = -status.icon * 30 + "px";
					li.style.backgroundPositionY = "0px";
					li.title = status.description;
					status.dom = li;
					fr.appendChild(li);
				}
			}
			this.statusList.appendChild(fr);
		},
		// 状态显示
		showStatus: function(dom, time) {
			var timer = dom.getAttribute("timer");
			// 刷新状态的场合， 去掉旧状态的setTimeout
			if (timer !== null) {
				// 转换为数组
				timer = timer.split(",");
				for (var i = 0; i < timer.length; i++) {
					window.clearTimeout(timer[i]);
				}
			}
			timer = [];
			// 显示图标
			this.removeClass(dom, "hidden");
			// 时间到了 自动消失
			var t = window.setTimeout(function() {
				ap.ui.addClass(dom, "hidden");
			}, time * 1000);
			timer.push(t);
			// 少于3秒的时候状态栏闪动
			if (time > 3) {
				time -= 3;
			} else {
				time = 0;
			}
			//状态栏闪动
			this.removeClass(dom, "twinkling");
			t = window.setTimeout(function() {
				ap.ui.addClass(dom, "twinkling");
			}, time * 1000);
			timer.push(t);
			dom.setAttribute("timer", timer.join(","));
		},
		// 游戏暂停
		pause: function() {
			ap.system.pause();
			this.isPause = true;
			// 技能CD的动画的停止
			for (var i = 0; i < 5; i++) {
				var dom = this["skill" + i].children[0];
				if (dom && this.hasClass(dom, "playCd")) {
					dom.style.animationPlayState = "paused";
					dom.style.webkitAnimationPlayState = "paused";
				}
			}
		},
		// 游戏恢复
		start: function() {
			if (this.isPause) {
				ap.system.startLoop();
				for (var i = 0; i < 5; i++) {
					var dom = this["skill" + i].children[0];
					if (dom && this.hasClass(dom, "playCd")) {
						dom.style.animationPlayState = "running";
						dom.style.webkitAnimationPlayState = "running";
					}
				}
			}
		},
		// 暂停菜单的显示与隐藏
		showPause: function() {
			if (this.hasClass(this.systemMenu, "hidden")) {
				// 暂停游戏 显示菜单
				this.pause();
				this.removeClass(this.systemMenu, "hidden");
			} else {
				this.addClass(this.systemMenu, "hidden");
				// 隐藏菜单 继续游戏
				this.start();
			}
		},
		showHelp: function() {
			ap.mediator.fire("help");
		},
		setSkillStatus: function(dom, isReady) {
			if (isReady) {
				this.removeClass(dom.children[0], "skillLock");
			} else {
				this.addClass(dom.children[0], "skillLock");
			}
		},
		// 显示/ 隐藏 统计界面
		showAchievement: function() {
			if (this.hasClass(this.achievement, "hidden")) {
				// 显示面板
				this.removeClass(this.achievement, "hidden");
				this.achievementIsShow = true;
				this.refreshAchievement()
			} else {
				// 隐藏面板
				this.addClass(this.achievement, "hidden");
				this.achievementIsShow = false;
			}
		},
		// 刷新统计界面内的数据
		refreshAchievement: function() {
			// 不显示的时候不需要刷新
			if (this.achievementIsShow) {
				var a = ap.achievement;
				this.rareCollect.innerHTML = a.rareItemCollect.length + " / " + ap.config.items["RARE"].length;
				this.currentKillCount.innerHTML = a.currentKillCount;
				a.currentGameTime = ~~ap.Timer.time;
				this.currentGameTime.innerHTML = this._formatGameTime(a.currentGameTime);
				this.skillKillCount0.innerHTML = a.skillKillCount["嗜火"];
				this.skillKillCount1.innerHTML = a.skillKillCount["焚烧"];
				this.skillKillCount2.innerHTML = a.skillKillCount["碎裂之火"];
				this.skillKillCount3.innerHTML = a.skillKillCount["提伯斯-爪击"];
				this.skillKillCount4.innerHTML = a.skillKillCount["提伯斯-灼热"];
				this.skillKillCount5.innerHTML = a.skillKillCount["嗜火爆炸"];
				this.skillKillCount6.innerHTML = a.skillKillCount["碎裂之火爆炸"];
				this.skillKillCount7.innerHTML = a.skillKillCount["毒焰"];
				this.killCount.innerHTML = a.killCount + a.currentKillCount;
				this.gameTime.innerHTML = this._formatGameTime(a.gameTime + a.currentGameTime);
				this.maxLevel.innerHTML = (ap.game.player.level > a.maxLevel ? ap.game.player.level : a.maxLevel);
				this.maxFieldNum.innerHTML = (ap.field.num > a.maxFieldNum ? ap.field.num : a.maxFieldNum);
				// 自动更新时间
				window.setTimeout(function() {
					ap.ui.refreshAchievement();
				}, 1000);
			}
		},
		// 将时间秒转换为文字列
		_formatGameTime: function(time) {
			var s = time % 60,
				m = ~~(time / 60) % 60,
				h = ~~(time / 3600);
			if (s < 10) {
				s = "0" + s;
			}
			if (m < 10) {
				m = "0" + m;
			}
			return h + " : " + m + " : " + s;
		}
	};
});