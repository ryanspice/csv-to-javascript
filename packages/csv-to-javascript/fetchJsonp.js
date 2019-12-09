//@flow

const defaultOptions = {
  timeout: 500,
  jsonpCallback: 'callback',
  jsonpCallbackFunction: null,
};

const data = new Date();
const rand = Number((String(Math.random()*10000)).replace('.',''));
let i = 0;

class fetchJsonp {

	constructor(_url, options = {}, custom) {

		return this.fetch(_url, options, custom);

	}

	generateCallbackFunction = (e) => {

		let name = ``;

		return this.custom||`jsonp_${data.getTime()}_${rand + i}`;
	}

	clearFunction = (functionName) => {

	  // IE8 throws an exception when you try to delete a property on window
	  // http://stackoverflow.com/a/1824228/751089
	  try {
	    delete window[functionName];
	  } catch (e) {
	    window[functionName] = undefined;
	  }

	}

	removeScript = (scriptId) => {

	  const script = document.getElementById(scriptId);
	  if (script) {
	    document.getElementsByTagName('head')[0].removeChild(script);
	  }

	}

	fetch(_url, options = {}, custom){

	  // to avoid param reassign
	  let url = _url;
	  const timeout = options.timeout || defaultOptions.timeout;
	  const jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;
		console.log(jsonpCallback)
		this.custom = custom;
	  let timeoutId;

	  return new Promise((resolve, reject) => {
	    const callbackFunction = options.jsonpCallbackFunction || this.generateCallbackFunction();
	    const scriptId = custom ||`${jsonpCallback}_${callbackFunction}`;

	    window[callbackFunction] = (response) => {
	      resolve({
	        ok: true,
	        // keep consistent with fetch API
	        json: () => Promise.resolve(response),
	      });

	      if (timeoutId) clearTimeout(timeoutId);

	      this.removeScript(scriptId);

	      this.clearFunction(callbackFunction);
	    };

	    // Check if the user set their own params, and if not add a ? to start a list of params
	    //url += (url.indexOf('?') === -1) ? '?' : '&';

	    const jsonpScript = document.createElement('script');
			jsonpScript.setAttribute('src',url);

			//let src =  url;//custom?`${url}`:`${url}${jsonpCallback}=${callbackFunction}`;
	   // jsonpScript.setAttribute('src', custom || `${url}${jsonpCallback}=${callbackFunction}`);
	    if (options.charset) {
	      jsonpScript.setAttribute('charset', options.charset);
	    }

	    jsonpScript.id = scriptId;
	    document.getElementsByTagName('head')[0].appendChild(jsonpScript);

			let dat;

			window[callbackFunction.split('=')[1]] = function(data){
				(dat = data);
			//	console.log(callbackFunction.split('=')[1](data))
				window[callbackFunction.split('=')[1]] = null;
			}


	    timeoutId = setTimeout((data) => {
	      reject(new Error(`JSONP request to ${_url} failed`));
	      this.clearFunction(callbackFunction);
	      this.removeScript(scriptId);
	      window[callbackFunction] = () => {
	        this.clearFunction(callbackFunction);
	      };

	    }, timeout);

			jsonpScript.onload = async (data) =>{

      	await resolve(
					Object.assign(
						{
							status:200,
							url:url,
							body:(e)=>{return dat?dat:console.warn(`JSONP request to ${_url} contains no callback`)},
							json:(e)=>{return dat?dat:console.warn(`JSONP request to ${_url} contains no callback`)}
						}
					));

				await clearTimeout(timeoutId);

			}

	    // Caught if got 404/500
	    jsonpScript.onerror = () => {
	      reject(new Error(`JSONP request to ${_url} failed`));

	      this.clearFunction(callbackFunction);
	      this.removeScript(scriptId);
	      if (timeoutId) clearTimeout(timeoutId);
	    };
	  });
	}
}

//window.fetchJsonp = fetchJsonp;
export default fetchJsonp;
