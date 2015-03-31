// 图片
ap.module('image').requires("class").defines(function() {
    "use strict";
    ap.Image = ap.Class.extend({
        // 图像对象
        data: null,
        path: '',
        loaded: false,
        width: 0,
        height: 0,
        // 图片的偏移量 相对于锚点
        offset: null,
        // sprite图片的起点坐标
        sourceX: 0,
        sourceY: 0,
        // 如果指定了sourceX sourceY 则需要指定width, height
        init: function(path, offset, sourceX, sourceY, width, height) {
            this.path = path;
            this.offset = offset || null;
            this.sourceX = sourceX || 0;
            this.sourceY = sourceY || 0;
            this.width = width;
            this.height = height;
            this.load();
        },
        load: function() {
            if (this.loaded) {
                return;
            } else if (!this.loaded) {
                this.data = new Image();
                this.data.onload = this.onload.bind(this);
                this.data.onerror = this.onerror.bind(this);
                this.data.src = this.path;
            }
        },
        onload: function(event) {
            this.width = this.width || this.data.width;
            this.height = this.height || this.data.height;
            this.loaded = true;
            if (!this.offset) {
                // 设置偏移量 
                this.offset = {};
                this.offset.x = Math.round(this.width / 2);
                this.offset.y = Math.round(this.height / 2);
            }
        },
        onerror: function(event) {
            console.log("图片加载失败" + this.path);
        },
        // 绘制 目标位置，角度
        draw: function(targetX, targetY, angle) {
            if (!this.loaded) {
                return;
            }
            if (angle) {
                // 需要旋转
                ap.game.context.save();
                ap.game.context.translate(targetX, targetY);
                ap.game.context.rotate(angle);
                ap.game.context.drawImage(this.data,
                    this.sourceX, this.sourceY, this.width, this.height, -this.offset.x, -this.offset.y,
                    this.width, this.height);
                // 锚点测试
                // ap.game.context.fillRect(0 - 3, 0 - 3, 6, 6);
                ap.game.context.restore();
            } else {
                ap.game.context.drawImage(this.data, this.sourceX, this.sourceY, this.width, this.height,
                    targetX - this.offset.x, targetY - this.offset.y, this.width, this.height);
            }
        }
    });
    // 偏移方式 
    ap.Image.OFFSET = {
        // 正下方
        BELOW: {
            x: 0,
            y: 0
        },
        // 左下方
        LOWER_LEFT: {
            x: 0,
            y: 0
        }
    };
});