// Modules
// =======
//
//     gulp gulp-plumber gulp-concat gulp-if gulp-rename gulp-sourcemaps browser-sync gulp-csso gulp-less gulp-autoprefixer gulp-uglify gulp-babel babel-preset-es2015 gulp-jade git://github.com/oroce/gulp-jade-php#v2.0.0-0

// Gulp
// ----
var gulp = require( 'gulp' );
var gulpif = require( 'gulp-if' );
var concat = require( 'gulp-concat' );
var plumber = require( 'gulp-plumber' );
var sourcemaps = require( 'gulp-sourcemaps' );
var rename = require( 'gulp-rename' );
// Watch
// -----
var browserSync = require( 'browser-sync' ).create();
// Less
// ----
var csso = require( 'gulp-csso' );
var less = require( 'gulp-less' );
var autoprefixer = require( 'gulp-autoprefixer' );
// Jade
// ----
var jade = require( 'gulp-jade' );
// JadePHP
// -------
var jadePhp = require( 'gulp-jade-php' );
// JS
// --
var babel = require( 'gulp-babel' );
var uglify = require( 'gulp-uglify' );

// Config
// ======
// Options only please.
// Use a caller script set specific configurations (hostname based, dev/production etc).
// Keep this generic so it can copy/pasted to other projects/contexts.
//
// ### Example
//
// Create an file called `gulp-config-local.env` containing:
//
//     export DESTINATION="./.." \
//         USE_JADE_PRETTY=1 \
//         USE_JS_SOURCEMAPS=1 \
//         USE_JS_UGLYFY=1 \
//         USE_BROWSER_SYNC=1 \
//         BROWSER_SYNC_PORT=8080 \
//         BROWSER_SYNC_PROXY_ON_PORT=8081
//
// A file called `script-gulp.sh`
//
//     #!/bin/bash
//
//     . gulp-config-local.env
//     gulp "$@"
//
// The run: `./script-gulp.sh jade` for example

// Destination
// -----------
var DESTINATION = useIfDefined( process.env.DESTINATION ).or( './..' );

// Jade
// ----
var USE_JADE_PRETTY = !!process.env.USE_JADE_PRETTY;

// JS
// --
var USE_JS_SOURCEMAPS = !!process.env.USE_JS_SOURCEMAPS;
var USE_JS_UGLYFY = !!process.env.USE_JS_UGLYFY;

// CSS
// ---
var USE_CSS_SOURCEMAPS = !!process.env.USE_CSS_SOURCEMAPS;

// BrowserSync
// -----------
var USE_BROWSER_SYNC = !!process.env.USE_BROWSER_SYNC;
var BROWSER_SYNC_PORT = parseInt( useIfDefined( process.env.BROWSER_SYNC_PORT ).or( 8080 ), 10 );
var BROWSER_SYNC_PROXY_ON_PORT = parseInt( useIfDefined( process.env.BROWSER_SYNC_PROXY_ON_PORT ).or( 8081 ), 10 );

// Tasks
// ======

// Default
// -------
gulp.task( 'default', [ 'jade', 'jade-php', 'less', 'js', 'js-concat', 'copy' ] );

// Start
// -----
gulp.task( 'start', [ 'default', 'watch' ] );


// Jade
// ----
gulp.task( 'jade', function () {
    return gulp.src( [ 'jade/**/*.jade', '!jade/**/*.php.jade', '!jade/includes/**/*.jade' ] )
        .pipe( plumber() )
        .pipe( jade( { pretty: USE_JADE_PRETTY } ) )
        .pipe( gulp.dest( DESTINATION ) );
});

// Jade PHP
// --------
gulp.task( 'jade-php', function () {
    return gulp.src( [ 'jade/**/*.php.jade', '!jade/includes/**/*.php.jade' ] )
        .pipe( plumber( {
            errorHandler: function ( err ) {
                console.error( 'jade-php error' );
                console.error( err );
            }
        }))
        .pipe( rename( function ( path ) {
            path.basename = path.basename.replace( '.php', '' );
        }))
        .pipe( jadePhp( { pretty: USE_JADE_PRETTY, usestrip: true } ) )
        .pipe( gulp.dest( DESTINATION ) );
});

// JS Contact
// ----------
// These are JS file which only need concatinating into libs.js (i.e. mininfied libaries)
gulp.task( 'js-concat', function () {
    return gulp.src( [ 'js-concat/**/*.js' ] )
        .pipe( plumber() )
        .pipe( concat( 'concat.js' ) )
        .pipe( gulp.dest( DESTINATION + '/js' ) );
});

// JS
// --
gulp.task( 'js', function () {
    return gulp.src( [ '.js/**/*.js', './js/main.js'  ] )
        .pipe( plumber() )
        .pipe( gulpif( USE_JS_SOURCEMAPS, sourcemaps.init() ) )
        .pipe( babel( { presets: [ 'es2015' ] } ) )
        .pipe( concat( 'all.js' ) )
        .pipe( gulpif( USE_JS_UGLYFY, uglify() ) )
        .pipe( gulpif( USE_JS_SOURCEMAPS, sourcemaps.write( '.' ) ) )
        .pipe( gulp.dest( DESTINATION + '/js' ) );
});

// Less
// ----
gulp.task( 'less', function () {
    return gulp.src( 'less/all.less' )
        .pipe( plumber() )
        .pipe( gulpif( USE_CSS_SOURCEMAPS, sourcemaps.init()))
        .pipe( less() )
        .pipe( autoprefixer( { browsers: [ 'last 3 versions' ] }) )
        .pipe( csso() )
        .pipe( gulpif( USE_CSS_SOURCEMAPS, sourcemaps.write( '.' ) ) )
        .pipe( gulp.dest( DESTINATION + '/css' ) )
        .pipe( browserSync.stream( {match: '**/*.css'} ) );
});

// Copy
// ----
gulp.task( 'copy', function () {
    return gulp.src( [ './copy/**' ] )
        .pipe( gulp.dest( DESTINATION ) );
});

// Watch
// -----
gulp.task('watch', function () {
    if ( USE_BROWSER_SYNC ) {
        browserSync.init({
            port: BROWSER_SYNC_PROXY_ON_PORT,
            proxy: 'localhost:' + BROWSER_SYNC_PORT,
            ui: { port: BROWSER_SYNC_PROXY_ON_PORT + 1 },
            browser: []
        });
    }
    gulp.watch( [ 'jade/**/*.jade', '!jade./**/*.php.jade' ], [ 'jade' ] )
        .on( 'change', browserSync.reload );
    gulp.watch( 'jade/**/*.php.jade', [ 'jade-php' ] )
        .on( 'change', browserSync.reload );
    gulp.watch( 'less/**/*.less', [ 'less' ] )
        .on( 'change', browserSync.reload );
    gulp.watch( 'less/**/*', [ 'copy' ] )
        .on( 'change', browserSync.reload );
});

// Utils
// =====

function useIfDefined( arg ) {
    return {
        or: function ( alternative ) {
            return arg ? arg : alternative;
        }
    };
}
