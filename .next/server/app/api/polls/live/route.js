"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/polls/live/route";
exports.ids = ["app/api/polls/live/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@14.2.3_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpolls%2Flive%2Froute&page=%2Fapi%2Fpolls%2Flive%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpolls%2Flive%2Froute.ts&appDir=E%3A%5CpulsecheckApp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5CpulsecheckApp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@14.2.3_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpolls%2Flive%2Froute&page=%2Fapi%2Fpolls%2Flive%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpolls%2Flive%2Froute.ts&appDir=E%3A%5CpulsecheckApp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5CpulsecheckApp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@14.2.3_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/.pnpm/next@14.2.3_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@14.2.3_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var E_pulsecheckApp_app_api_polls_live_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/polls/live/route.ts */ \"(rsc)/./app/api/polls/live/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/polls/live/route\",\n        pathname: \"/api/polls/live\",\n        filename: \"route\",\n        bundlePath: \"app/api/polls/live/route\"\n    },\n    resolvedPagePath: \"E:\\\\pulsecheckApp\\\\app\\\\api\\\\polls\\\\live\\\\route.ts\",\n    nextConfigOutput,\n    userland: E_pulsecheckApp_app_api_polls_live_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/polls/live/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNC4yLjNfcmVhY3QtZG9tQDE4LjMuMV9yZWFjdEAxOC4zLjFfX3JlYWN0QDE4LjMuMS9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZwb2xscyUyRmxpdmUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnBvbGxzJTJGbGl2ZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnBvbGxzJTJGbGl2ZSUyRnJvdXRlLnRzJmFwcERpcj1FJTNBJTVDcHVsc2VjaGVja0FwcCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RSUzQSU1Q3B1bHNlY2hlY2tBcHAmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdWxzZWNoZWNrLz8zNDU5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkU6XFxcXHB1bHNlY2hlY2tBcHBcXFxcYXBwXFxcXGFwaVxcXFxwb2xsc1xcXFxsaXZlXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9wb2xscy9saXZlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcG9sbHMvbGl2ZVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcG9sbHMvbGl2ZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkU6XFxcXHB1bHNlY2hlY2tBcHBcXFxcYXBwXFxcXGFwaVxcXFxwb2xsc1xcXFxsaXZlXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9wb2xscy9saXZlL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@14.2.3_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpolls%2Flive%2Froute&page=%2Fapi%2Fpolls%2Flive%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpolls%2Flive%2Froute.ts&appDir=E%3A%5CpulsecheckApp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5CpulsecheckApp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/polls/live/route.ts":
/*!*************************************!*\
  !*** ./app/api/polls/live/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@14.2.3_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/api/server.js\");\n\n\nasync function GET() {\n    const now = new Date().toISOString();\n    // Find a poll that is currently live\n    const { data: livePoll, error: liveError } = await _lib_db__WEBPACK_IMPORTED_MODULE_0__.supabase.from(\"poll\").select(\"*\").eq(\"status\", \"live\").lte(\"start_ts\", now).gte(\"end_ts\", now).limit(1).single();\n    if (liveError && liveError.code !== \"PGRST116\") {\n        console.error(\"Error fetching live poll:\", liveError);\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            error: \"Internal Server Error\"\n        }, {\n            status: 500\n        });\n    }\n    if (livePoll) {\n        // Parse options from JSON string to array\n        const parsedPoll = {\n            ...livePoll,\n            options: typeof livePoll.options === \"string\" ? JSON.parse(livePoll.options) : livePoll.options\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            poll: parsedPoll\n        });\n    }\n    // If no live poll, find the next scheduled poll\n    const { data: scheduledPoll, error: scheduledError } = await _lib_db__WEBPACK_IMPORTED_MODULE_0__.supabase.from(\"poll\").select(\"*\").eq(\"status\", \"scheduled\").gt(\"start_ts\", now).order(\"start_ts\", {\n        ascending: true\n    }).limit(1).single();\n    if (scheduledError && scheduledError.code !== \"PGRST116\") {\n        console.error(\"Error fetching scheduled poll:\", scheduledError);\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            error: \"Internal Server Error\"\n        }, {\n            status: 500\n        });\n    }\n    if (scheduledPoll) {\n        const startsInSeconds = (new Date(scheduledPoll.start_ts).getTime() - new Date().getTime()) / 1000;\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            poll: null,\n            starts_in_seconds: startsInSeconds\n        });\n    }\n    // No live or scheduled polls found\n    return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n        poll: null\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3BvbGxzL2xpdmUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ29DO0FBQ087QUFFcEMsZUFBZUU7SUFDcEIsTUFBTUMsTUFBTSxJQUFJQyxPQUFPQyxXQUFXO0lBRWxDLHFDQUFxQztJQUNyQyxNQUFNLEVBQUVDLE1BQU1DLFFBQVEsRUFBRUMsT0FBT0MsU0FBUyxFQUFFLEdBQUcsTUFBTVQsNkNBQVFBLENBQ3hEVSxJQUFJLENBQUMsUUFDTEMsTUFBTSxDQUFDLEtBQ1BDLEVBQUUsQ0FBQyxVQUFVLFFBQ2JDLEdBQUcsQ0FBQyxZQUFZVixLQUNoQlcsR0FBRyxDQUFDLFVBQVVYLEtBQ2RZLEtBQUssQ0FBQyxHQUNOQyxNQUFNO0lBRVQsSUFBSVAsYUFBYUEsVUFBVVEsSUFBSSxLQUFLLFlBQVk7UUFDOUNDLFFBQVFWLEtBQUssQ0FBQyw2QkFBNkJDO1FBQzNDLE9BQU9SLHFEQUFZQSxDQUFDa0IsSUFBSSxDQUFDO1lBQUVYLE9BQU87UUFBd0IsR0FBRztZQUFFWSxRQUFRO1FBQUk7SUFDN0U7SUFFQSxJQUFJYixVQUFVO1FBQ2QsMENBQTBDO1FBQzFDLE1BQU1jLGFBQWE7WUFDakIsR0FBR2QsUUFBUTtZQUNYZSxTQUFTLE9BQU9mLFNBQVNlLE9BQU8sS0FBSyxXQUNqQ0MsS0FBS0MsS0FBSyxDQUFDakIsU0FBU2UsT0FBTyxJQUMzQmYsU0FBU2UsT0FBTztRQUN0QjtRQUNBLE9BQU9yQixxREFBWUEsQ0FBQ2tCLElBQUksQ0FBQztZQUFFTSxNQUFNSjtRQUFXO0lBQzlDO0lBRUUsZ0RBQWdEO0lBQ2hELE1BQU0sRUFBRWYsTUFBTW9CLGFBQWEsRUFBRWxCLE9BQU9tQixjQUFjLEVBQUUsR0FBRyxNQUFNM0IsNkNBQVFBLENBQ2xFVSxJQUFJLENBQUMsUUFDTEMsTUFBTSxDQUFDLEtBQ1BDLEVBQUUsQ0FBQyxVQUFVLGFBQ2JnQixFQUFFLENBQUMsWUFBWXpCLEtBQ2YwQixLQUFLLENBQUMsWUFBWTtRQUFFQyxXQUFXO0lBQUssR0FDcENmLEtBQUssQ0FBQyxHQUNOQyxNQUFNO0lBRVQsSUFBSVcsa0JBQWtCQSxlQUFlVixJQUFJLEtBQUssWUFBWTtRQUN4REMsUUFBUVYsS0FBSyxDQUFDLGtDQUFrQ21CO1FBQ2hELE9BQU8xQixxREFBWUEsQ0FBQ2tCLElBQUksQ0FBQztZQUFFWCxPQUFPO1FBQXdCLEdBQUc7WUFBRVksUUFBUTtRQUFJO0lBQzdFO0lBRUEsSUFBSU0sZUFBZTtRQUNuQixNQUFNSyxrQkFBa0IsQ0FBQyxJQUFJM0IsS0FBS3NCLGNBQWNNLFFBQVEsRUFBRUMsT0FBTyxLQUFLLElBQUk3QixPQUFPNkIsT0FBTyxFQUFDLElBQUs7UUFDOUYsT0FBT2hDLHFEQUFZQSxDQUFDa0IsSUFBSSxDQUFDO1lBQUVNLE1BQU07WUFBTVMsbUJBQW1CSDtRQUFnQjtJQUM1RTtJQUVFLG1DQUFtQztJQUNuQyxPQUFPOUIscURBQVlBLENBQUNrQixJQUFJLENBQUM7UUFBRU0sTUFBTTtJQUFLO0FBQ3hDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcHVsc2VjaGVjay8uL2FwcC9hcGkvcG9sbHMvbGl2ZS9yb3V0ZS50cz8wZDAyIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgc3VwYWJhc2UgfSBmcm9tICdAL2xpYi9kYic7XG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcblxuICAvLyBGaW5kIGEgcG9sbCB0aGF0IGlzIGN1cnJlbnRseSBsaXZlXG4gIGNvbnN0IHsgZGF0YTogbGl2ZVBvbGwsIGVycm9yOiBsaXZlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgLmZyb20oJ3BvbGwnKVxuICAgIC5zZWxlY3QoJyonKVxuICAgIC5lcSgnc3RhdHVzJywgJ2xpdmUnKVxuICAgIC5sdGUoJ3N0YXJ0X3RzJywgbm93KVxuICAgIC5ndGUoJ2VuZF90cycsIG5vdylcbiAgICAubGltaXQoMSlcbiAgICAuc2luZ2xlKCk7XG5cbiAgaWYgKGxpdmVFcnJvciAmJiBsaXZlRXJyb3IuY29kZSAhPT0gJ1BHUlNUMTE2JykgeyAvLyBQR1JTVDExNiBpcyBcIk5vIHJvd3MgZm91bmRcIlxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIGxpdmUgcG9sbDonLCBsaXZlRXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG5cbiAgaWYgKGxpdmVQb2xsKSB7XG4gIC8vIFBhcnNlIG9wdGlvbnMgZnJvbSBKU09OIHN0cmluZyB0byBhcnJheVxuICBjb25zdCBwYXJzZWRQb2xsID0ge1xuICAgIC4uLmxpdmVQb2xsLFxuICAgIG9wdGlvbnM6IHR5cGVvZiBsaXZlUG9sbC5vcHRpb25zID09PSAnc3RyaW5nJyBcbiAgICAgID8gSlNPTi5wYXJzZShsaXZlUG9sbC5vcHRpb25zKSBcbiAgICAgIDogbGl2ZVBvbGwub3B0aW9uc1xuICB9O1xuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBwb2xsOiBwYXJzZWRQb2xsIH0pO1xufVxuXG4gIC8vIElmIG5vIGxpdmUgcG9sbCwgZmluZCB0aGUgbmV4dCBzY2hlZHVsZWQgcG9sbFxuICBjb25zdCB7IGRhdGE6IHNjaGVkdWxlZFBvbGwsIGVycm9yOiBzY2hlZHVsZWRFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAuZnJvbSgncG9sbCcpXG4gICAgLnNlbGVjdCgnKicpXG4gICAgLmVxKCdzdGF0dXMnLCAnc2NoZWR1bGVkJylcbiAgICAuZ3QoJ3N0YXJ0X3RzJywgbm93KVxuICAgIC5vcmRlcignc3RhcnRfdHMnLCB7IGFzY2VuZGluZzogdHJ1ZSB9KVxuICAgIC5saW1pdCgxKVxuICAgIC5zaW5nbGUoKTtcblxuICBpZiAoc2NoZWR1bGVkRXJyb3IgJiYgc2NoZWR1bGVkRXJyb3IuY29kZSAhPT0gJ1BHUlNUMTE2Jykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIHNjaGVkdWxlZCBwb2xsOicsIHNjaGVkdWxlZEVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0ludGVybmFsIFNlcnZlciBFcnJvcicgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxuXG4gIGlmIChzY2hlZHVsZWRQb2xsKSB7XG4gIGNvbnN0IHN0YXJ0c0luU2Vjb25kcyA9IChuZXcgRGF0ZShzY2hlZHVsZWRQb2xsLnN0YXJ0X3RzKS5nZXRUaW1lKCkgLSBuZXcgRGF0ZSgpLmdldFRpbWUoKSkgLyAxMDAwO1xuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBwb2xsOiBudWxsLCBzdGFydHNfaW5fc2Vjb25kczogc3RhcnRzSW5TZWNvbmRzIH0pO1xufVxuICBcbiAgLy8gTm8gbGl2ZSBvciBzY2hlZHVsZWQgcG9sbHMgZm91bmRcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgcG9sbDogbnVsbCB9KTtcbn1cbiJdLCJuYW1lcyI6WyJzdXBhYmFzZSIsIk5leHRSZXNwb25zZSIsIkdFVCIsIm5vdyIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsImRhdGEiLCJsaXZlUG9sbCIsImVycm9yIiwibGl2ZUVycm9yIiwiZnJvbSIsInNlbGVjdCIsImVxIiwibHRlIiwiZ3RlIiwibGltaXQiLCJzaW5nbGUiLCJjb2RlIiwiY29uc29sZSIsImpzb24iLCJzdGF0dXMiLCJwYXJzZWRQb2xsIiwib3B0aW9ucyIsIkpTT04iLCJwYXJzZSIsInBvbGwiLCJzY2hlZHVsZWRQb2xsIiwic2NoZWR1bGVkRXJyb3IiLCJndCIsIm9yZGVyIiwiYXNjZW5kaW5nIiwic3RhcnRzSW5TZWNvbmRzIiwic3RhcnRfdHMiLCJnZXRUaW1lIiwic3RhcnRzX2luX3NlY29uZHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/polls/live/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/.pnpm/@supabase+supabase-js@2.58.0/node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://fqdhbdxlvvddofhdqwpc.supabase.co\";\nconst supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;\nif (!supabaseUrl || !supabaseServiceRoleKey) {\n    throw new Error(\"Supabase URL or Service Role Key is not defined in environment variables.\");\n}\n// Note: this client is for server-side use only, as it uses the service_role key.\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseServiceRoleKey);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDb0Q7QUFFcEQsTUFBTUMsY0FBY0MsMENBQW9DO0FBQ3hELE1BQU1HLHlCQUF5QkgsUUFBUUMsR0FBRyxDQUFDRyx5QkFBeUI7QUFFcEUsSUFBSSxDQUFDTCxlQUFlLENBQUNJLHdCQUF3QjtJQUMzQyxNQUFNLElBQUlFLE1BQU07QUFDbEI7QUFFQSxrRkFBa0Y7QUFDM0UsTUFBTUMsV0FBV1IsbUVBQVlBLENBQUNDLGFBQWFJLHdCQUF1QiIsInNvdXJjZXMiOlsid2VicGFjazovL3B1bHNlY2hlY2svLi9saWIvZGIudHM/MWRmMCJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcydcblxuY29uc3Qgc3VwYWJhc2VVcmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkxcbmNvbnN0IHN1cGFiYXNlU2VydmljZVJvbGVLZXkgPSBwcm9jZXNzLmVudi5TVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZXG5cbmlmICghc3VwYWJhc2VVcmwgfHwgIXN1cGFiYXNlU2VydmljZVJvbGVLZXkpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdTdXBhYmFzZSBVUkwgb3IgU2VydmljZSBSb2xlIEtleSBpcyBub3QgZGVmaW5lZCBpbiBlbnZpcm9ubWVudCB2YXJpYWJsZXMuJylcbn1cblxuLy8gTm90ZTogdGhpcyBjbGllbnQgaXMgZm9yIHNlcnZlci1zaWRlIHVzZSBvbmx5LCBhcyBpdCB1c2VzIHRoZSBzZXJ2aWNlX3JvbGUga2V5LlxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50KHN1cGFiYXNlVXJsLCBzdXBhYmFzZVNlcnZpY2VSb2xlS2V5KVxuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsInN1cGFiYXNlVXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsInN1cGFiYXNlU2VydmljZVJvbGVLZXkiLCJTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIiwiRXJyb3IiLCJzdXBhYmFzZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@14.2.3_react-dom@18.3.1_react@18.3.1__react@18.3.1","vendor-chunks/@supabase+auth-js@2.72.0","vendor-chunks/@supabase+realtime-js@2.15.5","vendor-chunks/@supabase+storage-js@2.12.2","vendor-chunks/@supabase+postgrest-js@1.21.4","vendor-chunks/@supabase+supabase-js@2.58.0","vendor-chunks/whatwg-url@5.0.0","vendor-chunks/@supabase+functions-js@2.5.0","vendor-chunks/tr46@0.0.3","vendor-chunks/webidl-conversions@3.0.1","vendor-chunks/@supabase+node-fetch@2.6.15"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@14.2.3_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpolls%2Flive%2Froute&page=%2Fapi%2Fpolls%2Flive%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpolls%2Flive%2Froute.ts&appDir=E%3A%5CpulsecheckApp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5CpulsecheckApp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();