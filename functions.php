<?php

namespace HelloElementorChild;

function enqueue_styles() {
	$theme               = wp_get_theme();
	$child_theme_version = $theme->get( 'Version' );

	wp_enqueue_style( 'hello-elementor-child-style', get_stylesheet_uri(), array( 'hello-elementor' ), $child_theme_version );

	wp_enqueue_style( 'hello-elementor-child-custom-style', get_stylesheet_directory_uri() . '/assets/css/style.css', array(), $child_theme_version );
	wp_enqueue_script( 'hello-elementor-child-custom-script', get_stylesheet_directory_uri() . '/assets/js/main.js', array(), $child_theme_version, true );
}

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_styles' );
