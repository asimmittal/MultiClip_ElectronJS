(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var electron = window.require("electron");
var ipc = electron.ipcRenderer;
var remote = electron.remote;
var clipboard = electron.clipboard;

var lastContent = null;

ipc.send("clipWatcher_init", "");

function getClipboardData() {

    var listFormats = clipboard.availableFormats();
    var currContent = {
        image: null,
        html: null,
        plaintext: null
    };

    //discern content type
    for (var index in listFormats) {
        var contentTypeString = listFormats[index].trim().toLowerCase();
        if (contentTypeString.indexOf("image") >= 0) currContent.image = clipboard.readImage();else if (contentTypeString.indexOf("html") >= 0) currContent.html = clipboard.readHTML();else if (contentTypeString.indexOf("plain") >= 0) currContent.plaintext = clipboard.readText();
    }

    var doNext = true;
    if (currContent.image != null && currContent.plaintext == lastContent) doNext = false;else if (currContent.plaintext == lastContent) doNext = false;

    if (doNext) {
        console.log("---> Sending new clip @", new Date());
        lastContent = currContent.plaintext;
        ipc.send("clipWatcher_newClip", currContent);
    }
}

setInterval(getClipboardData, 500);

},{}]},{},[1]);
