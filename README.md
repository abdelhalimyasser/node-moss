# 🕵️‍♂️ node-moss > **"Because `Ctrl+C` `Ctrl+V` is not a Design Pattern."**

[![npm version](https://img.shields.io/npm/v/node-moss.svg?style=flat-square)](https://www.npmjs.com/package/node-moss) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

## 🧐 What is this?
Welcome to **node-moss**, the sleekest, strictly-typed Node.js client for **Stanford's MOSS** (Measure of Software Similarity). Whether you are a Professor tired of grading the same code 50 times, or a TA hunting for the "Stack Overflow Special," this package connects you to the MOSS server faster than your students can say "git clone."
---

## 🚀 Installation
Stop reinventing the wheel. Install the detective:

```bash
npm install node-moss
```
or visit <a href = "https://www.npmjs.com/package/node-moss">`https://www.npmjs.com/package/node-moss`</a>

---

### ⚡ The "Sting Operation" (Quick Start)
Here is how you catch the impostors in under 10 lines of code:

**TypeScript**
```typescript
import { MOSS } from 'node-moss';

(async () => {
  // 1. Badge up (Use your Stanford MOSS User ID)
  const client = new MOSS("YOUR_USER_ID");

  // 2. Set the rules of engagement
  client.setLanguage("cc"); // C++
  client.setResultLimit(10); // Top 10 copycats

  // 3. Load the evidence
  // You can add files one by one...
  await client.addBaseFile("./skeleton_code.cpp"); // The code you gave them
  await client.addFile("./submission_A.cpp");
  await client.addFile("./submission_B.cpp");

  // ... OR just throw a wildcard net 🕸️
  await client.addByWildcard("./students/assignment1/*.cpp");

  // 4. Send it to the lab 🧪
  console.log("🔍 Scanning for duplicates...");
  const reportUrl = await client.send();

  console.log("🚨 BUSTED! View report here:", reportUrl);
})();
```

## 🧰 Features (The Toolkit)

*   🕵️ **Wildcard Support**: Don't add files manually like a caveman. Use `addByWildcard('./*.js')`.
*   👮‍♂️ **Base Files**: Upload the skeleton code so MOSS knows what not to flag.
*   💬 **Polyglot**: Speaks fluent C, Java, Python, ASCII, and dozens more.
*   📜 **TypeScript Native**: Fully typed. No more guessing what options are available.
*   🚀 **Async/Await**: Non-blocking, because you have other bugs to fix.

## 🌍 Supported Languages
> MOSS supports the following languages (use the exact code with `setLanguage()`):

| Language              | Code         |
|-----------------------|--------------|
| C                     | `c`          |
| C++                   | `cc`         |
| Java                  | `java`       |
| ML                    | `ml`         |
| Pascal                | `pascal`     |
| Ada                   | `ada`        |
| Lisp                  | `lisp`       |
| Scheme                | `scheme`     |
| Haskell               | `haskell`    |
| Fortran               | `fortran`    |
| ASCII files           | `ascii`      |
| VHDL                  | `vhdl`       |
| Perl                  | `perl`       |
| MATLAB                | `matlab`     |
| Python                | `python`     |
| MIPS assembly         | `mips`       |
| Prolog                | `prolog`     |
| SPICE                 | `spice`      |
| Visual Basic          | `vb`         |
| C#                    | `csharp`     |
| Modula-2              | `modula2`    |
| 8086 assembly         | `a8086`      |
| JavaScript            | `javascript` |
| PL/SQL                | `plsql`      |
| Verilog               | `verilog`    |

*Note: This is the full list from the official MOSS Perl script. May Some changes are done.*

## The Methods
### 🔍 Getters
Retrieve current configuration values.

| Method | Returns | Description |
| :--- | :--- | :--- |
| `getUserID()` | `string` | Returns the current User ID. |
| `getSupportedLanguages()` | `string[]` | Returns a list of all supported languages. |
| `getComment()` | `string` | Returns the current comment string. |
| `getDirectoryMode()` | `number` | Returns 0 or 1. |
| `getIgnoreLimit()` | `number` | Returns the current ignore limit. |
| `getResultLimit()` | `number` | Returns the current result limit. |
| `getExperimentalServer()` | `number` | Returns the experimental server status. |

### 🛠️ Configuration (Setters)
Customize how MOSS processes your files.

| Method | Description | Default Value |
| :--- | :--- | :--- |
| `setLanguage(lang)` | Set the programming language (e.g., 'c', 'java', 'python'). | `'c'` |
| `setDirectoryMode(mode)` | Set to 1 to group files by directory (useful for multi-file projects). | `0` (Off) |
| `setResultLimit(n)` | The number of matching files to show in the results. | `250` |
| `setIgnoreLimit(n)` | Ignore code passages that appear in more than `n` files (helps ignore common boilerplate). | `10` |
| `setComment(text)` | A string attached to the report for your own reference. | `""` |
| `setExperimentalServer(x)` | Set to 1 to use the experimental MOSS server. | `0` |
| `setUserID(id)` | Updates the User ID (if not set in constructor). | `-` |

### 📂 File Management
Methods to load student code and skeleton code.

| Method | Description | Async? |
| :--- | :--- | :--- |
| `addFile(path)` | Adds a specific submission file to be checked. | ✅ Yes |
| `addBaseFile(path)` | Adds "skeleton" or "base" code. MOSS will ignore matches found in these files. | ✅ Yes |
| `addByWildcard(pattern)` | Adds multiple files using a glob pattern (e.g., `./src/*.js`). | ✅ Yes |

### 🚀 Execution
The command to start the analysis.

| Method | Description | Returns |
| :--- | :--- | :--- |
| `send()` | Uploads all files and settings to Stanford MOSS and awaits the response. | `Promise<string>` (The URL) |

## ⚠️ Important Note
This is a client. You still need a valid MOSS User ID from Stanford.

*   Don't have one? Send an email to <a href="mailto:moss@moss.stanford.edu?&body=registeruser-mail <your_email>">`moss@moss.stanford.edu`</a> with the body `registeruser-mail <your_email>`.

## 🤝 Contributing
>Found a bug? Want to add support?<br>
Your are welcomed! Fork it, fix it, ship it.

## 📜 License
This project is licensed under MIT License [LICENSE](./LICENSE) file.<br>
2025 MIT © Abdelhalim Yasser

Go forth and keep the code clean. 🧹

