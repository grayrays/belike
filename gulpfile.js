const gulp = require('gulp'),
			scss = require('gulp-sass'),
			removeEmptyLines = require('gulp-remove-empty-lines'),
			nodemon = require('gulp-nodemon'),
			merge = require('merge-stream'),
			spritesmith = require('gulp.spritesmith-multi'),
			sassGlob = require('gulp-sass-glob'),
			// babel = require('gulp-babel'),
      uglify = require('gulp-uglify'),
			browserSync = require('browser-sync'),
			imagemin = require('gulp-imagemin'),
			del = require('del'),
			include = require('gulp-html-tag-include');

// 소스 파일 경로
var PATH = {
	HTML: './src',
	FONTS: './src/static/fonts',
	IMAGES: './src/static/images',
	STYLE: './src/static/css',
	SCRIPT: './src/static/js'
},
// 산출물 경로
DEST_PATH = {
	HTML: './pre',
	FONTS: './pre/static/fonts',
	IMAGES: './pre/static/images' ,
	STYLE: './pre/static/css',
	SCRIPT: './pre/static/js'
},
BAEMIN_PATH = './baemin-belike';

var scssOptions = {
	outputStyle: "compact",  //nested, expanded, compact, compressed
	indentType: "space", //space, tab
	linefeed : 'lf', //cr, crlf, lf, lfcr
	indentWidth: 0,
	precision: 5,
	sourceComments: false //코멘트 제거 여부
};

gulp.task('scss:compile', () => {
	return new Promise( resolve => {
		gulp.src([PATH.STYLE + '/*.scss',PATH.STYLE + '/*.css'])
			.pipe(scss(scssOptions).on('error', scss.logError))
			.pipe(removeEmptyLines({ removeComments: true }))
			.pipe(gulp.dest(DEST_PATH.STYLE))
			//.pipe(browserSync.reload({stream: true}));
		resolve();
	});
});

gulp.task( 'html', () => {
	return new Promise( resolve => {
		gulp.src([
			PATH.HTML + '/**/*.html',
			PATH.HTML + '/**/html',
			PATH.HTML + '/**/html/**'
		])
		.pipe( include() )
		.on('error',logError)
		.pipe(gulp.dest(DEST_PATH.HTML))
		//.pipe(browserSync.reload({stream: true}));
		resolve();
	});
});

gulp.task( 'script:build', () => {
	return new Promise( resolve => {
		gulp.src( PATH.SCRIPT + '/*.js' )
			//.pipe( concat('common.js') )
			//.pipe( gulp.dest( DEST_PATH ) )
			.pipe( uglify({ mangle: true }))
			//.pipe( rename('common.min.js') )
			/*
			.pipe( babel({
				presets: ['es2015']
			}) )
			*/
			.pipe( gulp.dest(DEST_PATH.SCRIPT) )
			//.pipe( browserSync.reload({stream: true}) );
		resolve();
	})
});

gulp.task( 'images', () => {
	return new Promise( resolve => {
		gulp.src([
			PATH.IMAGES + '/*.*',
			PATH.IMAGES + '/**'
		])
		.pipe( imagemin() )
		.pipe( gulp.dest(DEST_PATH.IMAGES) );
		resolve();
	});
});

gulp.task( 'auto-sprite', () => {
	var opts = {
		spritesmith: function (options, sprite, icons){
			options.imgPath =  `../images/sprite/${options.imgName}`;
			options.cssName = `_${sprite}-sprite.scss`;
			options.cssTemplate = null;
			options.cssSpritesheetName = sprite;
			options.padding = 10;
			options.cssVarMap =  function(sp) {
				sp.name = `${sprite}-${sp.name}`;
			};
			return options;
		}
	};
	var spriteData = gulp.src('./src/static/img-sprite/**/*.*')
			.pipe(spritesmith(opts))
			.on('error', function (err) {
				console.log(err)
			});

	var imgStream = spriteData.img.pipe(gulp.dest('./pre/static/images/sprite'));
	var cssStream = spriteData.css.pipe(gulp.dest('./src/static/css/vendors'));

	return merge(imgStream, cssStream);
});

//sprite-sass
gulp.task('scss-sprite', function() {
	return gulp.src(['./src/static/css/**/*.scss'])
		// use glob imports
    .pipe(sassGlob())
		// SASS
		.pipe(scss(scssOptions).on('error', scss.logError))
		// css 배포
		.pipe(gulp.dest('./pre/static/css'));
});

gulp.task( 'fonts', () => {
	return new Promise( resolve => {
		gulp.src(PATH.FONTS + '/*.*')
			.pipe( gulp.dest(DEST_PATH.FONTS) );
			resolve();
	});
});

gulp.task( 'nodemon:start', () => {
	return new Promise( resolve => {
		nodemon({
			script: 'app.js',
			watch: 'app'
		});
		resolve();
	});
});

gulp.task('clean', function(){
	return del(DEST_PATH.HTML);
});

gulp.task('watch', () => {
	return new Promise( resolve => {
		gulp.watch([ PATH.STYLE + "/**/*.css", PATH.STYLE + "/**/*.scss" ], gulp.series(['scss:compile']));
		//gulp.watch(PATH.SCRIPT + "/**/*.js", gulp.series(['script:concat']));
		gulp.watch( PATH.SCRIPT + "/**/*.js", gulp.series(['script:build']));
		gulp.watch([ PATH.IMAGES + "/**", PATH.IMAGES + "/**/*.*" ], gulp.series(['images']));
		gulp.watch([ PATH.HTML + "/static/img-sprite" ], gulp.series(['auto-sprite']));
		gulp.watch([PATH.HTML + "/**"], gulp.series(['html']));
		resolve();
	});
});

gulp.task('browserSync', () => {
	return new Promise( resolve => {
		browserSync.init( null, {
			proxy: 'http://localhost:8080',
			port: 8081,
			ghostMode : false
		});

		resolve();
	});
});

gulp.task('build:clean', function(){
	return del(BAEMIN_PATH);
});
gulp.task('build:copy', () => {
	return new Promise( resolve => {
		gulp.src([
			DEST_PATH.HTML + '/**/index.html',
			DEST_PATH.HTML + '/**/html/*.*',
			DEST_PATH.HTML + '/**/html/**',
			DEST_PATH.HTML + '/**/static/**'
		])
		.pipe( gulp.dest([BAEMIN_PATH]) )
		resolve();
	});
});
function logError (error) {
	console.log(error)
}
var allSeries =  gulp.series([
	'html',
	'auto-sprite',
	'scss-sprite',
	'scss:compile',
	'script:build',
	'fonts',
	'images',
	'nodemon:start',
	'watch'
]);

var allSeries2 =  gulp.series([
	'build:clean',
	'build:copy'
]);

gulp.task('start', allSeries);
gulp.task('build', allSeries2);

