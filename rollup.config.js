import postcss from "rollup-plugin-postcss";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import analyze from 'rollup-plugin-analyzer'
import { terser } from "rollup-plugin-terser";
import esbuild from "rollup-plugin-esbuild";

export default [
    {
        input: "./packages/components/transcript-editor/index.js",
        output: {
            file: "output/TranscriptEditor.js",
            format: "es",
            plugins: [
                terser()
            ]
        },
        external: ["react", "react-dom"],
        plugins: [
            postcss({
                modules: true
            }),
            esbuild({
                loaders: {
                    ".js": "jsx",
                }
            }),
            nodeResolve(),
            commonjs(),
            // analyze({summaryOnly: true})
        ]
    }
]