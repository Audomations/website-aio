import createBareServer from '@tomphttp/bare-server-node';
import address from 'address';
import chalk from 'chalk';
import { expand } from 'dotenv-expand';
import { config } from 'dotenv-flow';
import express from 'express';
import proxy from 'express-http-proxy';
import { createServer } from 'node:http';
import { join } from 'node:path';
import createRammerhead from 'rammerhead/src/server/index.js';
import { websitePath } from 'website';

// what a dotenv in a project like this serves: .env.local file containing developer port
expand(config());

const rh = createRammerhead();

// used when forwarding the script
const rammerheadScopes = [
	'/rammerhead.js',
	'/hammerhead.js',
	'/transport-worker.js',
	'/task.js',
	'/iframe-task.js',
	'/worker-hammerhead.js',
	'/messaging',
	'/sessionexists',
	'/deletesession',
	'/newsession',
	'/editsession',
	'/needpassword',
	'/syncLocalStorage',
	'/api/shuffleDict',
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

console.log(`${chalk.cyan('Starting the server...')}\n`);

const app = express();

app.use(
	'/api/db',
	proxy(`https://holyubofficial.net/`, {
		proxyReqPathResolver: (req) => `/db/${req.url}`,
	})
);

app.use(
	'/cdn',
	proxy(`https://holyubofficial.net/`, {
		proxyReqPathResolver: (req) => `/cdn/${req.url}`,
	})
);

app.use(express.static(websitePath, { fallthrough: false }));

app.use((error, req, res, next) => {
	if (error.statusCode === 404)
		return res.send(`<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Blocked</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">
  <style>
    html {
      box-sizing: border-box;
      display: flex;
      min-height: 100%;
      min-height: 100vh;
      width: 100%;
    }
    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }
    body {
      background: linear-gradient(to bottom, #444652, #28282E);
      display: flex;
      font: 14px/1.3 "Roboto", Arial, sans-serif;
      min-height: 100%;
      min-height: 100vh;
      margin: 0;
      width: 100%;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .blockScreen {
      align-items: center;
      color: #666e80;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100%;
      min-height: 100vh;
      position: relative;
      text-align: center;
      width: 100%;
      z-index: 0;
    }
    .blockScreen a {
      color: #666e80;
    }
    .blockScreen svg {
      margin: 16px 0 8px;
    }
    .blockScreen .svgAccessBlocked-paths {
      stroke: #00AFD7;
      stroke: #F04848;
    }
    .blockScreen .blockScreen-customSchoolName {
      color: white;
      font: 400 18px/1 "Roboto", Arial, sans-serif;
      margin: 0 16px;
    }
    .blockScreen .lockoutScreen-stripe {
      display: none;
    }
    .blockScreen .lockoutScreen-svg {
      display: none;
    }
    .blockScreen .blockScreen-stripe {
      background: #00AFD7;
      background: #F04848;
      color: rgba(255, 255, 255, 0.8);
      flex: 0 1 auto;
      margin: 32px 0;
      padding: 24px 16px;
      width: 100%;
    }
    .blockScreen .blockScreenStripe-website {
      font: 30px "Roboto", Arial, sans-serif;
      color: white;
    }
    .blockScreen .blockScreen-systemMessage,
    .blockScreen .blockScreen-customBodyText {
      margin: 0 16px 8px;
      max-width: 640px;
    }
    .blockScreen .blockScreen-override {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      color: white;
      display: inline-block;
      line-height: 34px;
      margin: 16px;
      min-width: 80px;
      padding: 0 16px;
      text-align: center;
      text-decoration: none;
      transition: all 0.2s;
    }
    .blockScreen .blockScreen-override:hover {
      background: rgba(255, 255, 255, 0.04);
    }
    .blockScreen .blockScreen-customFooterText {
      bottom: 16px;
      font-size: 12px;
      left: 0;
      padding: 0 16px;
      position: absolute;
      width: 100%;
    }
    .hidden {
      display: none !important;
    }
    .code {
      display: none;
    }
    .lockoutScreen .blockScreen-svg {
      display: none;
    }
    .lockoutScreen .lockoutScreen-svg {
      display: block;
    }
    .lockoutScreen .blockScreen-stripe {
      display: none;
    }
    .lockoutScreen .lockoutScreen-stripe {
      background: #00AFD7;
      background: #F04848;
      color: rgba(255, 255, 255, 0.8);
      display: block;
      flex: 0 1 auto;
      font-size: 32px;
      margin: 32px 0;
      padding: 24px 16px;
      width: 100%;
    }
    .lockoutScreen .lockoutScreen-stripe .lockoutScreen-stripeContent {
      margin: 0 auto;
      max-width: 700px;
    }
    .lockoutScreen .blockScreen-controls {
      margin: 16px 0;
    }
    .lockoutScreen .code {
      background: transparent;
      border: 1px solid #666e80;
      border-bottom-left-radius: 4px;
      border-right: 0;
      border-top-left-radius: 4px;
      color: #666e80;
      display: inline-block;
      font: 14px/1.3 "Roboto", Arial, sans-serif;
      line-height: 34px;
      margin-right: -4px;
      padding: 0 16px;
      vertical-align: top;
    }
    .lockoutScreen .blockScreen-override {
      background: #666e80;
      border-color: #666e80;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      display: inline-block;
      margin: 0;
    }
    .lockoutScreen .blockScreen-override:hover {
      background: rgba(255, 255, 255, 0.2a);
    }
    .termsOfService, .rocketAuth {
      background-color: transparent;
      color: white;
      max-width: 700px;
    }
    .rocketAuth > .button {
      background-color: #00AFD7;
      background-color: #F04848;
      border-color: #00AFD7;
      border-color: #F04848;
      border-radius: 0;
      color: white;
      font-size: 14px;
      height: 36px;
      line-height: 36px;
      padding: 0 16px;
      vertical-align: top;
    }
    input.rocketAuth, select.rocketAuth, .button.rocketAuth{
      border-color: #00AFD7;
      border-color: #F04848;
      border-radius: 0;
      border-style: solid;
      border-width: 2px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      height: 36px;
      min-width: 160px;
      padding: 0 10px;
      -webkit-appearance: none;
    }
    form.rocketAuth {
      margin-bottom: 8px;
    }
    .rocketAuth {
      margin-left: 0 !important;
      margin-right: -2px !important;
    }
    .formElement-optionList {
      list-style: none;
    }
    .m-bottom--8 {
      margin-bottom: 8px!important;
    }
    .m-horizontal--8 {
      margin-left: 8px!important;
      margin-right: 8px!important;
    }
    .m-bottom--0 {
      margin-bottom: 0 !important;
    }
    .m-top--8 {
      margin-top: 8px !important
    }
    .width-min--220px {
      min-width: 220px;
    }
    .position--relative {
      position: relative;
    }
    .bottom--4 {
      bottom: 4px;
    }
    .form--inline > .button, {
      display: inline-block;
    }
    .form--inline > .formElement-input {
      display: inline-block;
      margin: 0 4px 0 0;
    }
    .form--inline > .formElement-optionList {
      display: inline-block;
      margin: 6px 0;
    }
    .form--inline > .formElement-optionList > li {
      display: inline-block;
      margin: 0 4px 0 0;
    }

    /* website not found screen */
    .blockScreen .notFoundScreen {
      display: none;
      width: 100%;
      margin: 16px 0;
      background: #f89e3d;
    }
    .notFoundScreen-stripe {
      display: flex;
      justify-content: center;
      max-width: 656px;
      padding: 64px 0 60px;
      margin: auto;
      color: white;
    }
    .blockScreen .notFoundScreen-svg {
      display: block;
      margin-right: 16px;
    }
    .notFoundScreen-svg-a, .notFoundScreen-svg-b, .notFoundScreen-svg-e { fill: none; }
    .notFoundScreen-svg-a, .notFoundScreen-svg-b { stroke: #fff; stroke-width: 2px; }
    .notFoundScreen-svg-b { stroke-linecap: round; }
    .notFoundScreen-svg-c { fill: #fff; }
    .notFoundScreen-svg-d { stroke: none; }
    .notFoundScreen-errorText {
      margin: 8px 16px 0 0;
      font-size: 1.875rem;
      text-align: center;
    }
    .notFoundScreen-info {
      text-align: left;
    }
    .notFoundScreen-header {
      margin: 4px 0 16px;
      font-size: 1.875rem;
      line-height: 1.3;
      font-weight: 400;
    }
    .notFoundScreen-list {
      padding: 0;
      margin: 2px 0 0;
      list-style: none;
    }
    .notFoundScreen-listItem {
      display: flex;
      align-items: center;
      line-height: 1.75;
    }
    .notFoundScreen-listItem::before {
      content: "";
      display: inline-block;
      width: 7px;
      height: 7px;
      margin-right: 10px;
      border-radius: 50%;
      background: white;
    }
  </style>
</head>
<body>
  <div class="blockScreen">
    <svg class="lockoutScreen-svg" width="128" height="113" xmlns="http://www.w3.org/2000/svg">
      <g class="svgAccessBlocked-paths" stroke="#00AFD7" stroke-width="3" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <path d="M61.919 3.41c1.15-1.883 3.018-1.875 4.162 0l59.475 97.475c1.15 1.884.282 3.411-1.92 3.411H4.364c-2.21 0-3.065-1.535-1.92-3.41L61.918 3.41z"/>
        <path d="M59.259 26.074h9.481v49.778h-9.481z"/>
        <circle cx="64" cy="90.074" r="4.741"/>
        <path d="M33.185 111.407h61.63"/>
      </g>
    </svg>
    <svg class="blockScreen-svg" height="66" viewbox="0 0 66 66" width="66" xmlns="http://www.w3.org/2000/svg">
      <title>access blocked</title>
      <g class="svgAccessBlocked-paths" fill="none" fill-rule="evenodd" stroke="#00AFD7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M33 1C15.327 1 1 15.327 1 33c0 17.673 14.327 32 32 32 17.673 0 32-14.327 32-32"></path>
        <path d="M21.288 21.387v-4.344c0-3.624 2.936-6.562 6.564-6.562h17v10.93c1.35.26 2.37 1.446 2.37 2.883v.822c0 1.44-1.037 2.638-2.4 2.887-.437 6.106-5.53 10.924-11.752 10.924-6.213 0-11.302-4.816-11.75-10.9-1.435-.19-2.542-1.414-2.542-2.91v-.823c0-1.48 1.093-2.702 2.51-2.906zM27.435 38.926l-2.772 5.656h-6.598c-3.385 0-6.398 2.85-6.398 6.196v6.06m42.666-.134v-6.06c0-3.34-2.74-6.062-6.118-6.062h-7.413l-2.77-5.656M53.148 10.48H65v8.297H53.148zM55.52 3.37h7.11v7.11h-7.11z"></path>
      </g>
    </svg>
    <div class="blockScreen-customSchoolName" id="blockScreen-customSchoolName">Lightspeed Classroom Orchestrator</div>
    <div class="blockScreen-stripe">
      <div class="blockScreenStripe-top">
        <span data-translation="oops">Oops</span>,
      </div>
      <div class="blockScreenStripe-website"><span id="host">publichomeschools.gq</span></div>
      <div class="blockScreenStripe-bottom">
        <span data-translation="is_not_available_because">is not available because</span> <span id="reason"> it is categorized as Education</span>.
      </div>
    </div>
    <div class="lockoutScreen-stripe">
      <div class="lockoutScreen-stripeContent">
        <span data-translation="your_access_to_the_internet">Your access to the internet has been suspended for </span> <span id="minutes"></span> <span data-translation="minutes_for_repeatedly_attempting">minutes for repeatedly attempting to visit blocked websites</span>.
      </div>
    </div>

    <section class="notFoundScreen" id="notFoundScreen">
      <div class="notFoundScreen-stripe">
        <div>
          <svg class="notFoundScreen-svg" xmlns="http://www.w3.org/2000/svg" width="104" height="64" viewBox="0 0 104 64">
            <g transform="translate(-368 -359)">
              <g class="notFoundScreen-svg-a" transform="translate(368 359)">
                <rect class="notFoundScreen-svg-d" width="104" height="64" rx="3" />
                <rect class="notFoundScreen-svg-e" x="1" y="1" width="102" height="62" rx="2" />
              </g>
              <line class="notFoundScreen-svg-a" x2="101" transform="translate(369.5 372.5)" />
              <g transform="translate(116.5 -3)">
                <g transform="translate(17 7)">
                  <line class="notFoundScreen-svg-b" x2="4" y2="4" transform="translate(270 384.5)" />
                  <line class="notFoundScreen-svg-b" x1="4" y2="4" transform="translate(270 384.5)" />
                </g>
                <g transform="translate(46 7)">
                  <line class="notFoundScreen-svg-b" x2="4" y2="4" transform="translate(270 384.5)" />
                  <line class="notFoundScreen-svg-b" x1="4" y2="4" transform="translate(270 384.5)" />
                </g>
                <path class="notFoundScreen-svg-b" d="M.5,0a49.035,49.035,0,0,1,16-3,59.424,59.424,0,0,1,17,3"
                  transform="translate(286.5 410.5)" />
              </g>
              <circle class="notFoundScreen-svg-c" cx="2" cy="2" r="2" transform="translate(376 364)" />
              <circle class="notFoundScreen-svg-c" cx="2" cy="2" r="2" transform="translate(381 364)" />
              <circle class="notFoundScreen-svg-c" cx="2" cy="2" r="2" transform="translate(386 364)" />
            </g>
          </svg>
          <div class="notFoundScreen-errorText">Error</div>
        </div>

        <div class="notFoundScreen-info">
          <h1 class="notFoundScreen-header">{{.Host}} cannot be reached</h1>
          <strong>Reasons for this error message include:</strong>
          <ul class="notFoundScreen-list">
            <li class="notFoundScreen-listItem">the website you’re trying to reach doesn’t exist or is broken.</li>
            <li class="notFoundScreen-listItem">the web address was mistyped.</li>
            <li class="notFoundScreen-listItem">you clicked on a link with an error.</li>
            <li class="notFoundScreen-listItem">there is a problem with your Internet connection.</li>
          </ul>
        </div>
      </div>
    </section>

    <div class="blockScreen-systemMessage">
      <span data-translation="logged_in_as">You are logged in as</span> <span id="username">Guest</span> (<span data-translation="ip_address">IP Address</span>: <span id="ip"> Don't worry. Your IP is not saved</span>).
    </div>
    <div class="blockScreen-customBodyText" id="blockScreen-customBodyText">Please note: 

This website is blocked due to inappropriate terms or categories and is not currently considered instructional in nature. All websites blocked for these reasons are logged and available for district and school administrators.

Please contact your teacher if you need this website for instructional purposes.</div>
    <div class="blockScreen-controls">
      <input class="code" id="code" placeholder="Code" data-translation="code" />
      <a href="#" class="blockScreen-override hidden" id="override">
        <span data-translation="override">Override</span>
      </a>
    </div>
    <div class="blockScreen-customFooterText" id="blockScreen-customFooterText">Please note: 

This website is blocked due to inappropriate terms or categories and is not currently considered instructional in nature. All websites blocked for these reasons are logged and available for district and school administrators.

Please contact your teacher if you need this website for instructional purposes.</div>
  </div>
  <textarea id='translations' class='hidden'>{"en":{"access_disabled":"Internet Access has been disabled on this device","code":"Code","custom_block_list":"it is on a custom block list","file_ext_blocked":"the file extension is blocked","ip_address":"IP Address","is_not_available_because":"is not available because","categorized_as":"it is categorized as","logged_in_as":"You are logged in as","minutes_for_repeatedly_attempting":"minutes for repeatedly attempting to visit blocked websites","oops":"Oops","org_youtube_rules":"of your organization's YouTube rules","override":"Override","search_term_used":"of the search term used","your_access_to_the_internet":"Your access to the internet has been suspended for","webzone_rule":"of a WebZone rule"}}</textarea>
  <textarea id='categories' class='hidden'>{"67":"access-denied","3":"ads","103":"adult.lifestyles","42":"alcohol","1002":"Allowed sites","5":"audio-video","37":"automobile","6":"business","115":"business.construction","10":"business.finance","18":"business.jobs","119":"business.manufacturing","73":"business.real_estate","57":"computers","138":"computers.analytics","128":"computers.consumer_electronics","127":"computers.filehosting","136":"computers.storage","34":"directory","8":"drugs","9":"education","47":"education.arts","74":"education.games","99":"education.history","41":"education.lifestyles","48":"education.literature","129":"education.media","50":"education.music","44":"education.science","80":"education.sex","75":"education.social_science","45":"entertainment","131":"entertainment.radio_and_tv","7":"errors","105":"expired","200":"Facebook","95":"family","76":"family.food","43":"family.health","58":"family.religion","1001":"Flipgrid","11":"forums","71":"forums.blogs","118":"forums.dating","19":"forums.email","61":"forums.im","38":"forums.newsgroups","60":"forums.p2p","39":"forums.personals","117":"forums.social_networking","12":"gambling","13":"games","14":"general","15":"government","56":"ham","83":"hobby","40":"humor","202":"Instagram","46":"kids_and_teens","69":"kids_and_teens.chat","68":"law","1":"local-allow","2":"local-block","4":"mature","100":"mature.art","101":"mature.bodyart","102":"mature.games","70":"mature.language","51":"microsoft","49":"music","20":"news","126":"offensive","113":"parked","132":"photography","203":"Pinterest","112":"plagarism","21":"porn","94":"porn.illicit","85":"search","72":"security","134":"security.malware","116":"security.nettools","28":"security.proxy","133":"security.shorteners","135":"security.translators","33":"security.warez","29":"shopping","81":"shopping.auctions","104":"shopping.office_supplies","78":"shopping.spam","79":"society","97":"society.crime","96":"society.politics","55":"spam","30":"sports","139":"sports.esports","82":"sports.fantasy","98":"sports.martial_arts","84":"sports.youth","31":"suspicious","36":"travel","201":"Twitter","0":"unknown","32":"violence","137":"violence.extremism","66":"weapons","59":"world","107":"world.cn","86":"world.de","87":"world.es","88":"world.fr","89":"world.it","90":"world.jp","108":"world.kr","91":"world.nl","106":"world.pl","92":"world.pt","93":"world.ru","900":"youtube"}</textarea>
  <script>
  document.getElementById('host').onclick = () => {
    var win = window.open('javascript:""', "", "width=" + '1980' + ",height=" + '720');
    win.document.write('<html lang="en" data-tab="0" data-theme="night" data-expanded="0"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="/favicon.ico" rel="icon"><script src="/static/js/672.fbc08731.chunk.js" defer="defer"></script><script src="/static/js/main.70b4f1fa.js" defer="defer"></script><link rel="stylesheet" href="/static/css/672.e8599e28.chunk.css"><link rel="stylesheet" href="/static/css/main.a1fbfe8b.css"><style data-emotion="css" data-s=""></style><title>Holy Unblocker</title><style type="text/css" id="tts-styles">[data-tts-block-id].tts-active {background: rgba(206, 225, 255, 0.9) !important;} [data-tts-sentence-id].tts-active {background: rgba(0, 89, 191, 0.7) !important;}</style></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"><style>.h .D,.h .d,.h .q,.h .r,.h .J,.h .w,.h .P{position:absolute;z-index:-10;opacity:0}.h>span{display:inline-block}.h .L,.h .b,.h .g,.h .U,.h .p,.h .V,.h .K{display:inline}</style><div class="Notifications_notifications__CU7Wu"></div><nav class="Navigation_nav__kaV6O"><div class="Navigation_button__qlAoW"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MenuIcon"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg></div><a class="Navigation_entry__d6sXK Navigation_logo__VsgCt" title="Home" href="/"><svg viewBox="0 0 87.1 77.8" xmlns="http://www.w3.org/2000/svg" role="img"><defs></defs><title>Hat </title><ellipse cx="43.572" cy="51.352" rx="41.472" ry="24.375" style="paint-order: stroke; stroke-width: 4; fill: rgb(76, 86, 106); stroke: rgb(237, 240, 245);"></ellipse><path d="M 68.755 14.387 C 68.755 14.878 68.772 50.99 68.772 50.99 C 68.772 50.99 68.755 51.991 68.755 52.504 C 68.755 59.29 57.48 64.791 43.572 64.791 C 29.664 64.791 18.389 59.29 18.389 52.504 C 18.389 51.991 18.389 14.878 18.389 14.387 C 18.389 7.601 29.664 2.1 43.572 2.1 C 57.48 2.1 68.755 7.601 68.755 14.387 Z" style="paint-order: stroke; stroke-width: 4; stroke: rgb(237, 240, 245); fill: rgb(237, 240, 245);"></path><path d="M 18.372 20.091 C 28.414 31.671 59.066 31.251 68.772 20.091 L 68.772 50.99 C 68.772 50.99 68.755 51.991 68.755 52.504 C 68.755 59.29 57.48 64.791 43.572 64.791 C 29.664 64.791 18.389 59.29 18.389 52.504 C 18.389 51.991 18.372 20.091 18.372 20.091 Z" style="paint-order: stroke; stroke-width: 4; stroke: rgb(237, 240, 245); fill: rgb(46, 52, 64);"></path><ellipse cx="43.572" cy="14.387" rx="25.183" ry="12.287" style="paint-order: stroke; stroke-width: 4; fill: rgb(76, 86, 106);"></ellipse><ellipse cx="33.142" cy="42.26" rx="5.84" ry="7.949" style="paint-order: stroke; stroke-width: 4; stroke: rgb(237, 240, 245); fill: rgb(76, 86, 106);"></ellipse><ellipse cx="54.002" cy="42.26" rx="5.84" ry="7.949" style="paint-order: stroke; stroke-width: 4; stroke: rgb(237, 240, 245); fill: rgb(76, 86, 106);"></ellipse><g transform="matrix(1.337784, 0, 0, 1.445033, 8.486388, 26.774675)"><rect x="11.746" y="16.194" width="46.295" height="18.34" style="fill: rgb(76, 86, 106); stroke: rgb(237, 240, 245); stroke-width: 1.43739px;"></rect><text font-size="0.999051858847362em" transform="matrix(1.284239, 0, 0, 1.03933, -19.621738, -42.875137)" x="42.449" y="70.848" width="" height="18.34" style="fill: rgb(237, 240, 245); font-family: Arial, sans-serif; font-weight: 700; stroke-width: 1.70318px; white-space: pre-wrap; text-align: center; text-anchor: middle;">DEV</text></g></svg></a><div class="Navigation_shiftRight__QyilG"></div><a class="Navigation_button__qlAoW" title="Home" href="/7.html"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SettingsIcon"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path></svg></a></nav><div class="Navigation_content__OtVJe"><div class="Navigation_cover__P0fTV"></div><div tabindex="0" class="Navigation_menu__cGYgG"><div class="Navigation_top__Jh4-G"><div class="Navigation_button__qlAoW"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MenuIcon"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg></div><a class="Navigation_entry__d6sXK Navigation_logo__VsgCt" title="Home" href="/"><svg viewBox="0 0 87.1 77.8" xmlns="http://www.w3.org/2000/svg" role="img"><defs></defs><title>Hat </title><ellipse cx="43.572" cy="51.352" rx="41.472" ry="24.375" style="paint-order: stroke; stroke-width: 4; fill: rgb(76, 86, 106); stroke: rgb(237, 240, 245);"></ellipse><path d="M 68.755 14.387 C 68.755 14.878 68.772 50.99 68.772 50.99 C 68.772 50.99 68.755 51.991 68.755 52.504 C 68.755 59.29 57.48 64.791 43.572 64.791 C 29.664 64.791 18.389 59.29 18.389 52.504 C 18.389 51.991 18.389 14.878 18.389 14.387 C 18.389 7.601 29.664 2.1 43.572 2.1 C 57.48 2.1 68.755 7.601 68.755 14.387 Z" style="paint-order: stroke; stroke-width: 4; stroke: rgb(237, 240, 245); fill: rgb(237, 240, 245);"></path><path d="M 18.372 20.091 C 28.414 31.671 59.066 31.251 68.772 20.091 L 68.772 50.99 C 68.772 50.99 68.755 51.991 68.755 52.504 C 68.755 59.29 57.48 64.791 43.572 64.791 C 29.664 64.791 18.389 59.29 18.389 52.504 C 18.389 51.991 18.372 20.091 18.372 20.091 Z" style="paint-order: stroke; stroke-width: 4; stroke: rgb(237, 240, 245); fill: rgb(46, 52, 64);"></path><ellipse cx="43.572" cy="14.387" rx="25.183" ry="12.287" style="paint-order: stroke; stroke-width: 4; fill: rgb(76, 86, 106);"></ellipse><ellipse cx="33.142" cy="42.26" rx="5.84" ry="7.949" style="paint-order: stroke; stroke-width: 4; stroke: rgb(237, 240, 245); fill: rgb(76, 86, 106);"></ellipse><ellipse cx="54.002" cy="42.26" rx="5.84" ry="7.949" style="paint-order: stroke; stroke-width: 4; stroke: rgb(237, 240, 245); fill: rgb(76, 86, 106);"></ellipse><g transform="matrix(1.337784, 0, 0, 1.445033, 8.486388, 26.774675)"><rect x="11.746" y="16.194" width="46.295" height="18.34" style="fill: rgb(76, 86, 106); stroke: rgb(237, 240, 245); stroke-width: 1.43739px;"></rect><text font-size="0.999051858847362em" transform="matrix(1.284239, 0, 0, 1.03933, -19.621738, -42.875137)" x="42.449" y="70.848" width="" height="18.34" style="fill: rgb(237, 240, 245); font-family: Arial, sans-serif; font-weight: 700; stroke-width: 1.70318px; white-space: pre-wrap; text-align: center; text-anchor: middle;">DEV</text></g></svg></a></div><div class="Navigation_menuList__WqCna"><a data-selected="1" class="Navigation_entry__d6sXK" title="Home" href="/"><span class="Navigation_icon__Tv-jx"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="HomeIcon"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg></span><span class="Navigation_name__EoOxA"><span class="h"><span class="b"><span class="c"><span class="t">H</span></span><span class="c"><span class="F">o</span></span><span class="c"><span class="v">m</span><span class="D">m</span></span><span class="c"><span class="l">e</span></span></span></span></span></a><a data-selected="0" class="Navigation_entry__d6sXK" title="Proxy" href="/1.html"><span class="Navigation_icon__Tv-jx"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="WebAssetIcon"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm0 14H5V8h14v10z"></path></svg></span><span class="Navigation_name__EoOxA"><span class="h"><span class="U"><span class="c"><span class="w">y</span><span class="v">P</span></span><span class="c"><span class="R">r</span></span><span class="c"><span class="l">o</span></span><span class="c"><span class="i">x</span></span><span class="c"><span class="R">y</span></span></span></span></span></a><a data-selected="0" class="Navigation_entry__d6sXK" title="FAQ" href="/faq.html"><span class="Navigation_icon__Tv-jx"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="QuestionMarkIcon"><path d="M11.07 12.85c.77-1.39 2.25-2.21 3.11-3.44.91-1.29.4-3.7-2.18-3.7-1.69 0-2.52 1.28-2.87 2.34L6.54 6.96C7.25 4.83 9.18 3 11.99 3c2.35 0 3.96 1.07 4.78 2.41.7 1.15 1.11 3.3.03 4.9-1.2 1.77-2.35 2.31-2.97 3.45-.25.46-.35.76-.35 2.24h-2.89c-.01-.78-.13-2.05.48-3.15zM14 20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"></path></svg></span><span class="Navigation_name__EoOxA"><span class="h"><span class="g"><span class="c"><span class="q">Q</span><span class="l">F</span></span><span class="c"><span class="q">Q</span><span class="t">A</span></span><span class="c"><span class="J">A</span><span class="t">Q</span></span></span></span></span></a><div class="Navigation_bar__F83-S"></div><a data-selected="0" class="Navigation_entry__d6sXK" title="Apps" href="/10.html"><span class="Navigation_icon__Tv-jx"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AppsIcon"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></svg></span><span class="Navigation_name__EoOxA"><span class="h"><span class="K"><span class="c"><span class="l">A</span><span class="D"></span></span><span class="c"><span class="l">p</span><span class="D">q</span></span><span class="c"><span class="l">p</span><span class="d">q</span></span><span class="c"><span class="l">s</span></span></span></span></span></a><a data-selected="0" class="Navigation_entry__d6sXK" title="Favorites" href="/9.html"><span class="Navigation_icon__Tv-jx"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="StarOutlineOutlinedIcon"><path d="m22 9.24-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></svg></span><span class="Navigation_name__EoOxA"><span class="h"><span class="L"><span class="c"><span class="e">F</span><span class="r">r</span></span><span class="c"><span class="e">a</span></span><span class="c"><span class="q">e</span><span class="e">v</span></span><span class="c"><span class="i">o</span><span class="J">h</span></span><span class="c"><span class="F">r</span></span><span class="c"><span class="t">i</span><span class="J">n</span></span><span class="c"><span class="t">t</span></span><span class="c"><span class="F">e</span></span><span class="c"><span class="F">s</span></span></span></span></span></a><div class="Navigation_bar__F83-S"></div><div class="Navigation_title__mkizZ"><span class="h"><span class=""><span class="c"><span class="l">G</span></span><span class="c"><span class="J">e</span><span class="v">a</span></span><span class="c"><span class="R">m</span><span class="D">l</span></span><span class="c"><span class="v">e</span><span class="r">m</span></span><span class="c"><span class="R">s</span></span></span></span></div><a data-selected="0" class="Navigation_entry__d6sXK" title="Popular" href="/13.html"><span class="Navigation_icon__Tv-jx"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SortRoundedIcon"><path d="M4 18h4c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1zm1 6h10c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1z"></path></svg></span><span class="Navigation_name__EoOxA"><span class="h"><span class="L"><span class="c"><span class="v">P</span></span><span class="c"><span class="r">r</span><span class="l">o</span></span><span class="c"><span class="t">p</span><span class="q">a</span></span><span class="c"><span class="F">u</span></span><span class="c"><span class="R">l</span></span><span class="c"><span class="D">p</span><span class="v">a</span></span><span class="c"><span class="r">P</span><span class="l">r</span></span></span></span></span></a><a data-selected="0" class="Navigation_entry__d6sXK" title="All" href="/14.html"><span class="Navigation_icon__Tv-jx"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ListIcon"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"></path></svg></span><span class="Navigation_name__EoOxA"><span class="h"><span class="K"><span class="c"><span class="F">A</span></span><span class="c"><span class="d">l</span><span class="e">l</span></span><span class="c"><span class="t">l</span></span></span></span></span></a><div class="Navigation_title__mkizZ">Genre</div><div class="Navigation_genres__X2aqM"><a title="Action" class="Navigation_entry__d6sXK" href="/12.html?id=action"><span class="h"><span class=""><span class="c"><span class="t">A</span><span class="J">o</span></span><span class="c"><span class="l">c</span><span class="w">n</span></span><span class="c"><span class="R">t</span></span><span class="c"><span class="d">t</span><span class="e">i</span></span><span class="c"><span class="R">o</span></span><span class="c"><span class="w">c</span><span class="t">n</span></span></span></span></a><a title="Platformer" class="Navigation_entry__d6sXK" href="/12.html?id=platformer"><span class="h"><span class=""><span class="c"><span class="t">P</span><span class="d">s</span></span><span class="c"><span class="l">l</span><span class="d">r</span></span><span class="c"><span class="R">a</span></span><span class="c"><span class="v">t</span></span><span class="c"><span class="l">f</span></span><span class="c"><span class="l">o</span><span class="w">o</span></span><span class="c"><span class="i">r</span><span class="P">f</span></span><span class="c"><span class="r">t</span><span class="l">m</span></span><span class="c"><span class="t">e</span></span><span class="c"><span class="e">r</span></span></span></span></a><a title="Shooters" class="Navigation_entry__d6sXK" href="/12.html?id=shooter"><span class="h"><span class=""><span class="c"><span class="F">S</span></span><span class="c"><span class="t">h</span></span><span class="c"><span class="r">e</span><span class="i">o</span></span><span class="c"><span class="e">o</span></span><span class="c"><span class="R">t</span><span class="D">t</span></span><span class="c"><span class="e">e</span></span><span class="c"><span class="l">r</span><span class="J">o</span></span><span class="c"><span class="v">s</span></span></span></span></a><a title="RPG" class="Navigation_entry__d6sXK" href="/12.html?id=rpg"><span class="h"><span class=""><span class="c"><span class="F">R</span></span><span class="c"><span class="F">P</span></span><span class="c"><span class="v">G</span></span></span></span></a><a title="Sandbox" class="Navigation_entry__d6sXK" href="/12.html?id=sandbox"><span class="h"><span class=""><span class="c"><span class="t">S</span></span><span class="c"><span class="l">a</span><span class="D">n</span></span><span class="c"><span class="i">n</span></span><span class="c"><span class="w">b</span><span class="t">d</span></span><span class="c"><span class="R">b</span></span><span class="c"><span class="q">a</span><span class="R">o</span></span><span class="c"><span class="i">x</span><span class="D">a</span></span></span></span></a><a title="Survival" class="Navigation_entry__d6sXK" href="/12.html?id=survival"><span class="h"><span class=""><span class="c"><span class="l">S</span></span><span class="c"><span class="F">u</span><span class="q">l</span></span><span class="c"><span class="r">v</span><span class="e">r</span></span><span class="c"><span class="J">i</span><span class="t">v</span></span><span class="c"><span class="l">i</span></span><span class="c"><span class="F">v</span><span class="w">s</span></span><span class="c"><span class="i">a</span></span><span class="c"><span class="i">l</span></span></span></span></a><a title="Sports" class="Navigation_entry__d6sXK" href="/12.html?id=sports"><span class="h"><span class=""><span class="c"><span class="t">S</span><span class="q">r</span></span><span class="c"><span class="t">p</span></span><span class="c"><span class="i">o</span><span class="r">t</span></span><span class="c"><span class="i">r</span><span class="D">n</span></span><span class="c"><span class="F">t</span></span><span class="c"><span class="d">S</span><span class="e">s</span></span></span></span></a><a title="Puzzle" class="Navigation_entry__d6sXK" href="/12.html?id=puzzle"><span class="h"><span class=""><span class="c"><span class="t">P</span></span><span class="c"><span class="d">l</span><span class="R">u</span></span><span class="c"><span class="r">l</span><span class="i">z</span></span><span class="c"><span class="R">z</span><span class="r">{</span></span><span class="c"><span class="R">l</span></span><span class="c"><span class="l">e</span></span></span></span></a></div></div></div><main class="Home_main__zMKpE"><h1><span class="h"><span class=""><span class="c"><span class="t">E</span></span><span class="c"><span class="D">d</span><span class="t">n</span></span><span class="c"><span class="t">d</span><span class="d">D</span></span></span> <span class=""><span class="c"><span class="J"></span><span class="F">I</span></span><span class="c"><span class="R">n</span></span><span class="c"><span class="l">t</span></span><span class="c"><span class="R">e</span><span class="d">s</span></span><span class="c"><span class="t">r</span><span class="J">r</span></span><span class="c"><span class="t">n</span></span><span class="c"><span class="t">e</span></span><span class="c"><span class="R">t</span></span></span> <span class=""><span class="c"><span class="w"></span><span class="l">C</span></span><span class="c"><span class="v">e</span></span><span class="c"><span class="R">n</span><span class="D">h</span></span><span class="c"><span class="i">s</span></span><span class="c"><span class="e">o</span></span><span class="c"><span class="t">r</span></span><span class="c"><span class="v">s</span></span><span class="c"><span class="i">h</span></span><span class="c"><span class="F">i</span><span class="d">s</span></span><span class="c"><span class="e">p</span></span><span class="c"><span class="v">.</span></span></span></span></h1><h2><span class="h"><span class=""><span class="c"><span class="i">P</span><span class="r"></span></span><span class="c"><span class="v">r</span><span class="d">b</span></span><span class="c"><span class="w">c</span><span class="i">i</span></span><span class="c"><span class="d">a</span><span class="l">v</span></span><span class="c"><span class="e">a</span></span><span class="c"><span class="t">c</span><span class="P">s</span></span><span class="c"><span class="w">r</span><span class="F">y</span></span></span> <span class=""><span class="c"><span class="v">r</span></span><span class="c"><span class="P">h</span><span class="i">i</span></span><span class="c"><span class="v">g</span></span><span class="c"><span class="v">h</span></span><span class="c"><span class="e">t</span><span class="D">i</span></span></span> <span class=""><span class="c"><span class="t">a</span></span><span class="c"><span class="P">t</span><span class="l">t</span></span></span> <span class=""><span class="c"><span class="e">y</span><span class="J"></span></span><span class="c"><span class="v">o</span></span><span class="c"><span class="l">u</span></span><span class="c"><span class="l">r</span></span></span> <span class=""><span class="c"><span class="q"></span><span class="l">f</span></span><span class="c"><span class="d">.</span><span class="l">i</span></span><span class="c"><span class="R">n</span></span><span class="c"><span class="l">g</span><span class="r">h</span></span><span class="c"><span class="i">e</span></span><span class="c"><span class="i">r</span><span class="J">t</span></span><span class="c"><span class="D">e</span><span class="i">t</span></span><span class="c"><span class="v">i</span></span><span class="c"><span class="t">p</span></span><span class="c"><span class="F">s</span></span><span class="c"><span class="e">.</span></span></span></span></h2><button type="button" class="ThemeElements_ThemeButton__KbFfH Home_button__ecGDS"><span class="h"><span class=""><span class="c"><span class="v">G</span><span class="r">u</span></span><span class="c"><span class="R">e</span></span><span class="c"><span class="i">t</span><span class="J">e</span></span></span> <span class=""><span class="c"><span class="F">S</span></span><span class="c"><span class="d">e</span><span class="R">t</span></span><span class="c"><span class="t">a</span></span><span class="c"><span class="F">r</span></span><span class="c"><span class="F">t</span></span><span class="c"><span class="e">e</span></span><span class="c"><span class="P">S</span><span class="F">d</span></span></span></span></button></main><footer class="Footer_footer__grdIK"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto" role="img"><defs><path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path></defs><g><use xlink:href="#wave" x="48" y="0"></use><use xlink:href="#wave" x="48" y="3"></use><use xlink:href="#wave" x="48" y="7"></use></g></svg><div class="Footer_background__Qf15d"><div class="Footer_content__m4MR1"><a class="ThemeElements_themeLink__WtxlZ" href="/contact.html">Contact</a><a class="ThemeElements_themeLink__WtxlZ" href="/0.html">Credits</a><a class="ThemeElements_themeLink__WtxlZ" href="/privacy.html">Privacy</a><a class="ThemeElements_themeLink__WtxlZ" href="/terms.html"><span class="Footer_long__NQ+nr">Terms of Use</span><span class="Footer_short__ig2Da">Terms</span></a><div>© <span class="h"><span class=""><span class="c"><span class="i">H</span><span class="P"></span></span><span class="c"><span class="l">o</span></span><span class="c"><span class="i">l</span></span><span class="c"><span class="R">y</span><span class="q">o</span></span></span> <span class=""><span class="c"><span class="e">U</span></span><span class="c"><span class="R">n</span><span class="P">r</span></span><span class="c"><span class="l">b</span></span><span class="c"><span class="D">c</span><span class="e">l</span></span><span class="c"><span class="R">o</span><span class="D">n</span></span><span class="c"><span class="F">c</span></span><span class="c"><span class="t">k</span><span class="q">l</span></span><span class="c"><span class="e">e</span></span><span class="c"><span class="v">r</span><span class="P">n</span></span></span></span> 2023</div></div></div></footer></div></div></body></html>')
}
  </script>
</body>
</html>`)

	next();
});

const server = createServer();

const bare = createBareServer('/api/bare/');

server.on('request', (req, res) => {
	if (bare.shouldRoute(req)) {
		bare.routeRequest(req, res);
	} else if (shouldRouteRh(req)) {
		routeRhRequest(req, res);
	} else {
		app(req, res);
	}
});

server.on('upgrade', (req, socket, head) => {
	if (bare.shouldRoute(req)) {
		bare.routeUpgrade(req, socket, head);
	} else if (shouldRouteRh(req)) {
		routeRhUpgrade(req, socket, head);
	} else {
		socket.end();
	}
});



const tryListen = (port) =>
	new Promise((resolve, reject) => {
		const cleanup = () => {
			server.off('error', errorListener);
			server.off('listening', listener);
		};

		const errorListener = (err) => {
			cleanup();
			reject(err);
		};

		const listener = () => {
			cleanup();
			resolve();
		};

		server.on('error', errorListener);
		server.on('listening', listener);
		server.listen({
			port,
		});
	});

const ports = [80, 8080, 3000];

const envPort = Number(process.env.PORT);
if (!isNaN(envPort)) ports.unshift(envPort);

while (true) {
	const port = ports.shift() || randomPort();

	try {
		await tryListen(port);

		// clear console:
		process.stdout.write(
			process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
		);

		console.log(
			`You can now view ${chalk.bold('website-aio')} in the browser.`
		);

		console.log('');

		const addr = server.address();

		console.log(
			`  ${chalk.bold('Local:')}            http://${
				addr.family === 'IPv6' ? `[${addr.address}]` : addr.address
			}${addr.port === 80 ? '' : ':' + chalk.bold(addr.port)}`
		);

		console.log(
			`  ${chalk.bold('Local:')}            http://localhost${
				addr.port === 80 ? '' : ':' + chalk.bold(addr.port)
			}`
		);

		try {
			console.log(
				`  ${chalk.bold('On Your Network:')}  http://${address.ip()}${
					addr.port === 80 ? '' : ':' + chalk.bold(addr.port)
				}`
			);
		} catch (err) {
			// can't find LAN interface
		}

		if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
			console.log(
				`  ${chalk.bold('Replit:')}           https://${
					process.env.REPL_SLUG
				}.${process.env.REPL_OWNER}.repl.co`
			);
		}

		console.log('');

		break;
	} catch (err) {
		console.error(chalk.yellow(chalk.bold(`Couldn't bind to port ${port}.`)));
	}
}

function randomPort() {
	return ~~(Math.random() * (65536 - 1024 - 1)) + 1024;
}

/**
 *
 * @param {import('node:http').IncomingRequest} req
 */
function shouldRouteRh(req) {
	const url = new URL(req.url, 'http://0.0.0.0');
	return (
		rammerheadScopes.includes(url.pathname) ||
		rammerheadSession.test(url.pathname)
	);
}

/**
 *
 * @param {import('node:http').IncomingRequest} req
 * @param {import('node:http').ServerResponse} res
 */
function routeRhRequest(req, res) {
	rh.emit('request', req, res);
}

/**
 *
 * @param {import('node:http').IncomingRequest} req
 * @param {import('node:stream').Duplex} socket
 * @param {Buffer} head
 */
function routeRhUpgrade(req, socket, head) {
	rh.emit('upgrade', req, socket, head);
}
