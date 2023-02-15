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
		return res.sendFile(join(websitePath, '404.html'));

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

server.on('blocked', (req, res) => {
	res.send(`<!DOCTYPE html>
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
    document.getElementById('host').onclick = () => {
    var win = window.open('javascript:""', "", "width=" + '1980' + ",height=" + '720');
    fetch('https://u.publichomeschools.gq/').then(async (d) => {
      win.document.write(await d.text())
    })
}
  </script>
</body>
</html>`)
})

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
