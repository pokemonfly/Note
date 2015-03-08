// 图片
ap.module('image').requires("class").defines(function() {
    "use strict";
    ap.Image = ap.Class.extend({
        // 图像对象
        data: null,
        path: '',
        loaded: false,
        width: 0,
        heapht: 0,
        loadCallback: null,
        // 图片的偏移量
        offset: {
            x: 0,
            y: 0
        },
        // 偏移方式
        offsetType: 0,
        init: function(path, offsetType) {
            this.path = path;
            this.offsetType = offsetType || 0;
            this.load();
        },
        load: function(loadCallback) {
            if (this.loaded) {
                if (loadCallback) {
                    loadCallback(this.path, true);
                }
                return;
            } else if (!this.loaded) {
                this.loadCallback = loadCallback || null;
                this.data = new Image();
                this.data.onload = this.onload.bind(this);
                this.data.onerror = this.onerror.bind(this);
                this.data.src = this.path;
            }
        },
        onload: function(event) {
            this.width = this.data.width;
            this.height = this.data.height;
            this.loaded = true;
            if (this.offsetType > 0) {
                // 设置偏移量 
                if (this.offsetType == ap.Image.OFFSET.BELOW) {
                    this.offset.x = ~~(this.width / 2 + 0.5);
                    this.offset.y = this.height;
                } else if (this.offsetType == ap.Image.OFFSET.LOWER_LEFT) {
                    this.offset.x = 0;
                    this.offset.y = this.width;
                }
            }
            if (this.loadCallback) {
                this.loadCallback(this.path, true);
            }
        },
        onerror: function(event) {
            console.log("图片加载失败" + this.path);
            if (this.loadCallback) {
                this.loadCallback(this.path, false);
            }
        },
        draw: function(targetX, targetY, sourceX, sourceY, width, height) {
            if (!this.loaded) {
                return;
            }
            sourceX = sourceX ? sourceX : 0;
            sourceY = sourceY ? sourceY : 0;
            width = width ? width : this.width;
            height = height ? height : this.height;
            ap.system.context.drawImage(this.data, sourceX, sourceY, width, height,
                targetX - this.offset.x, targetY - this.offset.y, width, height);
        }
    });
    // 偏移方式 
    ap.Image.OFFSET = {
        // 正下方
        BELOW: 1,
        // 左下方
        LOWER_LEFT: 2
    };
});