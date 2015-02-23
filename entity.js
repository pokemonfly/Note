// 实体 所有的物体
"use strict";
ap.Entity = {
	// 生命
	life : 100,
	// 生命上限
	lifeLimit : 100,
	
	// 攻击力
	power : 10,
	// 因状态而改变的
	powerBonus : 0,
	// 攻速 每秒攻击次数 
	attackSpeed : 1，
	// 暴击
	critical : 0,
	// 生命吸取
	drainLife : 0,

	// 移动速度
	moveSpeed : 100,
	// 移动速度奖励
	moveSpeedBonus : 0,
	// 是否定身
	isImmobilize : false,

	// 是否有反射Buff
	isReflection : false,

	// 是否死亡
	isKilled : false,

	// 状态 buff & debuff
	status : [],
	// 持有技能
	skills : [],

	anims: {},
    animSheet: null,

    // 碰撞体积 半径
    radius : 10,
    // 位置
    pos : {},

	// 准备阶段 检查状态效果
	onReady : function () {
		this.skills.map(function (s) {
			s.effect(this);
		});
		// 如果有自定义的事件，一并执行
		if (this.ready) {
			this.ready();
		}
	},

	// 受到治疗
	onHeal : function (heal) {
		this.life += heal;
		if (this.life > this.lifeLimit) {
			this.life = this.lifeLimit;
		}
	},

	// 造成伤害
	onDamage : function (damage) {
		// 吸血判定
		if (this.drainLife > 0) {
			this.onHeal(damage * this.drainLife);
		}
	},

	// 受到伤害  canReflection: 伤害能否反射
	onHurt : function (damage, attacker, canReflection) {
		if (this.hurt) {
			this.hurt(damage);
		} else {
			this.life -= damage;
		}
		
		// 检查反射Buff
		if (this.isReflection && ! canReflection) {
			// 反射的伤害不会再次触发反射
			ap.Mediator.attack(this, attacker, damage * 0.5, "reflection", null, null, true);
		}

		if (this.life <= 0) {
			this.onDead();
			return true;
		} else {
			return false;
		}

	},

	// 死亡事件
	onKill : function () {
		this.isKilled = true;
	},

	update : function () {},
	draw : function () {},

};