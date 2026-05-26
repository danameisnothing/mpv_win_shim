#include <Windows.h>

// https://github.com/nathan-baggs/dolomite/blob/main/src/ddraw.cpp
__declspec(dllexport) BOOL WINAPI AdjustWindowRectExForDpi(LPRECT rect, DWORD style, BOOL menu, DWORD exStyle, UINT dpi) {
    // for now, just pass without DPI?
    return AdjustWindowRectEx(rect, style, menu, exStyle);
}

__declspec(dllexport) int WINAPI GetSystemMetricsForDpi(int index, UINT dpi) {
    return GetSystemMetrics(index);
}