// Run this on a browser console.

// Did not use Bash, because grep is weird
// Enter the string length here
var input = `input goes here`;

// https://stackoverflow.com/a/364029
// https://stackoverflow.com/a/29136352, i forgor man

// https://learn.microsoft.com/en-us/cpp/build/reference/exports?view=msvc-170
function convert(input, targetDLL, libName, debug) {
    let strBuf = "";

    // cheap hack
    const realModuleName = targetDLL.split(".")[0].toLowerCase();
    const parsedDLL = targetDLL.replaceAll(".", "\\.").toUpperCase();
    // this causes a catasthropic backtracking in PCRE, but not for JS's regex thing, nice!
    const beginRgx = new RegExp(`(?<=\\[[^\\^F]*\\] ${parsedDLL}\\n\\n).+?^(?=\\n)`, "gms");
    // ASSUME it's always the first one
    const beginRes = input.match(beginRgx)[0].trim();
    const funcsData = beginRes.split("\n");

    if (debug) {
        console.log("funcsData :");
        console.log(funcsData.join("\n"));
    }

    // https://github.com/nathan-baggs/dolomite/blob/main/src/ddraw.def
    strBuf += `LIBRARY ${libName}\n`;
    strBuf += `EXPORTS\n`;

    // skip the first 2 lines, it has -------- and Import, Ordinal, basically the legend
    //let countUnresolvedFuncs = 0;
    for (let i = 2; i < funcsData.length; i++) {
        // this checks if the current function is a C function, AND it successfully resolved in our install (Vista)
        const regexIsCfunc = new RegExp(/(?<=\[)[^E]*?C[^E]*?(?=])/);
        const regexIsCfuncUnresolved = new RegExp(/(?<=\[).*?CE.*?(?=])/);
        // HACKHACK: at least 4, which is free()
        //const regexFuncName = new RegExp(/(?<=\s{2})\w{4,}/);
        const regexFuncName = new RegExp(/(?<!\s)\s\s(?!\d+)\w+/);
        const curData = funcsData[i];

        if (debug) {
            console.log("curData :");
            console.log(curData);
        }

        const isCfuncOK = curData.match(regexIsCfunc) != null;
        const isCfuncUnresolved = curData.match(regexIsCfuncUnresolved) != null;
        // ASSUME it's always the first one
        const funcName = curData.match(regexFuncName)[0].trim();

        if (debug) {
            console.log("isCfuncOK :", isCfuncOK);
            console.log("isCfuncUnresolved :", isCfuncUnresolved);
            console.log("funcName :", funcName);
        }

        // yes, 4 spaces. why is the reference for module defs on the Microsoft page uses 3 spaces?
        // starts at 1
        // this made lld-link complain about "duplicate /export options", i guess we don't need them?
        //if (isCfuncUnresolved) strBuf += `    ${funcName} @${++countUnresolvedFuncs}\n`;
        if (isCfuncOK) strBuf += `    ${funcName}=${realModuleName}.${funcName}\n`;
    }
    
    return strBuf;
}

var searchDLL = "KERNEL32.dll";
var libName = "k32r";
console.log(convert(input, searchDLL, libName, true));