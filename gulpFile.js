var gulp = require('gulp');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var inlineSource = require('gulp-inline-source');
var filter = require('gulp-filter'); // Will phase out filter in favor of gIf
var uncss = require('gulp-uncss');
var htmlmin = require('gulp-htmlmin');
var useref = require('gulp-useref');
var inject = require('gulp-inject');
var gIf = require('gulp-if');
var swPrecache = require('sw-precache');
var path = require('path');
var run = require('run-sequence');
var fs = require('fs');

var DIST = 'dist/';

gulp.task('build', function (callback) {
    run(
        'sitemap',
        'build-assets',
        'build-views',
        'generate-service-worker-dist',
        callback
    );
});

gulp.task('build-views', function () {
    var html = filter(['**/*.html'], { restore: true });

    return gulp.src(['src/**/*.html', '!src/partials/**'])
        .pipe(inject(gulp.src(['src/partials/head.html']), createInjectOptions('head')))
        .pipe(inject(gulp.src(['src/partials/header.html']), createInjectOptions('header')))
        .pipe(inject(gulp.src(['src/partials/footer.html']), createInjectOptions('footer')))
        .pipe(inject(gulp.src(['src/partials/scripts.html']), createInjectOptions('scripts')))
        .pipe(inject(gulp.src(['src/partials/cta.html']), createInjectOptions('cta')))
        .pipe(useref({ searchPath: ['.', '../', 'src'] }))
        .pipe(inlineSource({ rootpath: 'dist' }))
        .pipe(html)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(html.restore)
        .pipe(gulp.dest(DIST));
});

gulp.task('build-assets', function () {
    var js = filter(['**/*.js'], { restore: true });
    var css = filter(['**/*.css'], { restore: true });
    var images = filter(['**/*.gif', '**/*.jpg', '**/*.svg', '**/*.png'], { restore: true });

    return gulp.src('src/**/*.*')
        .pipe(js)
        .pipe(uglify())
        .pipe(js.restore)
        .pipe(css)
        .pipe(uncss({ html: ['src/**/*.html'], ignore: ['#sidebar.menu-active>.inner.menu', '#sidebar.menu-active'] }))
        .pipe(csso())
        .pipe(css.restore)
        .pipe(images)
        .pipe(imagemin())
        .pipe(images.restore)
        .pipe(gulp.dest(DIST))
});

gulp.task('sitemap', function (done) {
    var sm = require('sitemap');

    var pages = [
        { url: '/' },
    ];

    var sitemap = sm.createSitemap({
        hostname: 'https://todo.todo',
        urls: pages
    });

    if (!fs.existsSync(DIST)) {
        fs.mkdirSync(DIST);
    }

    fs.writeFileSync(DIST + 'sitemap.xml', sitemap.toString());
    return done();
});

function createInjectOptions(tagName) {
    return {
        starttag: `<!-- inject:${tagName}:{{ext}} -->`,
        transform: function (filePath, file) {
            return file.contents.toString('utf8')
        }
    };
}

gulp.task('generate-service-worker-dist', function (callback) {
    writeServiceWorkerFile(DIST, true, callback);
});

function writeServiceWorkerFile(rootDir, handleFetch, callback) {
    var config = {
        cacheId: 'website-com-cache',
        handleFetch: handleFetch,
        runtimeCaching: [{
            // See https://github.com/GoogleChrome/sw-toolbox#methods
            urlPattern: /(images|lib)\//,
            handler: 'cacheFirst',
            // See https://github.com/GoogleChrome/sw-toolbox#options
            options: {
                cache: {
                    name: 'runtime-cache'
                }
            }
        }],
        staticFileGlobs: [
            rootDir + '/index.html',
            rootDir + '/**.css',
            rootDir + '/**.js',
        ],
        stripPrefix: rootDir,
        // verbose defaults to false, but for the purposes of this demo, log more.
        verbose: true
    };

    swPrecache.generate(config, function (err, fileString) {
        if (err) {
            return console.log('Uh Oh! Trouble writing the service worker pre cache!');
        }

        let formattedFileString = fileString.replace(/(index)?\.html"/gi, '"');

        fs.writeFileSync(path.join(rootDir, 'service-worker.js'), formattedFileString, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}
