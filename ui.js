// UI 关联用
ap.module("ui").requires("utils").defines(function() {
	ap.ui = {
		_ : ap.utils,
		canvas : null,
		life : null,

		shield : null,
		skillList : [],
		messageField : null,
		// 缓存最近30条信息
		messages : [],
		init : function () {
			shield = ap.$("#shield");
			life = ap.$("#life");
		},
		setLife : function (per) {

		},
		setShield : function (per) {
			if (per > 0) {
				this.shield.style.display = "";
				_.addClass(life, "hasShield");
			} else {
				this.shield.style.display = "none";
				_.removeClass(life, "hasShield");
			}
		},
		setMessage : function (message) {
			this.messages.push(message);
			// 超出消除
			if (this.messages.length > 30) {
				this.messages.shift();
			}
			this.messagesField.innerHTML = this.messages.join("\n");
		}
	};
});