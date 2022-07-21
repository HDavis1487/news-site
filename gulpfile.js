var gulp = require("gulp"),
  jade = require("gulp-pug"),
  jadeModules = require("gulp-pug-module"),
  filter = require("gulp-filter"),
  sass = require("gulp-sass"),
  prefixer = require("gulp-autoprefixer"),
  plumber = require("gulp-plumber"),
  notify = require("gulp-notify"),
  browserSync = require("browser-sync").create();

// Paths

var src = {
  jade: "jadefiles/**.jade",
  jadeHtml: "jadefiles/index.jade",
  sass: "assets/sass/**/*.sass",
};

var output = {
  jade: "jadefiles",
  css: "css",
  html: "./",
};

// Static server
gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
});

// Jade
gulp.task("jade", function () {
  return gulp
    .src(src.jade)
    .pipe(
      jadeModules({
        paths: [src.jade],
      })
    )
    .pipe(
      jade({
        baseDir: ("./", [src.jade]),
        pretty: true,
      })
    )
    .pipe(filter(["*", "!_*"]))
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(gulp.dest(output.jade))
    .pipe(notify("Saved file: <%= file.relative %>!"))
    .pipe(browserSync.stream());
});
// // Jade
gulp.task("jadeHtml", function () {
  gulp
    .src(src.jadeHtml)
    .pipe(jade({ pretty: true }))
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(gulp.dest(output.html))
    .pipe(notify("Saved file: <%= file.relative %>!"))
    .pipe(browserSync.stream());
});

// Sass
gulp.task("sass", function () {
  return gulp
    .src(src.sass)
    .pipe(sass())
    .pipe(prefixer())
    .pipe(plumber())
    .pipe(gulp.dest(output.css))
    .pipe(notify("Saved file: <%= file.relative %>!"))
    .pipe(browserSync.stream());
});

// Watch
gulp.task("watch", function () {
  gulp.watch(src.jade, ["jade"]);
  gulp.watch(src.jadeHtml, ["jadeHtml"]);
  gulp.watch(src.sass, ["sass"]);
  // gulp.watch("./*.html").on('change', browserSync.reload);
  // gulp.watch("sass/*.sass").on('change', browserSync.reload);
  // gulp.watch("jadefiles/*.jade").on('change', browserSync.reload);
});

gulp.task("default", ["jade", "jadeHtml", "sass", "watch", "browser-sync"]);
