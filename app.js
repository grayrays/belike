var express = require('express'); // express 모듈을불러옵니다.
var app = express(); // app.js 에서 사용할 변수 app을 생성합니다.


// view로 활용될 폴더 경로를 설정합니다.
app.set( 'views' , '${ __dirname }/pre/' );
app.engine('html', require('ejs').renderFile);
app.set( 'view engine', 'html');

// 웹사이트의 location 의 루트경로를 설정합니다.
app.use( '/' , express.static( `${ __dirname }/pre/` ));
app.get( '/' , ( req , res ) => {
  res.render( 'index' , {}) ;
});

var server = app.listen( 8080, () => {
	console.log( 'Express listening on port : ' + server.address().port );
});