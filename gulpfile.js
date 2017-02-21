var gulp = require("gulp");
var gutil = require("gulp-util");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var less = require("gulp-less");
var fs = require("fs");
var fsExtra = require("fs-extra");
var reactify = require("reactify");
var babelify = require("babelify");

var distPaths = {
    baseDir: "./dist",
    srcDir: "./dist/js/",
    styleDir: "./dist/css/",
    imgDir: "./dist/img/"
};

var srcPaths = {
    baseDir: "./app/",
    srcDir: "./app/js/",
    styleDir: "./app/less/",
    othersDir: "./app/others/",
    htmlDir: "./app/html/",
    imgDir: "./app/img/"
};

gulp.task("clean",function(){
    fsExtra.ensureDir(distPaths.baseDir,function(err){
        fsExtra.removeSync(distPaths.baseDir);
    });
});

gulp.task('less', function(){
    gulp.src(srcPaths.styleDir + "style.less")                              
        .pipe(less())                                                   
        .pipe(gulp.dest(distPaths.styleDir))                                   
});

gulp.task('js', function() {
    return browserify({                                                 
        extensions: ['.js', '.jsx'],                                    
        entries: srcPaths.srcDir + "index.jsx",
        transform: [babelify.configure({presets: ["es2015","react"]})]
    })
    .bundle()                                                           
    .on("error",function(err){console.log("Error : " + err.message);})  
    .pipe(source("bundle.js"))                               
    .pipe(gulp.dest(distPaths.srcDir));                              
});

gulp.task('others', function(){
    var listOtherFiles = fs.readdirSync(srcPaths.othersDir);
    for(var i in listOtherFiles){
        var file = srcPaths.othersDir + listOtherFiles[i];
        browserify({                                                 
            extensions: ['.js'],                                    
            entries: file,
            transform: [babelify.configure({presets: ["es2015"]})]
        })
        .bundle()                                                           
        .on("error",function(err){console.log("Error : " + err.message);})  
        .pipe(source(listOtherFiles[i]))                               
        .pipe(gulp.dest(distPaths.srcDir));
    }
});


gulp.task("html",function(){
    gulp.src(srcPaths.htmlDir + "/*")
        .pipe(gulp.dest(distPaths.baseDir))
});

gulp.task("img", function(){
    gulp.src(srcPaths.imgDir + "/*")
        .pipe(gulp.dest(distPaths.imgDir))
});

gulp.task("default", ['clean','js','others','less','html','img'], ()=>{});
