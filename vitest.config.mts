import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const unitDirectory = fileURLToPath(new URL("./tests/unit", import.meta.url));
  const hasUnitFiles =
    existsSync(unitDirectory) &&
    readdirSync(unitDirectory, { recursive: true }).some((file) =>
      String(file).endsWith(".test.ts"),
    );
  const measureCoverage = mode === "coverage";
  if (measureCoverage && !hasUnitFiles) {
    console.info(
      "Coverage: not applicable yet — no unit tests. No percentage report generated.",
    );
  }
  return {
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    test: {
      environment: "node",
      include: ["tests/unit/**/*.test.ts"],
      exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
      // Temporary foundation allowance: remove with the first meaningful unit subject.
      passWithNoTests: true,
      allowOnly: !process.env.CI,
      maxWorkers: 2,
      testTimeout: 5_000,
      hookTimeout: 10_000,
      restoreMocks: true,
      unstubEnvs: true,
      unstubGlobals: true,
      coverage: {
        enabled: measureCoverage && hasUnitFiles,
        provider: "v8",
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["**/*.d.ts", "**/*.test.{ts,tsx}", "**/generated/**"],
        reporter: ["text", "html", "lcov"],
        reportsDirectory: "coverage",
      },
    },
  };
});
