/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,Button
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import forge from 'node-forge';
import RNFetchBlob from 'rn-fetch-blob'
import { Buffer } from "buffer"
const CryptoJS = require("crypto-js");
var password = "H2n97wHwJ6bFYBPIJjtyNFeiR3JGwSoCfQH6Z19yiks="
var salt = "dBi+jmP3tLgHvTVn9hwuKg=="



export default class App extends React.Component {

  /*
 encrypt(plainText, key, iv) {
  var C = CryptoJS;
  let keyLen = 256 / 32
  let ivLen = 128 / 16
  let keyiv = C.PBKDF2(key, iv, { keySize: keyLen + ivLen, iterations: 1000 })
  let key1 = C.lib.WordArray.create(keyiv.words.slice(0, keyLen));
  let iv1 = C.lib.WordArray.create(keyiv.words.slice(keyLen, keyLen + ivLen));
  plainText = C.enc.Latin1.parse(plainText);
  var aes = C.algo.AES.createEncryptor(key1, {
    mode: C.mode.CBC,
    blocksize: 128,
    keysize: 256,
    padding: C.pad.Pkcs7,
    iv: iv1
  });
  var encrypted = aes.finalize(plainText);
  return C.enc.Latin1.stringify(encrypted);
}*/

 decrypt(encryptedText, key, iv) {
  var C = CryptoJS;
  let keyLen = 256 / 32
  let ivLen = 128 / 16
  let keyiv = C.PBKDF2(key, iv, { keySize: keyLen + ivLen , iterations: 1000})
  let key1 = C.lib.WordArray.create(keyiv.words.slice(0, keyLen));
  let iv1 = C.lib.WordArray.create(keyiv.words.slice(keyLen, keyLen + ivLen));
  encryptedText = C.enc.Latin1.parse(encryptedText);
  var aes = C.algo.AES.createDecryptor(key1, {
    mode: C.mode.CBC,
    padding: C.pad.Pkcs7,
    blocksize: 128,
    keysize: 256,
    iv: iv1
  });
  var decrypted = aes.finalize(encryptedText);
  return C.enc.Latin1.stringify(decrypted);
}

  DownloadRibFile = async () => {
    const { dirs } = RNFetchBlob.fs;
    RNFetchBlob.config({
    fileCache: true,
    appendExt: 'pdf',
    path:
    dirs.MusicDir +
    '/RIB_data.pdf',
    })
    .fetch(
    'GET','http://pdf-hosting.000webhostapp.com/data.pdf',{ 'Content-Type' : 'text/html; charset=latin-1' })
    .then(res => {
     
    let status = res.info().status;
    if (status === 200) {      
        RNFetchBlob.fs.readFile(dirs.MusicDir+'/RIB_data.pdf','base64')
        .catch(console.error)
        .then((data) => {
          data = Buffer.from(data, 'base64').toString('latin1')
          data = this.decrypt(data,password,salt)
          data = Buffer.from(data, 'latin1').toString('base64')
         RNFetchBlob.fs.writeFile(dirs.MusicDir+'/RIB_data_decrypted.pdf', data,'base64');
        }
        );
    } else {

      console.error("potato");
    
    }
    
  }
  );
}

  render() {
		return (
			<View style={styles.container}>
				<Button title="Generate" onPress={() => this.DownloadRibFile()} />

			</View>
		);
  };
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
 


