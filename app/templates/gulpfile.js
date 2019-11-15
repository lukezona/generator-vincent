const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssvariables = require('postcss-css-variables'); 
const calc = require('postcss-calc');  
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

// js file paths
const utilJsPath = 'public/js'; // util.js path
const componentsJsPath = 'public/js/codyhouse-components/*.js'; // component js files
const scriptsJsPath = 'public/js'; //folder for final scripts.js/scripts.min.js files

// css file paths
const cssFolder = 'public/styles'; // folder for final style.css/style-custom-prop-fallbac.css files
const scssFilesPath = 'public/styles/**/*.scss'; // scss files to watch

gulp.task('copy', function () {
	return gulp.src('./node_modules/codyhouse-framework/main/assets/js/util.js')
		.pipe(gulp.dest('./public/js'));
});

gulp.task('sass', function() {
  return gulp.src(scssFilesPath)
  .pipe(sassGlob())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest(cssFolder))
  .pipe(rename('style-fallback.css'))
  .pipe(postcss([cssvariables(), calc()]))
  .pipe(gulp.dest(cssFolder));
});

gulp.task('scripts', function() {
  return gulp.src([utilJsPath+'/util.js', componentsJsPath])
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest(scriptsJsPath))
  .pipe(rename('scripts.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(scriptsJsPath));
});

gulp.task('prestart', gulp.series(['copy', 'sass', 'scripts'], function () {
  gulp.watch('public/styles/*.scss', gulp.series(['sass']));
  gulp.watch(componentsJsPath, gulp.series(['scripts']));
}));
