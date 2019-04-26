import { PrivateKey } from 'echojs-lib';

import Services from '../services';

/**
 * Get transaction signers
 *
 * @param account
 * @param keys
 * @param viewed
 *
 * @returns {Promise}
 */
const getSigners = async (account, keys, viewed = []) => {
	let weight = 0;
	let signers = [];

	account.active.key_auths.forEach(([k, w]) => {
		const key = keys.find(({ accountId, publicKey }) => (publicKey === k && accountId === account.id));
		if (key && weight < account.active.weight_threshold) {
			weight += w;
			signers.push(PrivateKey.fromWif(key.wif));
		}
	});

	if (weight >= account.active.weight_threshold) {
		return signers;
	}

	viewed.push(account.id);
	weight = await account.active.account_auths.reduce(async (wght, [id, w]) => {
		if (viewed.includes(id)) {
			return wght;
		}

		try {
			const [signer] = await Services.getEcho().api.getAccounts([id]);
			const accountSigners = await getSigners(signer, keys, viewed);
			signers = signers.concat(accountSigners);
			return wght + w;
		} catch (e) {
			//
			return wght;
		}
	}, weight);

	if (weight < account.active.weight_threshold) {
		throw new Error('Threshold is greater than the sum of keys weight available in Blip');
	}

	return signers;
};

/**
 * Sign transaction
 * @param signer
 * @param tr
 * @returns {Promise}
 */
export const signTransaction = async (signer, tr) => {
	const { publicKeys } = await tr.getPotentialSignatures();

	const keys = await Promise.all(
		publicKeys.map((k) => Services.getUserStorage().getWIFByPublicKey(k)),
	);

	const signers = await getSigners(signer, keys.filter((k) => k));
	signers.map((s) => tr.addSigner(s));
};
