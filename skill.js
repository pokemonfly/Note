// 技能 所有的攻击效果
ap.module("skill").defines(function() {
	"use strict";
	ap.Skill = {
		CHARGE: {
			id: "Charge",
			name: "冲锋",
			description: null,
			coolDown: 10,
			cost: 0,
			caster: null,
			cast: function() {
				this.caster.status.push(new ap.Status["CHARGE"]);
			}
		},
		FIRE: {
			id: "Fire",
			name: "冲锋",
			description: null,
			coolDown: 10,
			cost: 0,
			caster: null,
			cast: function() {
				this.caster.status.push(new ap.Status["CHARGE"]);
			}
		}


	};
	// ap.Skill.prototype.cast = function () {
	// 	this.effect
	// };
	ap.Skill.createSkill = function(id, power ) {

	};
	// 冲锋
	ap.Skill.Charge = function() {

	};
	// 连射
	ap.Skill.Fire = function() {

	}
});