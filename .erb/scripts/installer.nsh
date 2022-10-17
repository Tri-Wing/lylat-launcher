!include MUI2.nsh
!include nsDialogs.nsh
!include StdUtils.nsh

; https://github.com/electron-userland/electron-builder/tree/master/packages/app-builder-lib/templates/nsis
; if future changes need to be made, this is an important reference for what options electron-builder provides
; because their docs aren't all encompassing.

!define GC_INSTALLER "gc-driver-install.exe"

; The result of whether we should install drivers or not
var InstallType

!macro customHeader
  ShowInstDetails show
  ShowUninstDetails show
!macroend

!macro customPageAfterChangeDir
  Page custom InstTypePageCreate InstTypePageLeave
  Function InstTypePageCreate
    ${If} ${isUpdated}
      Abort
    ${EndIf}
    !insertmacro MUI_HEADER_TEXT "Select components to install" ""
    nsDialogs::Create /NOUNLOAD 1018
    Pop $0
    ${NSD_CreateRadioButton} 0 50u 100% 10u "Only install Lylat Launcher"
    pop $1
    ${NSD_CreateRadioButton} 0 70u 100% 10u "Also install GameCube adapter drivers (optional)"
    pop $2
    ${If} $InstallType == INSTALL
        ${NSD_Check} $2 ; Select install drivers
    ${Else}
        ${NSD_Check} $1 ; Select skip by default
    ${EndIf}
    ${NSD_CreateLabel} 0 0 100% 30u "Would you like to also install GameCube adapter drivers? This would allow you to use GameCube controllers with a compatible adapter (in Switch/Wii U mode) on your PC. Skip this if you already have GameCube adapter drivers installed."
    pop $3
    nsDialogs::Show
  FunctionEnd

  Function InstTypePageLeave
    ${NSD_GetState} $1 $0
    ${If} $0 = ${BST_CHECKED}
      ; Skip was selected
      StrCpy $InstallType SKIP
    ${Else}
      ${NSD_GetState} $2 $0
      ${If} $0 = ${BST_CHECKED}
        ; Install was selected
        StrCpy $InstallType INSTALL
      ${Else}
        ; Nothing was selected
      ${EndIf}
    ${EndIf}
  FunctionEnd
!macroend

!macro customInstall
  ; Add lylat URI Handling
  DetailPrint "Register lylat URI Handler"
  ${If} $installMode == "all"
    DeleteRegKey HKCR "lylat"
    WriteRegStr HKCR "lylat" "" "URL:lylat"
    WriteRegStr HKCR "lylat" "URL Protocol" ""
    WriteRegStr HKCR "lylat\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
    WriteRegStr HKCR "lylat\shell" "" ""
    WriteRegStr HKCR "lylat\shell\Open" "" ""
    WriteRegStr HKCR "lylat\shell\Open\command" "" "$\"$INSTDIR\${APP_EXECUTABLE_FILENAME}$\" $\"%1$\""
  ${Else}
    DeleteRegKey HKCU "SOFTWARE\Classes\lylat"
    WriteRegStr HKCU "SOFTWARE\Classes\lylat" "" "URL:lylat"
    WriteRegStr HKCU "SOFTWARE\Classes\lylat" "URL Protocol" ""
    WriteRegStr HKCU "SOFTWARE\Classes\lylat\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
    WriteRegStr HKCU "SOFTWARE\Classes\lylat\shell" "" ""
    WriteRegStr HKCU "SOFTWARE\Classes\lylat\shell\Open" "" ""
    WriteRegStr HKCU "SOFTWARE\Classes\lylat\shell\Open\command" "" "$\"$INSTDIR\${APP_EXECUTABLE_FILENAME}$\" $\"%1$\""
  ${EndIf}

  ; Check if we should also install the GC drivers
  ${If} $InstallType == INSTALL
    ; Automatically run gamecube adapter driver installer
    File /oname=$PLUGINSDIR\${GC_INSTALLER} "${BUILD_RESOURCES_DIR}\${GC_INSTALLER}"
    ExecShellWait "" "$PLUGINSDIR\${GC_INSTALLER}" SW_HIDE
  ${EndIf}
!macroend
