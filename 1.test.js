
const { Echo, OPERATIONS_IDS, PrivateKey} = require('echojs-lib');
const url = 'ws://127.0.0.1:6311';
const privateKey = PrivateKey.fromWif('5KkYp8qdQBaRmLqLz8WVrGjzkt7E13qVcr7cpdLowgJ1mjRyDx2');
const accountId = '1.2.6';
/** @typedef {ReturnType<Echo['createTransaction']>} Transaction */

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

async function a() {
    let r = Math.random().toString(36).substring(7);
	const echo = new Echo();
	/** @type {string} */
	let assetId;
	await echo.connect(url);
	/** @type {string} */
	// assetId = await echo.createTransaction().addOperation(OPERATIONS_IDS.ASSET_CREATE, {
	// 	issuer: accountId,
	// 	symbol: makeid(4),
	// 	precision: 4,
	// 	common_options: {
	// 		max_supply: '1e15',
	// 		issuer_permissions: 79,
	// 		flags: 0,
	// 		core_exchange_rate: {
	// 			base: { amount: 10, asset_id: `1.3.0` },
	// 			quote: { amount: 1, asset_id: `1.3.1` },
	// 		},
	// 		whitelist_authorities: [],
	// 		blacklist_authorities: [],
	// 		description: '',
	// 	},
	// }).addSigner(privateKey).broadcast().then((txRes) => txRes[0].trx.operation_results[0][1]);

	const value = 123;
	/** @type {Transaction} */
	let tx;
	tx = echo.createTransaction().addOperation(OPERATIONS_IDS.ASSET_ISSUE, {
		asset_to_issue: { asset_id: '1.3.0', amount: '654007457' },
		issue_to_account: accountId,
		issuer: accountId,
	});
	await tx.sign(privateKey);
	return tx.broadcast();
}

let i = new Array(20).fill(1).map(() => a());
Promise.all(i).then(console.log).catch(console.log);