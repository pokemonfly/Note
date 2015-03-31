var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
var http = require('http');

http.createServer(function (req, res) {
    var html = '<html>'  
        +'<head>'  
        +'<title>nodejs</title>'  
        +'</head>'  
        +'<body>'  
        +'<h1>NodeJS Demo - Git@OSC项目演示平台</h1>'
        +'<p>项目地址：<a href="http://git.oschina.net/demothi/nodejs">http://git.oschina.net/demothi/nodejs</a></p>'
        +'<p>搭建教程：<a href="http://git.oschina.net/demothi/nodejs#nodejs">http://git.oschina.net/demothi/nodejs#nodejs</a></p>'
        +'<iframe src="http://git.oschina.net/paas_demo.html" frameborder="0" scrolling="no" width="500px" height="1500px"></iframe>'
        +'</body>'  
        +'</html>';  
  res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
  res.write(html);
  res.end();
}).listen(port, host);