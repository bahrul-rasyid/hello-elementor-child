'use strict';

const pkg = require('./package.json');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const esbuild = require('gulp-esbuild');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const zip = require('gulp-zip').default;

// Paths configuration
const paths = {
  scss: {
    src: 'src/scss/**/*.scss',
    dest: 'assets/css',
  },
  js: {
    src: 'src/ts/**/*.{ts,js}',
    dest: 'assets/js',
  },
};

// BrowserSync task
function browserSyncServe(done) {
  browserSync.init({
    proxy: 'localhost', // Use dedicated port for development
    port: 3000,
    open: false,
    notify: false,
    ghostMode: {
      clicks: true,
      scroll: true,
      forms: true,
    },
  });

  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browserSync.reload();
  done();
}

// SCSS compilation task (development - no autoprefixer)
function compileSCSS() {
  return gulp
    .src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
        precision: 6,
      }).on('error', sass.logError)
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// SCSS compilation task (production - with autoprefixer, no source maps)
function buildSCSS() {
  return gulp
    .src(paths.scss.src)
    .pipe(
      sass({
        outputStyle: 'expanded',
        precision: 6,
        sourceMap: false,
      }).on('error', sass.logError)
    )
    .pipe(
      postcss([
        autoprefixer({
          overrideBrowserslist: ['last 2 versions', '> 1%', 'ie >= 11'],
          grid: true,
        }),
      ])
    )
    .pipe(
      rename(path => {
        path.basename += '.build';
      })
    )
    .pipe(gulp.dest(paths.scss.dest));
}

// TypeScript/JavaScript compilation task (development - with source maps)
function compileJS() {
  return gulp
    .src('src/ts/main.ts')
    .pipe(
      esbuild({
        sourcemap: true,
        format: 'iife',
        target: 'es2020',
        bundle: true,
        outdir: '.',
        outExtension: { '.js': '.js' },
        loader: {
          '.ts': 'ts',
          '.js': 'js',
        },
      })
    )
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// TypeScript/JavaScript compilation task (production - minified, no source maps)
function buildJS() {
  return gulp
    .src('src/ts/main.ts')
    .pipe(
      esbuild({
        sourcemap: false,
        format: 'iife',
        target: 'es2020',
        bundle: true,
        minify: true,
        outdir: '.',
        outExtension: { '.js': '.js' },
        loader: {
          '.ts': 'ts',
          '.js': 'js',
        },
      })
    )
    .pipe(
      rename(path => {
        path.basename += '.min';
      })
    )
    .pipe(gulp.dest(paths.js.dest));
}

// Alternative BrowserSync task for static files (if not using proxy)
function serveStatic() {
  browserSync.init({
    server: {
      baseDir: './', // Serve from current directory
    },
    port: 3000,
    open: false,
    notify: false,
  });
}

// Watch task
function watchFiles() {
  gulp.watch(paths.scss.src, compileSCSS);
  gulp.watch('src/ts/**/*.{ts,js}', compileJS); // Watch all TS files but compile main.ts
  gulp.watch('**/*.php', browserSyncReload); // Watch PHP files for changes
}

// Create deployment zip
function createZip() {
  const zipName = `${pkg.name}-${pkg.version}.zip`;
  return gulp
    .src(['*.php', 'style.css', 'assets/**'], { base: "../" })
    .pipe(zip(zipName))
    .pipe(gulp.dest('./build'));
}

// Public tasks
exports.scss = compileSCSS;
exports.js = compileJS;
exports.watch = gulp.series(gulp.parallel(compileSCSS, compileJS), watchFiles);
exports.build = gulp.parallel(buildSCSS, buildJS);
exports.dev = gulp.series(
  browserSyncServe,
  gulp.parallel(compileSCSS, compileJS),
  watchFiles
);

// Deployment task
exports.deploy = gulp.series(gulp.parallel(buildSCSS, buildJS), createZip);

exports.default = gulp.series(
  browserSyncServe,
  gulp.parallel(compileSCSS, compileJS),
  watchFiles
);
