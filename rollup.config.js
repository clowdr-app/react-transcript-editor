import postcss from "rollup-plugin-postcss";
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import analyze from 'rollup-plugin-analyzer'
import { terser } from "rollup-plugin-terser";

export default [
    {
        input: "./packages/components/transcript-editor/index.js",
        output: {
            file: "output/TranscriptEditor.js",
            format: "es",
            plugins: [
                getBabelOutputPlugin({presets: ["@babel/preset-env"]}),
                terser()
            ]
        },
        external: ["react", "react-dom"],
        plugins: [
            postcss({
                modules: true
            }),
            babel({presets: ["@babel/preset-react"]}),
            nodeResolve(),
            commonjs(),
            // analyze({summaryOnly: true})
        ]
    }
]