const gulp = require("gulp"); // Gulp
const browserSync = require("browser-sync").create(); //Local server
const pug = require("gulp-pug"); // Pug-html
const sass = require("gulp-sass"); //Sass-css
const spritesmith = require("gulp.spritesmith"); //Sprite
const rimraf = require("rimraf"); //Delete
const rename = require("gulp-rename"); //Rename
//const autoprefixer = require('gulp-autoprefixer');
//const plugin1 = require('gulp-plugin1');
//const plugin2 = require('gulp-plugin2');
// const sourcemaps = require('gulp-sourcemaps');

/* -------- Server --------- */
gulp.task("server", function () {
  browserSync.init({
    server: {
      port: 9000,
      baseDir: "build",
    },
  });

  gulp.watch("build/**/*").on("change", browserSync.reload);
});

/* -------- Pug compile --------- */
gulp.task("templates:compile", function buildHTML() {
  return gulp
    .src("source/template/index.pug")
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(gulp.dest("build"));
});

/* -------- Styles compile --------- */
gulp.task("styles:compile", function () {
  return gulp
    .src("source/styles/main.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest("build/css"));
});

/* -------- Sprite --------- */
gulp.task("sprite", function (cb) {
  const spriteData = gulp.src("source/images/icons/*.png").pipe(
    spritesmith({
      imgName: "sprite.png",
      imgPath: "../images/sprite.png",
      cssName: "sprite.scss",
    })
  );

  spriteData.img.pipe(gulp.dest("build/images/"));
  spriteData.img.pipe(gulp.dest("source/styles/global/"));
  cb();
});

/* -------- Delete --------- */
gulp.task("clean", function del(cb) {
  return rimraf("build", cb);
});

/* -------- Copy fonts --------- */
gulp.task("copy:fonts", function () {
  return gulp.src("./source/fonts/**/*.*").pipe(gulp.dest("build/fonts"));
});

/* -------- Copy images --------- */
gulp.task("copy:images", function () {
  return gulp.src("./source/images/**/*.*").pipe(gulp.dest("build/images"));
});

/* -------- Copy --------- */
gulp.task("copy", gulp.parallel("copy:fonts", "copy:images"));

/* -------- Watchers --------- */
gulp.task("watch", function () {
  gulp.watch("source/template/**/*.pug", gulp.series("templates:compile"));
  gulp.watch("source/styles/**/*.scss", gulp.series("styles:compile"));
  gulp.watch("source/styles/*.scss", gulp.series("styles:compile"));
});

/* -------- Auto prefixer --------- */
//exports.default = () => (
//   gulp.src('source/styles/main.scss')
//      .pipe(autoprefixer({
//          cascade: false
//       }))
//        .pipe(gulp.dest('dist'))
//);

// /* -------- Sourcemap --------- */
//gulp.task('javascript', function() {
//gulp.src('src/**/*.js')
// .pipe(sourcemaps.init())
//  .pipe(plugin1())
//   .pipe(plugin2())
//  .pipe(sourcemaps.write())
//  .pipe(gulp.dest('dist'));
// });

/* -------- Default --------- */
gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("templates:compile", "styles:compile", "sprite", "copy"),
    gulp.parallel("watch", "server")
  )
);
