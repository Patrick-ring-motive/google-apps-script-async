# google-apps-script-async# google-apps-script-async 🌈

A collection of patterns and utilities for implementing asynchronous behavior and managing concurrency in Google Apps Script (GAS).

## Features

- **Recursive Router**: An advanced `doPost` implementation that distinguishes between external requests and internal "worker" calls.
- **Async Execution**: Patterns for offloading long-running tasks to background "workers" using `UrlFetchApp` to call back into the same script.
- **Concurrency Management**: Utilities for handling multiple simultaneous executions and avoiding race conditions.
- **Cache-based Storage**: Efficient data persistence using GAS `CacheService`.

## Core Components

- `async-post.js`: Contains the recursive routing logic for `doPost`.
- `cache-storage.gs`: Implementation of a cache-backed storage system.
- `concurrency.gs`: Tools for managing concurrent script executions.

## Usage

This project is intended to be used as a template or library within your Google Apps Script projects. The `doPost` function in `async-post.js` serves as the entry point for both external triggers and internal asynchronous workers.
