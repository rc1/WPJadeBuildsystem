# Jade/Less/BrowserSync/Babel Wordpress Theme Buildsystem

A buildsystem for creating a WordPress theme using [gulp](http://gulpjs.com), [jade](http://jadelang), [less](http://lesscss.org), [browsersync](https://www.browsersync.io/), [babel](https://babeljs.io/) and a few other javascript lovelies. 

This repo is not a theme.  
It's a buildsystem to make a theme.

To create a new theme from scratch, like any other new theme, first create a folder in `wp-content/themes`. Then clone this repo into your new folder as a sub folder. 

Here's a full example of what you might do:

    cd wp-content/themes
    mkdir mytheme
    cd mytheme
    git clone https://github.com/rc1/WordpressJadeBuildsystem.git src
    npm install
    gulp default watch


# Keyfiles

- __Theme Meta__ - `copy/style.css`
- __Theme Config__ - `copy/functions.php`

## Buildsystem

Here is how the `gulpfile.js` is currently setup. The idea is that no built files are stored in this repo (and are therefore will not be under source control).

### Copy

Anything in the `./copy` folder will be copied into the parent theme folder. 

### Jade

All `.jade` files in `./jade` except for any files in `./jade/includes` will be compiled and placed into the parent theme folder. 

__To use [jadephp](https://www.npmjs.com/package/gulp-jade-php) and  output `.php` instead of `.html` files the jade filename must end in `.php.jade`__

### Less

Only one less file is compiled. That file is `./less/all.less`. From `all.less` you can include other less or css files.

### JS (all.js)

All javascript files in `./js` will be compiled into a js called `all.js`. `main.js` will be concatenated last. This folder is handy for your custom javascript.

### JS (concat.js)

All javascript files in `./js-concat` will be concatenated only into a file called `concat.js`. This folder is handy for placing your minified libraries.

## Running gulp

Gulp can be run by using:


    $ ./script-gulp.sh
    
This will pull configuration settings from `gulp-config-local.env`. Useful for having different build settings. See `gulpfile.js` for more info.



