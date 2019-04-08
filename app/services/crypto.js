import { PrivateKey, ED25519 } from 'echojs-lib';
import bs58 from 'bs58';
import random from 'crypto-random-string';

import { ECHORANDKEY_SIZE, RANDOM_SIZE } from '../constants/global-constants';

class Crypto {

	/**
     *  @method generateWIF
     *
     * 	Generate random string and private key from this seed.
     *
     *  @return {String} privateKeyWIF
     */
	generateWIF() {
		const privateKey = PrivateKey.fromSeed(random(RANDOM_SIZE));

		return privateKey.toWif();
	}

	/**
     *  @method generateEchoRandKey
     *
     * 	Generate random string and private key from this seed.
     *
     *  @return {String} echoRandKey
     */
	generateEchoRandKey() {
		const EchoRandKeyBuffer = ED25519.createKeyPair();
		const echoRandPublicKey = EchoRandKeyBuffer.publicKey;
		const echoRandKey = `DET${bs58.encode(echoRandPublicKey)}`;
		if (echoRandKey.length !== ECHORANDKEY_SIZE) {
			return this.generateEchoRandKey();
		}
		return echoRandKey;
	}

	saveWIF() {

	}

}

export default Crypto;
