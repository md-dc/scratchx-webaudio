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

    var osc;

    function Oscillator(waveType, freqValue, gainValue) {
        this.oscillator = audioctx.createOscillator();
        this.gain = audioctx.createGain();
        this.oscillator.connect(this.gain);
        this.gain.connect(audioctx.destination);
        this.oscillator.type = waveType ? waveType : 'sine';
        this.oscillator.frequency.value = freqValue ? freqValue : 440;
        this.gain.value = gainValue ? gainValue : 0;
    }

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
        ext.oscillatorStop();
    };


    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    ext.oscillatorType = function (type) {
        osc.oscillator.type = type;
    }

    ext.oscillatorStart = function () {
        if (!osc) {
            osc = new Oscillator();
        }
        osc.oscillator.start(0);
    };

    ext.oscillatorStop = function () {
        if (!osc) {
            return;
        }
        osc.oscillator.stop(0);
        osc = null;
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

