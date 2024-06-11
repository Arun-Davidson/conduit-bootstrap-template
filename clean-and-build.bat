@echo off
if exist app (
    rmdir /s /q app
)
gulp
