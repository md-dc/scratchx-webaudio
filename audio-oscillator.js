/* 
 * ScratchX extension for WebAudio Oscillator
 * 
 * yokobond <koji.yokokawa@yengawa.com>
 */

(function (ext) {
    var audioctx;
    if (typeof (webkitAudioContext) !== "undefined") {
        audioctx = new webkitAudioContext();
    }
    else if (typeof (AudioContext) !== "undefined") {
        audioctx = new AudioContext();
    }

    var osc = audioctx.createOscillator();
    var gain = audioctx.createGain();
    osc.connect(gain);
    gain.connect(audioctx.destination);
    osc.type = "sine";
    osc.frequency.value = 440;
    gain.gain.value = 0.5;
    
    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
        osc.stop(0);
    };


    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    ext.oscillatorType = function (type) {
        osc.type = type;
    }

    ext.oscillatorStart = function () {
        osc.start(0);
    };
    
    ext.oscillatorStop = function () {
        osc.stop(0);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'start oscillator', 'oscillatorStart'],
            [' ', 'stop oscillator', 'oscillatorStop'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('WebAudio Oscillator', descriptor, ext);
})({});

