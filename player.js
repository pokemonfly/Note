// 玩家
"use strict";
ap.Player = {
	// 等级
	level : 1,
	// 经验
	exp : 0,
	// 升级需要经验
	nextLvExp : 280,

	// 生命
	life : 300,
	// 生命上限
	lifeLimit : 300,

	// 精神
	spirit : 0,
	// 精神上限
	spiritLimit : 200,
	// 精神恢复速度 每秒恢复数值
	spiritSpeed : 2,

	// 攻击力
	power : 50,
	// 攻速 每秒攻击次数 
	attactSpeed : 0.7,
	// 暴击
	critical : 0.05,
	// 爆炸范围加成
	range : 0,
	// 生命吸取
	drainLife : 0.05,
	

	// 位置
	pos : {},
	// 移动速度
	moveSpeed : 100,

	// 是否有护盾
	hasShield : false,
	// 护盾值
	shield : 0,
	// 护盾上限
	shieldLimit : 0,
	// 护盾上限加成
	shieldBonus : 0,
	// 护盾创建时间
	shieldCreatTime : 0,
	// 护盾剩余时间
	shieldLeftTime : 0,


};