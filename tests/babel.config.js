/**
 * @file babel.config.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Babel configuration for Jest test transforms.
 */

export default {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
    ]
};
