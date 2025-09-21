<?php

namespace HelloElementorChild;

function enqueue_styles() {
	wp_enqueue_style( 'hello-elementor-child-style', get_stylesheet_uri(), array( 'hello-elementor' ), '1.0.0' );
}

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_styles' );
