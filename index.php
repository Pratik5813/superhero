<?php

/*
  Plugin Name: Hangman
  Description: The hangman game for WordPress
  Version: 1.0
  Author: Pratik
  Author URI: pratikpaudel458.com.np
  */

if (!defined('ABSPATH')) exit; //Exit if accessed directly

class HangMan
{
    function __construct()
    {
        add_action('init', [$this, 'admin_assets']);
    }

    function admin_assets()
    {
        wp_register_style('hangmanbackendcss', plugin_dir_url(__FILE__) . 'build/index.css');
        wp_register_script('hangmanbackend', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
        register_block_type('theplugin/hangman', array(
            'editor_script' => 'hangmanbackend',
            'editor_style' => 'hangmanbackendcss',
            'render_callback' => array($this, 'frontendFunction')
        ));
    }

    function frontendFunction($attributes)
    {
        if (!is_admin()) {
            wp_enqueue_script('hangmanFrontend', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'));
            wp_enqueue_style('hangmanFrontendcss', plugin_dir_url(__FILE__) . 'build/frontend.css');
        }

        ob_start(); ?>
        <div class="hangman-blocks-to-edit">
            <pre style="display: none;"><?php echo wp_json_encode($attributes) ?></pre>
        </div>
<?php return ob_get_clean();
    }
}
$hangMan = new HangMan();
