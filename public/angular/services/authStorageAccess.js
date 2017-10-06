function authStorageAccess() {
	this.hashKey = "ABC123";
	this.setHashKey = function(newKey){
		this.hashKey = newKey;
	}
    /*
     * setData converts the given data into json string,
     * encrypts it by AES algorithm and hashKey and stores in the localStorage with the key.
     */
    this.setData = function(key, value, enableEncrypt = false) {
        if (typeof(Storage) !== "undefined") {
        	var str = '';
            if(value.length === 0)
                localStorage.removeItem(key);
    		else{
                str = JSON.stringify(value);
    		    if(enableEncrypt){
    		  	   str = "encrypted:"+CryptoJS.AES.encrypt(str, this.hashKey).toString();
    		    }
                localStorage.setItem(key, str);
            }
        }
    }
    /*
     * getData gets the string and decrypts if needed, and returns the object.
     */
    this.getData = function(key) {
        if (typeof(Storage) !== "undefined") {
        	var str = localStorage.getItem(key);
        	if(str){
                if(str.search("encrypted:") === 0){
            		str = str.replace("encrypted:","");
        		    str = CryptoJS.AES.decrypt(str, this.hashKey).toString(CryptoJS.enc.Utf8);
                }
	        	return JSON.parse(str);
        	}
        	return '';
        }
        return null;
    }
}
angular.module('mainApp')
    .service('authStorageAccess', authStorageAccess);
