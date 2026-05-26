#include <Windows.h>

__declspec(dllexport) HRESULT WINAPI SetThreadDescription(HANDLE thread, PCWSTR threadDesc) {
    return E_NOTIMPL;
}