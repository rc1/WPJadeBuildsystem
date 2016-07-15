<?php

// Remove the customise link
// -------------------------
add_action( 'wp_before_admin_bar_render', 'wpse200296_before_admin_bar_render' ); 

function wpse200296_before_admin_bar_render()
{
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu( 'customize' );
}

// Custom post type
// ----------------

// add_action( 'init', 'create_post_type' );
//
// function create_post_type() {
//     register_post_type( 'acme_product',
//         array( 
//             'labels' => array(
//                 'name' => __( 'Products' ),
//                 'singular_name' => __( 'Product' ) ),
//             'public' => true,
//             'has_archive' => true,
//         ));
// }



