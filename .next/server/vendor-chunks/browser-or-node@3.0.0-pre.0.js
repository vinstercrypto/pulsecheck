"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/browser-or-node@3.0.0-pre.0";
exports.ids = ["vendor-chunks/browser-or-node@3.0.0-pre.0"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/browser-or-node@3.0.0-pre.0/node_modules/browser-or-node/dist/index.mjs":
/*!****************************************************************************************************!*\
  !*** ./node_modules/.pnpm/browser-or-node@3.0.0-pre.0/node_modules/browser-or-node/dist/index.mjs ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   isBrowser: () => (/* binding */ isBrowser),\n/* harmony export */   isDeno: () => (/* binding */ isDeno),\n/* harmony export */   isJsDom: () => (/* binding */ isJsDom),\n/* harmony export */   isNode: () => (/* binding */ isNode),\n/* harmony export */   isWebWorker: () => (/* binding */ isWebWorker)\n/* harmony export */ });\n// src/index.ts\nvar isBrowser = typeof window !== \"undefined\" && typeof window.document !== \"undefined\";\nvar isNode = (\n  // @ts-expect-error\n  typeof process !== \"undefined\" && // @ts-expect-error\n  process.versions != null && // @ts-expect-error\n  process.versions.node != null\n);\nvar isWebWorker = typeof self === \"object\" && self.constructor && self.constructor.name === \"DedicatedWorkerGlobalScope\";\nvar isJsDom = typeof window !== \"undefined\" && window.name === \"nodejs\" || typeof navigator !== \"undefined\" && \"userAgent\" in navigator && typeof navigator.userAgent === \"string\" && (navigator.userAgent.includes(\"Node.js\") || navigator.userAgent.includes(\"jsdom\"));\nvar isDeno = (\n  // @ts-expect-error\n  typeof Deno !== \"undefined\" && // @ts-expect-error\n  typeof Deno.version !== \"undefined\" && // @ts-expect-error\n  typeof Deno.version.deno !== \"undefined\"\n);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vYnJvd3Nlci1vci1ub2RlQDMuMC4wLXByZS4wL25vZGVfbW9kdWxlcy9icm93c2VyLW9yLW5vZGUvZGlzdC9pbmRleC5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9FIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcHVsc2VjaGVjay8uL25vZGVfbW9kdWxlcy8ucG5wbS9icm93c2VyLW9yLW5vZGVAMy4wLjAtcHJlLjAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItb3Itbm9kZS9kaXN0L2luZGV4Lm1qcz81YmJkIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9pbmRleC50c1xudmFyIGlzQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHdpbmRvdy5kb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIjtcbnZhciBpc05vZGUgPSAoXG4gIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgdHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCIgJiYgLy8gQHRzLWV4cGVjdC1lcnJvclxuICBwcm9jZXNzLnZlcnNpb25zICE9IG51bGwgJiYgLy8gQHRzLWV4cGVjdC1lcnJvclxuICBwcm9jZXNzLnZlcnNpb25zLm5vZGUgIT0gbnVsbFxuKTtcbnZhciBpc1dlYldvcmtlciA9IHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiICYmIHNlbGYuY29uc3RydWN0b3IgJiYgc2VsZi5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIkRlZGljYXRlZFdvcmtlckdsb2JhbFNjb3BlXCI7XG52YXIgaXNKc0RvbSA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93Lm5hbWUgPT09IFwibm9kZWpzXCIgfHwgdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBcInVzZXJBZ2VudFwiIGluIG5hdmlnYXRvciAmJiB0eXBlb2YgbmF2aWdhdG9yLnVzZXJBZ2VudCA9PT0gXCJzdHJpbmdcIiAmJiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcyhcIk5vZGUuanNcIikgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcyhcImpzZG9tXCIpKTtcbnZhciBpc0Rlbm8gPSAoXG4gIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgdHlwZW9mIERlbm8gIT09IFwidW5kZWZpbmVkXCIgJiYgLy8gQHRzLWV4cGVjdC1lcnJvclxuICB0eXBlb2YgRGVuby52ZXJzaW9uICE9PSBcInVuZGVmaW5lZFwiICYmIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgdHlwZW9mIERlbm8udmVyc2lvbi5kZW5vICE9PSBcInVuZGVmaW5lZFwiXG4pO1xuZXhwb3J0IHtcbiAgaXNCcm93c2VyLFxuICBpc0Rlbm8sXG4gIGlzSnNEb20sXG4gIGlzTm9kZSxcbiAgaXNXZWJXb3JrZXJcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/browser-or-node@3.0.0-pre.0/node_modules/browser-or-node/dist/index.mjs\n");

/***/ })

};
;