import { defineConfig } from "vitest/config"
import path from "path"
import fs from "fs"

if (fs.existsSync(".env")) {
    const envConfig = fs.readFileSync(".env", "utf-8");
    for (const line of envConfig.split("\n")) {
        const [key, ...valueParts] = line.split("=");
        if (key && valueParts.length > 0) {
            const trimmedKey = key.trim();
            if (!process.env[trimmedKey]) {
                process.env[trimmedKey] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
            }
        }
    }
}

export default defineConfig({
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['evals/**/*.eval.ts'],
    },
})
