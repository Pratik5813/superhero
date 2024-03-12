<?php

/*
  Plugin Name: Superhero
  Description: 
  Version: 1.0
  Author: Pratik
  Author URI: pratikpaudel458.com.np
  */

if (!defined('ABSPATH')) exit; //Exit if accessed directly

class Superhero
{
    function __construct()
    {
        add_action('init', [$this, 'admin_assets']);
    }

    function admin_assets()
    {
        // Register and enqueue  plugin's CSS and JavaScript
        wp_register_style('superherobackendcss', plugin_dir_url(__FILE__) . 'build/index.css');
        wp_register_script('superherobackend', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
        register_block_type('theplugin/superhero', array(
            'editor_script' => 'superherobackend',
            'editor_style' => 'superherobackendcss',
            'render_callback' => array($this, 'frontendFunction')
        ));
    }

    function frontendFunction($attributes)
    {
        if (!is_admin()) {

            // Enqueue Bootstrap CSS and JavaScript only on the frontend
            wp_enqueue_style('bootstrap', 'https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css');
            wp_enqueue_script('bootstrap', 'https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/js/bootstrap.min.js', array('jquery'));

            wp_enqueue_script('superheroFrontend', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'));
            wp_enqueue_style('superheroFrontendcss', plugin_dir_url(__FILE__) . 'build/frontend.css');
        }

        ob_start(); ?>
        <div class="superhero-blocks-to-edit">
            <pre style="display: none;"><?php echo wp_json_encode($attributes) ?></pre>
        </div>
<?php return ob_get_clean();
    }
}
$superhero = new Superhero();
