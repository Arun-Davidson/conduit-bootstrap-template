// Import modules
import gulp from 'gulp';
import template from 'gulp-template';
import server from 'gulp-server-livereload';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import minifyCss from 'gulp-minify-css'; // Consider updating this to gulp-clean-css
import fs from 'fs';
import gutil from 'gulp-util';

// Initialize gulp-sass with the Dart Sass compiler
const sassCompiler = gulpSass(sass);

// Styles task: Compiles SCSS to CSS, minifies it, and outputs to the app/css directory
function styles() {
  return gulp.src('./scss/style.scss')
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(minifyCss({compatibility: 'ie9'}))
    .pipe(gulp.dest('./app/css/'));
}

// Templates task: Compiles HTML from templates
function templates() {
  const templates = {};
  const files = fs.readdirSync('./pages/partials').filter(file => file.charAt(0) === '_');
  files.forEach(template => {
    const slug = template.replace('_', '').replace('.html', '');
    templates[slug] = fs.readFileSync(`./pages/partials/${template}`, "utf8");
  });

  return gulp.src(['./pages/*.html'])
    .pipe(template(templates))
    .on('error', gutil.log)
    .pipe(gulp.dest('./app'));
}

// Watch task: Watches for changes in SCSS and HTML files
function watchFiles() {
  gulp.watch('./scss/*.scss', styles);
  gulp.watch('pages/**/*.html', templates);
}

// Server task: Starts a live-reload server
function serve() {
  return gulp.src('./app')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true
    }));
}

// Default task: Runs styles and templates tasks in parallel, then watches files and serves the app
const defaultTasks = gulp.series(
  gulp.parallel(styles, templates),
  gulp.parallel(watchFiles, serve)
);

gulp.task('default', defaultTasks);
