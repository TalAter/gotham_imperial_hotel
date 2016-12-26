/*
 <!--
 Progressive UI KITT
 version : 0.0.1
 author  : Tal Ater @TalAter
 license : MIT
 https://github.com/TalAter/Progressive-UI-KITT
 -->
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ProgressiveKITT = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";var _postMessageToClients=function(t,e,n){var o={action:"pkitt-"+e,payload:t};n?"string"==typeof n?self.clients.get(n).then(function(t){t.postMessage(o)}):n.postMessage(o):self.clients.matchAll({includeUncontrolled:!0}).then(function(t){t.forEach(function(t){t.postMessage(o)})})},_parseButtonObject=function(t){return"string"==typeof t?{label:t}:t},addMessage=function(t,e,n){_postMessageToClients({contents:t,options:e},"message",n)},addAlert=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"OK",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:void 0;e=_parseButtonObject(e),_postMessageToClients({contents:t,button:{label:e.label},options:n},"alert",o)},addConfirm=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"OK",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"Cancel",o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:void 0;e=_parseButtonObject(e),n=_parseButtonObject(n),_postMessageToClients({contents:t,button1:{label:e.label},button2:{label:n.label},options:o},"confirm",s)};module.exports={addMessage:addMessage,addAlert:addAlert,addConfirm:addConfirm};
},{}]},{},[1])(1)
});


//# sourceMappingURL=progressive-ui-kitt-sw-helper.js.map