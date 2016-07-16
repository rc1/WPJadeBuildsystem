<?php

// Add a Navigation Menu
// =====================
// This can be set using the theme customize feature
function register_my_menus() {
    register_nav_menus(
        array( 'header-menu' => __( 'Header Menu' ) )
    );
}

add_action( 'init', 'register_my_menus' );

// Let wordpress set the page Title
// ================================

function add_title_tag_support () {
   add_theme_support( 'title-tag' );
}

add_action( 'after_setup_theme', 'add_title_tag_support' );

// Allow BrowserSync
// =================
// Prevent port redirections

remove_filter( 'template_redirect', 'redirect_canonical');

// Remove the customise link
// =========================
function remove_admin_bar_links () {

    global $wp_admin_bar;

    // List them all
    // $all_toolbar_nodes = $wp_admin_bar->get_nodes();
    // foreach ( $all_toolbar_nodes as $node ) {
    //    print_r( $node );
    // }

    $wp_admin_bar->remove_menu( 'wp-logo' );
    $wp_admin_bar->remove_menu( 'updates' );
    // $wp_admin_bar->remove_menu( 'customize' );
    $wp_admin_bar->remove_menu( 'site-name' );
}

add_action( 'wp_before_admin_bar_render', 'remove_admin_bar_links' );

// Custom Fields WYSIWYG Toolbars
// ==============================
// See: https://www.advancedcustomfields.com/resources/customize-the-wysiwyg-toolbars/

add_filter( 'acf/fields/wysiwyg/toolbars' , 'my_toolbars'  );

function my_toolbars ( $toolbars ) {
    // Options:
    //    'bold', 'italic', 'strikethrough', 'bullist', 'numlist',
    //    'blockquote', 'hr', 'alignleft', 'aligncenter', 'alignright',
    //    'link', 'unlink', 'wp_more', 'spellchecker', 'fullscreen',
    //    'wp_adv', 'formatselect', 'underline', 'alignjustify',
    //    'forecolor', 'pastetext', 'removeformat', 'charmap',
    //    'outdent', 'indent', 'undo', 'redo', wp_help

    // Add a new toolbar type
    $toolbars[ 'Example Toolbar A' ] = array();
    $toolbars[ 'Example Toolbar A' ][1] = array( 'link' , 'italic' , 'spellchecker', 'fullscreen', 'removeformat' );

    return $toolbars;
}

// Utils
// =====

// String
// ------

// ### Starts With
function w_starts_with ( $str, $test ) {
     return 0 === strpos( $str, $test );
}
