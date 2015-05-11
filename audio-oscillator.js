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

    function Oscillator(waveType, freqValue, gainValue) {
        this.oscillator = audioctx.createOscillator();
        this.gain = audioctx.createGain();
        this.oscillator.connect(this.gain);
        this.gain.connect(audioctx.destination);
        this.oscillator.type = waveType ? waveType : 'sine';
        this.oscillator.frequency.value = freqValue ? freqValue : 440;
        this.gain.value = gainValue ? gainValue : 0;
    }

    var osc;

    /**
     * return oscillator can be start.
     */
    function getOscilator() {
        if (!osc) {
            osc = new Oscillator();
        }
        return osc;
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
        getOscilator().oscillator.type = type;
    };

    ext.oscillatorFrequency = function (freqValue) {
        getOscilator().oscillator.frequency.value = freqValue;
    };

    ext.oscillatorGain = function (gainValue) {
        getOscilator().gain.gain.value = gainValue;
    };

    ext.oscillatorStart = function () {
        getOscilator().oscillator.start(0);
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
            [' ', 'set oscillator type %m.waveType', 'oscillatorType', 'sine'],
            [' ', 'set oscillator frequency %n', 'oscillatorFrequency', 440],
            [' ', 'set oscillator gain %n', 'oscillatorGain', 0.5]
        ],
        menus: {
            waveType: ["sine", "square", "sawtooth", "triangle"]
        }
    };

    // Register the extension
    ScratchExtensions.register('WebAudio Oscillator', descriptor, ext);
})({});

