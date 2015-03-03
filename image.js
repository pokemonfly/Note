// 图片
ap.module('image').requires().defines(function() {
	"use strict";
    ap.Image = ap.Class.extend({
    	// 图像对象
    	data: null,
    	path: '',
    	loaded: false,
    	width: 0,
        heapht: 0,
        loadCallback: null,
        init: function(path) {
            this.path = path;
            this.load();
        },
        load: function(loadCallback) {
            if (this.loaded) {
                if (loadCallback) {
                    loadCallback(this.path, true);
                }
                return;
            } else if (!this.loaded && ap.ready) {
                this.loadCallback = loadCallback || null;
                this.data = new Image();
                this.data.onload = this.onload.bind(this);
                this.data.onerror = this.onerror.bind(this);
                this.data.src = ap.prefix + this.path;
            } else {
                ap.addResource(this);
            }
            ap.Image.cache[this.path] = this;
        },
        onload: function(event) {
            this.width = this.data.width;
            this.height = this.data.height;
            this.loaded = true;
            if (ig.system.scale != 1) {
                this.resize(ig.system.scale);
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
            							ap.system.getDrawPos(targetX), ap.system.getDrawPos(targetY), width, height);
        }
    });
    // 缓冲已经加载过的图片
    ap.Image.cache = {};
});
