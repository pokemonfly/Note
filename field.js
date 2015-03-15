// 场景 控制当前场上的怪物设定 与场地特性
ap.module("field").requires("feature").defines(function() {
	"use strict";
	ap.field = {
		// 当前区域数
		num: 0,
		// 是否为稀有区域 稀有区域：特殊怪物，经验1.5倍
		isRare: false,
		// =============以下为config中可以变更的属性================
		// 区域强化间隔数
		updateNum: 5,
		// 目前已经生成的怪兽
		monsters: [],
		// 目前已经生成的boss怪兽
		bosses: [],
		// 当前场景的特性
		features: [],
		// 场上预留怪物数目
		monstersAmount: 10,
		// 场上预留boss数目
		bossAmount: 1,
		// 场景特性数目
		featureAmount: 2,
		// 援军增加数目
		monstersPlus: 5,
		// 离开前必须击杀数目
		leaveKill: 15,
		// 每次强化需要击杀数目增加
		leaveKillUpd: 3,
		// 每次强化boss数目增加幅度
		bossUpd: 0.1,
		// 每次强化特性数目增加幅度
		featureUpd: 0.2,
		// 每次强化援军数目增加幅度
		monstersPlusUpd: 0.5,
		// 怪物强度
		strength: 1,
		// 稀有区域概率
		rare: 0.1,

		init: function(config) {
			for (var i in config) {
				this[i] = config[i];
			}
			this.num = 0;
		},
		// 新的场景
		nextWave: function() {
			this.num++;
			this.monsters = [];
			this.bosses = [];
			this.features = [];
			// 区域强化
			if (this.num % this.updateNum === 0) {
				this._update();
			}
			// 设置当前区域特性
			this._setFeature();
			// 设置当前区域是否为稀有
			this.isRare = (Math.random() < this.rare);
			var i, m;
			// 生成怪兽
			for (i = 0; i < this.monstersAmount; i++) {
				m = new ap.Monster(ap.config.monsters[0]);
				m.pos = ap.collision.getRandomPos(30);
				this.monsters.push(m);
			}
			// 生成boss
			for (i = 0; i < this.bossAmount; i++) {
				m = new ap.Monster();
				this.bosses.push(m);
			}
			// 执行特性 强化场景
			for (i = 0; i < this.features.length; i++) {
				this.features[i].effect(this);
			}
			if (this.isRare) {
				// 添加特殊怪兽 TODO
			}
			// 刷新UI显示内容
			ap.ui.setFeature(this.num, this.isRare, this.features, this.leaveKill);
			
			return [].concat(this.monsters).concat(this.bosses);
		},
		// 添加援军
		appendMonster: function() {
			this.monsters = [];
			for (i = 0; i <= this.monstersPlus; i++) {
				m = new ap.Monster();
				this.monsters.push(m);
			}
			return this.monsters;
		},
		// UI显示用的信息抽出
		getUIInfo: function() {
			return {
				num: this.num,
				isRare: this.isRare,
				features: this.features
			};
		},
		// 设置当前的区域数 用于读档
		setNum: function(val) {
			for (; this.num <= val; this.num++) {
				if (this.num % this.updateNum === 0) {
					this._update();
				}
			}
		},
		// 强化当前的区域属性
		_update: function() {
			this.leaveKill += this.leaveKillUpd;
			this.bossAmount += this.bossUpd;
			this.featureAmount += this.featureUpd;
		},
		// 获得场景特性
		_setFeature: function() {
			// 复制数组
			var f = [].concat(ap.feature);
			for (var n = 0; n < this.featureAmount; n++) {
				var r = ~~(Math.random() * f.length);
				this.features.push(f[r]);
				f.splice(r, 1);
			}
		}
	};
});